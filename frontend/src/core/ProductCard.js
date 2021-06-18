import React, { useContext } from "react";
import { withRouter } from "react-router";
import { Card, Col, Row } from "react-bootstrap";
import { Button } from "reactstrap";
import ServeImage from "../components/ServeImage";
import ReadMoreReact from "read-more-react";
import COLORS from "../assets/css/CssVariables";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { API } from "../config";
import { NotificationManager } from "react-notifications";
import { AppStateContext } from "../context/AppStateProvider";

const ProductCard = ({ history, product, location }) => {
  const { setCartChanged } = useContext(AppStateContext);
  const stripePromise = loadStripe(
    "pk_live_51IvQ82SJVrKhBkqWXqzV8G8jNcVYfi1DO45OOr3nmTq5y6xVTOqhzljtM28gwyEMvp8HzLVdMBcPDbmNZTnkpP8K00B3Rhy7Gy"
  );

  const handleBuyNow = async (product) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    // Call your backend to create the Checkout Session
    const response = await axios.post(`${API}/payment`, {
      products: [{ ...product }],
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

  const handleAddToCart = (product) => {
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        cart.push({
          ...product,
          count: 1,
        });
        cart = Array.from(new Set(cart.map((p) => p._id))).map((id) =>
          cart.find((p) => p._id === id)
        );

        localStorage.setItem("cart", JSON.stringify(cart));
        setCartChanged(true);
        NotificationManager.success(
          "Item has been added to your cart",
          "Success",
          3000
        );
      } else {
        history.push("/signin");
        NotificationManager.info(
          "Please log in for adding item to cart",
          "Info",
          3000
        );
      }
    }
  };

  const handleRemove = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const index = cart.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(product)
    );
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(cart);
    setCartChanged(true);
  };

  const handleProductInc = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const index = cart.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(product)
    );
    product.count = product.count + 1;
    cart[index] = product;
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log(cart);
    setCartChanged(true);
  };

  const handleProductDec = (product) => {
    if (product.count > 1) {
      const cart = JSON.parse(localStorage.getItem("cart"));
      const index = cart.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(product)
      );
      product.count = product.count - 1;
      cart[index] = product;
      localStorage.setItem("cart", JSON.stringify(cart));
      console.log(cart);
      setCartChanged(true);
    }
  };
  return (
    <React.Fragment>
      <Card
        style={{
          height: "auto",
          boxShadow: "0px 0px 6px 3px #f3f4f7",
          justifyContent: "center",
          backgroundColor: "#dee1e3",
        }}
      >
        <Card.Body>
          <Row>
            <Col sm={12} md={3}>
              <ServeImage
                item={product}
                type="product"
                style={{
                  height: "100%",
                  border: "1px solid black",
                  boxShadow: "rgb(19 25 33) 0px 0px 11px 1px",
                }}
              />
            </Col>
            <Col sm={12} md={9}>
              <Row>
                <Col sm={12}>
                  <h2 className="product-name">{product.name}</h2>
                </Col>
                <Col sm={12}>
                  <div className="product-author">{`by ${product.author}`}</div>
                </Col>
                <Col sm={12}>
                  <div className="product-description-heading">Description</div>
                </Col>
                <Col sm={12}>
                  <div className="product-decription">
                    <ReadMoreReact
                      text={product.description}
                      readMoreText={"Read More"}
                      min={240}
                      ideal={290}
                      max={340}
                    />{" "}
                  </div>
                </Col>
                <Col sm={12}>
                  <div className="product-price">{`₹ ${product.price.toFixed(
                    2
                  )}`}</div>
                </Col>
                <Col md={4} xs={12} style={{ marginTop: 5 }}>
                  {location.pathname === "/cart" ? (
                    <Button
                      style={{ background: COLORS.THEME_COLOR }}
                      onClick={() => handleRemove(product)}
                    >
                      Remove Item
                    </Button>
                  ) : (
                    <Button
                      style={{ background: COLORS.THEME_COLOR }}
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  )}
                  <Button
                    style={{
                      background: COLORS.THEME_COLOR,
                      marginLeft: 10,
                      width: 110,
                    }}
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </Button>
                </Col>
                {location.pathname === "/cart" ? (
                  <Col
                    md={{ span: 4, offset: 4 }}
                    style={{ marginTop: 5, textAlign: "center" }}
                  >
                    <Button
                      style={{
                        background: COLORS.THEME_COLOR,
                        borderRadius: ".25rem 0rem 0rem .25rem",
                      }}
                      onClick={() => handleProductInc(product)}
                    >
                      +
                    </Button>
                    <Button
                      disabled
                      style={{
                        background: COLORS.THEME_COLOR,
                        borderRadius: "0rem",
                      }}
                    >
                      {product.count}
                    </Button>
                    <Button
                      style={{
                        background: COLORS.THEME_COLOR,
                        borderRadius: "0rem .25rem .25rem 0rem",
                      }}
                      onClick={() => handleProductDec(product)}
                    >
                      -
                    </Button>
                  </Col>
                ) : null}
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default withRouter(ProductCard);
