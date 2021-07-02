import React, { useEffect, useState, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, NavbarBrand, NavItem } from "reactstrap";
import { Navbar } from "react-bootstrap";
import axios from "axios";
import { API } from "../config";
import { NotificationManager } from "react-notifications";
import { isAuthenticated } from "../auth";
import NavbarLogo from "../assets/img/Capture.PNG";
import { HiShoppingCart } from "react-icons/hi";
import { AppStateContext } from "../context/AppStateProvider";
import SearchBar from "material-ui-search-bar";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return "#ff9900";
  } else {
    return "aliceblue";
  }
};

const Menu = ({ history }) => {
  const [cartItems, setCartItems] = useState(0);
  const [search, setSearch] = useState("");
  const { cartChanged, setCartChanged, setSearchedProducts } =
    useContext(AppStateContext);
  const handleSignOut = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      setCartItems(0);
      const response = await axios.get(API + "/signout");
      if (response.data.systemMessageType === "success") {
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        const cart = JSON.parse(localStorage.getItem("cart"));
        console.log(cart);
        setCartItems(cart.length);
        if (cartChanged) {
          const user = JSON.parse(localStorage.getItem("user"));
          user.history[0].cart = cart;
          localStorage.setItem("user", JSON.stringify(user));
          console.log({ history: [...user.history] });
          axios.put(
            `${API}/user/${user._id}`,
            { history: [...user.history] },
            {
              headers: {
                Authorization: `${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("cart updated in database");
        }
      }
    }
    setCartChanged(false);
  }, [[], cartChanged]);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      variant="dark"
      className="navbar-custom"
    >
      <NavbarBrand href="/">
        <img src={NavbarLogo} height="50px" />
      </NavbarBrand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse
        id="responsive-navbar-nav"
        style={{ justifyContent: "flex-end" }}
      >
        <Nav>
          <NavItem>
            <SearchBar
              value={search}
              onChange={(newValue) => setSearch(newValue)}
              onRequestSearch={async () => {
                if (search) {
                  const response = await axios.get(
                    `${API}/products/search?search=${search}`
                  );
                  setSearchedProducts(response.data);
                  history.push("/product/search/result");
                  console.log(response);
                }
              }}
            />
          </NavItem>
          <NavItem className="item">
            <Link
              className="nav-link"
              to="/home"
              style={{ color: isActive(history, "/home") }}
            >
              Home
            </Link>
          </NavItem>

          {!isAuthenticated() ? (
            <>
              <NavItem className="item">
                <Link
                  className="nav-link"
                  to="/signin"
                  style={{ color: isActive(history, "/signin") }}
                >
                  Sign In
                </Link>
              </NavItem>
              <NavItem className="item">
                <Link
                  className="nav-link"
                  to="/signup"
                  style={{ color: isActive(history, "/signup") }}
                >
                  Sign Up
                </Link>
              </NavItem>
            </>
          ) : (
            <>
              {JSON.parse(localStorage.getItem("user")).role !== 0 && (
                <NavItem className="item">
                  <Link
                    className="nav-link"
                    to="/admin/dashboard"
                    style={{ color: isActive(history, "/admin/dashboard") }}
                  >
                    Dashboard
                  </Link>
                </NavItem>
              )}
              <NavItem className="item">
                <Link className="nav-link" to="/signin" onClick={handleSignOut}>
                  SignOut
                </Link>
              </NavItem>
              {JSON.parse(localStorage.getItem("user")).role === 0 && (
                <NavItem className="item">
                  <Link
                    className="nav-link"
                    to="/shop/register"
                    style={{ color: isActive(history, "/shop/register") }}
                  >
                    Create Shop
                  </Link>
                </NavItem>
              )}
              <NavItem className="item">
                <Link className="nav-link" to="/cart">
                  <HiShoppingCart fill={isActive(history, "/cart")} size={30} />
                  <sup>
                    <small
                      style={{ color: isActive(history, "/cart") }}
                      className="cart-badge"
                    >
                      {cartItems}
                    </small>
                  </sup>
                </Link>
              </NavItem>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default withRouter(Menu);
