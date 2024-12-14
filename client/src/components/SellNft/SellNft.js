import React, { useState } from 'react';
import { useEth } from '../../contexts';
import "../SellNft/sellnft.css"
import Identicon from "identicon.js";
const SellNft = () => {
  const { state: { accounts, contracts, web3 } } = useEth();

  const [nftCollection, setNftCollection] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');

  const sellNft = async () => {
    const priceInWei = web3.utils.toWei(price, 'ether');
    await contracts.Marketplace.methods
      .sellNft(nftCollection, tokenId, priceInWei)
      .send({ from: accounts[0] });
  };

  return (
    <div className="product-form-container">
      <div className="header-section">
          <h2><b>Sell Item</b></h2>
          
          <div className="d-flex align-items-center justify-content-center">
          {contracts?.Marketplace?.options?.address && (
             <>
               <img
                 className="cursor-pointer"
                 width="40"
                 height="40"
                 src={`data:image/png;base64,${new Identicon(contracts.MyCollection.options.address, 40).toString()}`}
                 alt="contract-address"
               />
               <span className="ml-2">
                 {contracts.Marketplace.options.address}
               </span>
             </>
           )}
         </div>
        </div>
      <div className="form-container">
        

        <div className="form-content">
          <div className="form-section">
            <input
              type="text"
              placeholder="NFT Collection address"
              className="form-control my-3"
              value={nftCollection}
              onChange={(e) => setNftCollection(e.target.value)}
            />
            <input
              type="text"
              placeholder="Token ID"
              className="form-control my-3"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Price (ETH)"
              className="form-control my-3"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <div className="btn btn-primary" onClick={sellNft}>Sell</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellNft;
