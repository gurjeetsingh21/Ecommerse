import React from "react";
import { withRouter } from "react-router";
import { Card, Col, Row } from "react-bootstrap";
import { Button } from "reactstrap";
import ServeImage from "../components/ServeImage";
import ReadMoreReact from "read-more-react";
import COLORS from "../assets/css/CssVariables";

const ProductCard = ({ history, product }) => {
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

{
  /* <GooglePayButton
                    environment="PRODUCTION"
                    paymentRequest={{
                      apiVersion: 2,
                      apiVersionMinor: 0,
                      allowedPaymentMethods: [
                        {
                          type: "CARD",
                          parameters: {
                            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                            allowedCardNetworks: ["MASTERCARD", "VISA"],
                          },
                          tokenizationSpecification: {
                            type: "PAYMENT_GATEWAY",
                            parameters: {
                              gateway: "example",
                            },
                          },
                        },
                      ],
                      merchantInfo: {
                        merchantId: "BCR2DN6TV7L4FCY7",
                        merchantName: "Book Your Books",
                      },
                      transactionInfo: {
                        totalPriceStatus: "FINAL",
                        totalPriceLabel: "Total",
                        totalPrice: `${product.price}`,
                        currencyCode: "IND",
                        countryCode: "IN",
                      },
                    }}
                    onLoadPaymentData={(paymentRequest) => {
                      console.log("load payment data", paymentRequest);
                    }}
                  /> */
}
