import { useCallback, useEffect, useState } from "react";
import { useEth } from "../../contexts";
import { useNavigate } from "react-router-dom";
import "../NftList/nftlist.css"

export const NftList = () => {
  const { state: { contracts, web3 } } = useEth();
  const [listItem, setListItem] = useState([]);
  const navigate = useNavigate();

  const getListItem = useCallback(() => {
    if (contracts.Marketplace && contracts.MyCollection) {
      (async () => {
        const totalItem = await contracts.Marketplace.methods.totalItem().call();
        const _listItem = [];
        for (let itemId = 0; itemId < totalItem; itemId++) {
          const itemListed = await contracts.Marketplace.methods.items(itemId).call();
          const metadataOfTokenId = await contracts.MyCollection.methods
            .tokenMetadata(itemListed.tokenId)
            .call();
          const { nftContract, tokenId, seller, buyer, price } = itemListed;
          _listItem.push({
            itemId, nftContract, tokenId, seller, buyer, price,
            name: metadataOfTokenId.name,
            imageUrl: metadataOfTokenId.imageUrl // Include imageUrl
          });
        }
        setListItem(_listItem);
      })();
    }
  }, [contracts.Marketplace, contracts.MyCollection]);

  useEffect(() => {
    getListItem();
  }, [getListItem]);

  const handleItemClick = (itemId) => {
    navigate(`/listdetail/${itemId}`); // Điều hướng tới trang chi tiết của item
  };

  return (
    <div className="container">
      <h1>Listed NFTs</h1>
    <div className="product-cards p-3">
      {listItem.map((item) => (
        <div key={item.itemId} className="product-card p-3 my-3">
          {item.imageUrl && (
            <div className="product-img">
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ cursor: 'pointer' }}
                onClick={() => handleItemClick(item.itemId)} // Bấm vào ảnh để chuyển hướng
              />
            </div>
          )}
          <div className="product-info">
            <h3
              style={{ cursor: 'pointer' }}
              onClick={() => handleItemClick(item.itemId)} // Bấm vào tên để chuyển hướng
            >
              #{item.itemId} {item.name}
            </h3>
            <p>Price: {web3.utils.fromWei(item.price, 'ether')} ETH</p>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};
