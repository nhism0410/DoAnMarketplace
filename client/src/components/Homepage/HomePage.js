import React from "react";
import "../Homepage/homepage.css";
import { MyCollection } from "../MyCollection/myCollection";

const HomePage = () => {
  return (
    <div className="hero__section">
      <div className="single-image-container">
        <img src="./images/home.gif" alt="Home" className="single-image" />
      </div>

      <div className="my-collection-section">
        <MyCollection />
      </div>
    </div>
  );
};

export default HomePage;
