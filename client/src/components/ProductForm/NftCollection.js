import { useState } from "react";
import { useEth } from "../../contexts";
import Identicon from "identicon.js";
import axios from 'axios';
import "../ProductForm/productform.css"

export const NftCollection = () => {
  const { state: { accounts, contracts } } = useEth();
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImage, setItemImage] = useState(null); 

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'NFT_Collection'); 
    const response = await axios.post('https://api.cloudinary.com/v1_1/dsxr9yvxt/image/upload', formData); 
    return response.data.secure_url; 
  };

  const createItem = async () => {
    try {
      if (!itemImage) {
        alert('Please upload an image');
        return;
      }

      const imageUrl = await uploadImageToCloudinary(itemImage); 

      await contracts.MyCollection.methods
        .mint(accounts[0], itemName, itemDescription, imageUrl)
        .send({ from: accounts[0] });

      setItemName('');
      setItemDescription('');
      setItemImage(null);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleImageChange = (event) => {
    setItemImage(event.target.files[0]);
  };

  return (
    <div className="p-3">
    <div className="header-section text-center mb-4">
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
        {contracts.MyCollection.options.address}
      </span>
    </>
  )}
</div>

    </div>
  
    <hr />
  
    
  
    <div className="form-container d-flex flex-column align-items-center">
  <h2 className="text-center mb-4">Create Item</h2>

  <div className="form-content d-flex">
   

    {/* Phần form nằm bên phải */}
    <div className="form-section ml-4">
      <input
        type="text"
        placeholder="Name"
        className="form-control my-3"
        value={itemName}
        onChange={event => setItemName(event.target.value)}
      />
      <textarea
        rows={3}
        placeholder="Description"
        className="form-control my-3"
        value={itemDescription}
        onChange={event => setItemDescription(event.target.value)}
      />
      <input
        type="file"
        className="form-control my-3"
        onChange={handleImageChange}
      />
      <div className="btn btn-primary" onClick={createItem}>Create</div>
    </div>
  </div>
</div>

  </div>
  
  );
};
