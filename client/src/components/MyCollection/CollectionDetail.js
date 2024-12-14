import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useEth } from "../../contexts";

import '../MyCollection/collectiondetail.css'; // Import CSS để style component

const fetchItem = async (contracts, id, setItem) => {
  if (contracts.MyCollection) {
    const ownerOfTokenId = await contracts.MyCollection.methods.ownerOf(id).call();
    const approvedOfTokenId = await contracts.MyCollection.methods.getApproved(id).call();
    const metadataOfTokenId = await contracts.MyCollection.methods.tokenMetadata(id).call();
    setItem({
      tokenId: id,
      owner: ownerOfTokenId,
      approved: approvedOfTokenId,
      name: metadataOfTokenId.name,
      description: metadataOfTokenId.description,
      imageUrl: metadataOfTokenId.imageUrl,
    });
  }
};

const CollectionDetail = () => {
  const { id } = useParams(); // Lấy tokenId từ URL
  const { state: { contracts, accounts } } = useEth();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetchItem(contracts, id, setItem);
  }, [id, contracts]);

  const handleOnApprove = async (event) => {
    event.preventDefault();

    try {
      const approveTo = event.target.approveTo.value;

      if (!approveTo) {
        alert("Please enter an address to approve.");
        return;
      }

      await contracts.MyCollection.methods
        .approve(approveTo, id)
        .send({ from: accounts[0] });

      alert(`Approval successful for Token ID: ${id}`);
      fetchItem(contracts, id, setItem); // Refresh item data
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Approval failed");
    }
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
        <p><strong>Owner:</strong> {item.owner}</p>
        <p><strong>Approved:</strong> {item.approved ? ` ${item.approved}` : 'No'}</p>

        <div className="owner-info">
          <h4>Owner Identicon</h4>
          <div className="info">
            <p>{item.owner}</p>
          </div>
        </div>

        <form onSubmit={handleOnApprove}>
          <input
            type="text"
            placeholder="Approve to 0x..."
            name="approveTo"
            className="form-control my-2"
          />
          <button type="submit" className="btn btn-primary">Approve</button>
        </form>
      </div>
    </div>
  );
};

export default CollectionDetail;
