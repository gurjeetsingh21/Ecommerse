import React from "react";
import { withRouter } from "react-router";
import { Card, Col, Row } from "react-bootstrap";
import { Button } from "reactstrap";
import ServeImage from "../components/ServeImage";
import ReadMoreReact from "read-more-react";
import COLORS from "../assets/css/CssVariables";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { API } from "../config";

const ProductCard = ({ history, product }) => {
  const stripePromise = loadStripe(
    "pk_test_51IvQ82SJVrKhBkqWxEocQARZw4voqqtkfVzX4R2ln44Fn7Ym8cqU1mXu52AbEnsCTp5x8duhldLbeJPzv0gZ3Pnj00wg2A54tP"
  );
  const handleClick = async (product) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    // Call your backend to create the Checkout Session
    const response = await axios.post(`${API}/payment`, { product: product });
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
                <Col style={{ marginTop: 5 }}>
                  <Button style={{ background: COLORS.THEME_COLOR }}>
                    Add to Cart
                  </Button>
                  <Button
                    style={{
                      background: COLORS.THEME_COLOR,
                      marginLeft: 10,
                      width: 110,
                    }}
                    onClick={() => handleClick(product)}
                  >
                    Buy Now
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default withRouter(ProductCard);
