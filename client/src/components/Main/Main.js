import React from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes and Route
import SiteNavbar from "../SiteNavbar/SiteNavbar";
import Demo from "../ProductForm/index";
import Homepage from "../Homepage/HomePage"; // Ensure this path is correct
import Footer from "../Footer/Footer";
import Profile from "../Profile/Profile"; // Import Profile component
import { MyCollection } from "../MyCollection/myCollection";
import Demo1 from "../NftList";
import Sell from "../SellNft";
import CollectionDetail from "../MyCollection/CollectionDetail"; // Import the CollectionDetail component
import ListDetail from "../NftList/ListDetail";

const Main = ({
  items,
  handleBuyItem,
  handleDeliverItem,
  account,
  relatedItems,
}) => {
  return (
    <div>
      <SiteNavbar account={account} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Homepage items={items} handleBuyItem={handleBuyItem} handleDeliverItem={handleDeliverItem} />} /> {/* Trang chủ */}
          <Route path="/addProduct" element={<Demo />} /> {/* Thêm sản phẩm */}
          <Route path="/myCollection" element={<MyCollection />} /> {/* My Collection */}
          <Route path="/SellNft" element={<Sell />} /> {/* Sell NFT */}
          <Route path="/NftList" element={<Demo1 relatedItems={relatedItems} />} /> {/* Danh sách sản phẩm */}
          <Route path="/collectiondetail/:id" element={<CollectionDetail />} /> {/* Collection Detail */}
          <Route path="/listdetail/:id" element={<ListDetail />} /> {/* Collection Detail */}
          <Route path="/profile" element={<Profile account={account} items={items}  />} /> {/* Trang cá nhân */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default Main;
