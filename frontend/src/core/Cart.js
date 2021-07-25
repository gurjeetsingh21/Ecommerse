import React, { useEffect, useState, useContext } from "react";
import { withRouter } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "./ProductCard";
import "react-rangeslider/lib/index.css";
import { AppStateContext } from "../context/AppStateProvider";
import { Button } from "reactstrap";
import COLORS from "../assets/css/CssVariables";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { API, PK } from "../config";

const Cart = ({ history }) => {
  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [volume, setVolume] = useState(0);
  const { cartChanged, setCartChanged } = useContext(AppStateContext);
  const stripePromise = loadStripe(PK);

  useEffect(() => {
    console.log("cart updated in database");
    let cart = JSON.parse(localStorage.getItem("cart"));
    setProducts(cart);
    setFilteredProducts(cart);
  }, [cartChanged]);

  function filterProducts(product) {
    return product.price <= this;
  }

  const handleOnChange = (value) => {
    console.log(value);
    setVolume(value);
  };

  const handleEmptyCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartChanged(true);
  };

  const handleBuyAll = async () => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    const cart = JSON.parse(localStorage.getItem("cart"));

    // Call your backend to create the Checkout Session
    const response = await axios.post(`${API}/payment`, {
      products: cart,
    });
    console.log(response);

    const session = response.data;

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
      history.push("/checkout/failed");
    }
  };

  return (
    <React.Fragment>
      {filteredProducts.length > 0 ? (
        <Container>
          <Row>
            <Col sm={12}>
              <h2 className="cart-heading">Here are your selected items</h2>
            </Col>
          </Row>
          <Row>
            <Col
              md={{ span: 4, offset: 8 }}
              style={{ marginBottom: 30, textAlign: "end" }}
            >
              <Button
                style={{ background: COLORS.THEME_COLOR }}
                onClick={handleEmptyCart}
              >
                Empty Cart
              </Button>
              <Button
                style={{ background: COLORS.THEME_COLOR, marginLeft: 20 }}
                onClick={handleBuyAll}
              >
                Buy All
              </Button>
            </Col>
          </Row>
          <Row>
            {filteredProducts.map((product, index) => (
              <Col key={index} sm={12} style={{ marginBottom: 30 }}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      ) : (
        <Container>
          <Row>
            <Col>
              <h3 style={{ textAlign: "center", color: "white" }}>
                Sorry, there are no items in your cart
              </h3>
            </Col>
          </Row>
        </Container>
      )}
    </React.Fragment>
  );
};

export default withRouter(Cart);
