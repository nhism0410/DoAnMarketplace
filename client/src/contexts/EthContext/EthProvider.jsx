import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";


export const ARTIFACTS = {
  Marketplace: require("../../contracts/Marketplace.json"),
  MyCollection: require("../../contracts/MyCollection.json"),
}

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function initWeb3Fallback() {
    const ganacheUrl = process.env.REACT_APP_DEFAULT_RPC;
    const wsProvider = new Web3.providers.WebsocketProvider(ganacheUrl);
    const web3 = new Web3(wsProvider);
    return { web3, accounts: [] }
  }

  async function initWeb3WithWindowEthereum() {
    const web3 = new Web3(window.ethereum);
    let accounts = await web3.eth.getAccounts();
    if (!accounts.length) {
      const permissions = await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })
      const accountPermission = permissions.find(
        permissions => permissions.parentCapability === 'eth_accounts'
      )
      if (accountPermission) accounts = await web3.eth.getAccounts();
      else return initWeb3Fallback()
    }
    return { web3, accounts }
  }

  const init = useCallback(
    async () => {
        const {web3, accounts } = window.ethereum 
          ? await initWeb3WithWindowEthereum()
          : await initWeb3Fallback()   

        const networkID = await web3.eth.net.getId();
        if (networkID !== web3.utils.toBigInt(process.env.REACT_APP_NETWORK_ID)) {
          console.error('❌ Unsupported netwwork ID: ' + networkID)
        }

        const contracts = {}
        for (const key in ARTIFACTS) {
          const artifact = ARTIFACTS[key]
          try {
            const address = artifact.networks[networkID].address;
            const contract = new web3.eth.Contract(artifact.abi, address);
            contracts[artifact.contractName] = contract;
          } catch (err) {
            console.error(err);
          }
        }

        dispatch({
          type: actions.init,
          data: {web3, accounts, networkID, contracts }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const tryInit = async () => {
        try {
          const artifacts = {
            Marketplace: require("../../contracts/Marketplace.json"),
            MyCollection: require("../../contracts/MyCollection.json"),
          }
          init(artifacts);
        } catch (err) {
          console.error(err);
        }
      };

    tryInit();
    
    if (window.ethereum){
      const events = ['chainChanged', 'accountsChanged'];
      events.forEach(e => window.ethereum.removeListener(e, tryInit))

      return () => events.forEach(e => window.ethereum.removeListener(e, tryInit));
    }
  }, [init]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;