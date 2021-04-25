import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavbarBrand, NavItem } from "reactstrap";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { API } from "../config";
import { NotificationManager } from "react-notifications";
import { isAuthenticated } from "../auth";
import NavbarLogo from "../assets/img/Capture.PNG";
// import { signout, isAuthenticated } from "../auth";
// import { itemTotal } from "./cartHelpers";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history }) => {
  const handleSignOut = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const response = await axios.get(API + "/signout");
      if (response.data.systemMessageType == "success") {
        NotificationManager.success(
          "You have successfully logged out",
          "Success",
          3000
        );
      } else {
        NotificationManager.error(response.data.systemMessage, "Error", 3000);
      }
    } catch (error) {
      NotificationManager.error(
        error.response.data.systemMessage,
        "Error",
        3000
      );
    }
  };
  return (
    <Navbar className="navbar-custom">
      <NavbarBrand href="/">
        <img src={NavbarLogo} height="50px" />
      </NavbarBrand>
      <Nav>
        <NavItem className="item">
          <Link className="nav-link" to="/" style={isActive(history, "/")}>
            Home
          </Link>
        </NavItem>
        {!isAuthenticated() ? (
          <>
            <NavItem className="item">
              <Link
                className="nav-link"
                to="/signin"
                style={isActive(history, "/signin")}
              >
                Sign In
              </Link>
            </NavItem>
            <NavItem className="item">
              <Link
                className="nav-link"
                to="/signup"
                style={isActive(history, "/signup")}
              >
                Sign Up
              </Link>
            </NavItem>
          </>
        ) : (
          <NavItem className="item">
            <Link className="nav-link" to="/signin" onClick={handleSignOut}>
              SignOut
            </Link>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
};

export default withRouter(Menu);
