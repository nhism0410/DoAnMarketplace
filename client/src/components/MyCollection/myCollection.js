import { useCallback, useEffect, useState } from "react";
import { useEth } from "../../contexts";
import { useNavigate } from "react-router-dom";
import Identicon from "identicon.js";

import "../MyCollection/mycollection.css";


export const MyCollection = () => {
  const { state: { contracts } } = useEth();
  const [listItem, setListItem] = useState([]);
  const navigate = useNavigate();

  const getListItem = useCallback(async () => {
    const totalSupply = await contracts.MyCollection.methods.totalSupply().call();
    const _listItem = [];
    for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
      const ownerOfTokenId = await contracts.MyCollection.methods.ownerOf(tokenId).call();
      const approvedOfTokenId = await contracts.MyCollection.methods.getApproved(tokenId).call();
      const metadataOfTokenId = await contracts.MyCollection.methods.tokenMetadata(tokenId).call();
      _listItem.push({
        tokenId,
        owner: ownerOfTokenId,
        approved: approvedOfTokenId,
        name: metadataOfTokenId.name,
        description: metadataOfTokenId.description,
        imageUrl: metadataOfTokenId.imageUrl
      });
    }
    setListItem(_listItem);
  }, [contracts.MyCollection]);

  useEffect(() => {
    if (contracts.MyCollection) getListItem();
  }, [contracts.MyCollection, getListItem]);

  const handleItemClick = (item) => {
    navigate(`/collectiondetail/${item.tokenId}`); // Navigate to the detail page
  };

  return (
    <div className="p-3">
      <h1><b>My Collection</b></h1>
      <div className="d-flex align-items-center justify-content-center">
  {contracts?.MyCollection?.options?.address && (
    <>
      <img
        className="cursor-pointer"
        width="40"
        height="40"
        src={`data:image/png;base64,${new Identicon(contracts.MyCollection.options.address, 40).toString()}`}
        alt="contract-address"
      />
      <span className="ml-2">
        {contracts.MyCollection.options.address} {/* Hiển thị toàn bộ địa chỉ */}
      </span>
    </>
  )}
</div>



      <hr />
      <div className="product-cards">
        {listItem?.map(item => (
          <div key={item.tokenId} className="product-card" onClick={() => handleItemClick(item)}>
            {item.imageUrl && <div className="product-img">
              <img src={item.imageUrl} alt={item.name} />
            </div>}
            <div className="product-info">
              <h3>#{item.tokenId}: {item.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
