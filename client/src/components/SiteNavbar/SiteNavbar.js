import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import Identicon from "identicon.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import logo from "../images/logo.png"; // Adjust path if needed
import { Link, NavLink } from "react-router-dom"; // Import Link and NavLink
import { useEth } from "../../contexts"; // Import useEth hook

const SiteNavbar = () => {
  // Lấy account từ context (useEth)
  const { state: { accounts } } = useEth();
  const account = accounts[0]; // Đảm bảo lấy account[0]

  return (
    <Navbar className="custom-navbar" expand="lg">
      <Navbar.Brand>
        <Link to="/">
          <img src={logo} alt="Logo" style={{ height: "120px" }} />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <i className="ri-home-heart-fill"></i> Home
          </NavLink>
          <NavLink
            to="/addProduct"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <i className="ri-function-add-fill"></i> Add Collection
          </NavLink>
          <NavLink
            to="/MyCollection"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <i className="ri-file-list-2-fill"></i> My Collection
          </NavLink>
          <NavLink
            to="/SellNft"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <i className="ri-file-list-2-fill"></i> Sell NFTs
          </NavLink>
          <NavLink
            to="/NftList"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <i className="ri-file-list-2-fill"></i> NFTs List
          </NavLink>
        </Nav>
      </Navbar.Collapse>
      <Nav.Item className="d-flex align-items-center ml-2">
        {account && (
          <>
            <img
              className="ml-2 cursor-pointer"
              width="40"
              height="40"
              src={`data:image/png;base64,${new Identicon(account, 40).toString()}`}
              alt="profile"
            />
            <span className="ml-2">
              {`${account.slice(0, 6)}...${account.slice(-4)}`}
            </span>
          </>
        )}
      </Nav.Item>
    </Navbar>
  );
};

export default SiteNavbar;
