import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEth } from "../../contexts";
// import '../NftList/listdetail.css'; // Import CSS để style component

const fetchItemDetail = async (contracts, id, setItem) => {
  if (contracts.Marketplace && contracts.MyCollection) {
    const itemListed = await contracts.Marketplace.methods.items(id).call();
    const metadataOfTokenId = await contracts.MyCollection.methods.tokenMetadata(itemListed.tokenId).call();
    const { nftContract, tokenId, seller, buyer, price } = itemListed;

    setItem({
      itemId: id,
      nftContract,
      tokenId,
      seller,
      buyer,
      price,
      name: metadataOfTokenId.name,
      description: metadataOfTokenId.description,
      imageUrl: metadataOfTokenId.imageUrl
    });
  }
};

const ListDetail = () => {
  const { id } = useParams(); // Lấy itemId từ URL
  const { state: { contracts, web3, accounts } } = useEth();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetchItemDetail(contracts, id, setItem);
  }, [id, contracts]);

  const buyNft = async (itemId, price) => {
    await contracts.Marketplace.methods
      .buyNft(itemId)
      .send({ from: accounts[0], value: price });

    fetchItemDetail(contracts, id, setItem); // Refresh item data
  };

  if (!item) {
    return <p>Loading...</p>;
  }

  return (
    <div className="collection-detail-container">
      <div className="collection-detail-left">
        <div className="collection-detail-img">
          {item.imageUrl && (
            <img src={item.imageUrl} alt={item.name} className="product-image" />
          )}
        </div>
        <div className="collection-detail-description">
          <h3>Description</h3>
          <div className="description-content">
            <p>{item.description}</p>
          </div>
        </div>
      </div>

      <div className="collection-detail-right">
        <h2>{item.name}</h2>
        <p><strong>Token ID:</strong> #{item.tokenId}</p>
        <p><strong>Price:</strong> {web3.utils.fromWei(item.price, 'ether')} ETH</p>
        <p><strong>Seller:</strong> {item.seller}</p>
        <p><strong>Buyer:</strong> {item.buyer || 'Not purchased yet'}</p>

        <div className="owner-info">
          <h4>Seller Identicon</h4>
          <div className="info">
            <p>{item.seller}</p>
          </div>
        </div>

        <button onClick={() => buyNft(item.itemId, item.price)} className="btn btn-primary mt-2">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ListDetail;
