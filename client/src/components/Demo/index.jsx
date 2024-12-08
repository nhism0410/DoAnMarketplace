import { useEth } from "../../contexts";
import { Marketplace } from "./Marketplace";
import { NftCollection } from "./NftCollection";

function Demo() {
  const { state: { accounts } } = useEth();

  return (
    <div className="row">
      <div className="col-5">
        <NftCollection />
      </div>

      <div className="col-7">
        <Marketplace />
      </div>

      <div className="col">
        Your address: {accounts[0]}
      </div>
    </div>
  );
}

export default Demo;