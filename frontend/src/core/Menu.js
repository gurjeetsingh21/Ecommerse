import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";
// import { signout, isAuthenticated } from "../auth";
// import { itemTotal } from "./cartHelpers";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history }) => (
  <Nav className="navbar-custom">
    <NavItem className="item">
      <Link className="nav-link" to="/">
        Home
      </Link>
    </NavItem>
    <NavItem className="item">
      <Link className="nav-link" to="/signin">
        Signin
      </Link>
    </NavItem>
    <NavItem className="item">
      <Link className="nav-link" to="/signup">
        Signup
      </Link>
    </NavItem>
  </Nav>
);

export default withRouter(Menu);
