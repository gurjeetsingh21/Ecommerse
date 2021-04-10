import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavbarBrand, NavItem } from "reactstrap";
import { Container, Row, Col } from "react-bootstrap";
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
  <Container fluid>
    <Row>
      <Col xs={12}>
        <Navbar className="navbar-custom">
          <NavbarBrand href="/">Book Your Books</NavbarBrand>
          <Nav>
            <NavItem className="item">
              <Link className="nav-link" to="/" style={isActive(history, "/")}>
                Home
              </Link>
            </NavItem>
            <NavItem className="item">
              <Link
                className="nav-link"
                to="/signin"
                style={isActive(history, "/signin")}
              >
                SignIn
              </Link>
            </NavItem>
            <NavItem className="item">
              <Link
                className="nav-link"
                to="/signup"
                style={isActive(history, "/signup")}
              >
                SignUp
              </Link>
            </NavItem>
          </Nav>
        </Navbar>
      </Col>
    </Row>
  </Container>
);

export default withRouter(Menu);
