import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory, withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  FormGroup,
  Button,
  InputGroup,
  InputGroupAddon,
  Input,
} from "reactstrap";
import { Form, Formik, ErrorMessage } from "formik";
import { Mail, User, CreditCard, Calendar } from "react-feather";

import "../global.scss";
import { NotificationManager } from "react-notifications";
import COLORS from "../assets/css/CssVariables";
import { API } from "../config";
import * as Yup from "yup";
import {
  useStripe,
  useElements,
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import _ from "lodash";

const CheckoutForm = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardNumberElement = elements.getElement(CardNumberElement);
    console.log(cardNumberElement, "Gurjeet");

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      cardNumber: CardNumberElement,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
    }
  };

  return (
    <React.Fragment>
      <div className="my-5">
        <Container>
          <Row className="justify-content-center">
            <Col xl={10}>
              <Card className="">
                <CardBody className="p-0">
                  <Row>
                    <Col md={6} className="p-5 position-relative">
                      <div className="mx-auto mb-5">
                        <h3 className="d-inline align-middle ml-1 text-logo">
                          Pay with Card
                        </h3>
                      </div>

                      <h6 className="h5 mb-0 mt-4">Enjoy reading your book</h6>
                      <p className="text-muted mt-1 mb-4">
                        Please book your book by entering the following details
                        and relax. Your book will reach at your doorstep.
                      </p>
                      <Formik
                        initialValues={{
                          email: "",
                          name: "",
                          cardNumber: "",
                          expiryDate: "",
                          cvv: "",
                        }}
                        validationSchema={Yup.object().shape({
                          email: Yup.string()
                            .required("Email is required")
                            .email("Enter a valid email"),
                        })}
                        onSubmit={async (values, actions) => {
                          console.log("Gurjeet");
                          if (!stripe || !elements) {
                            // Stripe.js has not loaded yet. Make sure to disable
                            // form submission until Stripe.js has loaded.
                            return;
                          }

                          // Get a reference to a mounted CardElement. Elements knows how
                          // to find your CardElement because there can only ever be one of
                          // each type of element.

                          // Use your card Element with other Stripe.js APIs
                          const { error, paymentMethod } =
                            await stripe.createPaymentMethod({
                              type: "card",
                              card: elements.getElement(CardNumberElement),
                              card: elements.getElement(CardExpiryElement),
                              card: elements.getElement(CardCvcElement),
                            });

                          if (error) {
                            console.log("[error]", error);
                          } else {
                            console.log("[PaymentMethod]", paymentMethod);
                          }
                        }}
                        render={({
                          values,
                          errors,
                          touched,
                          handleChange,
                          setFieldValue,
                        }) => (
                          <Form>
                            <FormGroup className="">
                              <Label for="username">Name on card</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <User className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  onChange={handleChange}
                                  name="name"
                                  id="name"
                                  placeholder="John Smith"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name="name"
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="">
                              <Label for="username">Email ID</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <Mail className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  onChange={handleChange}
                                  name="email"
                                  id="username"
                                  placeholder="johnsmith@gmail.com"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"email"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="mb-3">
                              <Label for="password">Card Number</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <CreditCard className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <CardNumberElement
                                  id="cc-number"
                                  className="form-control"
                                  name="cardNumber"
                                  onChange={handleChange}

                                  // options={CARD_ELEMENT_OPTIONS}
                                />
                              </InputGroup>
                              <ErrorMessage
                                name="cardNumber"
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <Row>
                              <Col md={6}>
                                <FormGroup className="mb-3">
                                  <Label for="password">Expiration Date</Label>
                                  <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                      <span className="input-group-text">
                                        <Calendar className="icon-dual" />
                                      </span>
                                    </InputGroupAddon>
                                    <CardExpiryElement
                                      id="expiry"
                                      className="form-control"
                                      name="expiryDate"
                                      onChange={handleChange}
                                      // options={CARD_ELEMENT_OPTIONS}
                                    />
                                  </InputGroup>
                                  <ErrorMessage
                                    name="expiryDate"
                                    expirationDate="error"
                                    component="div"
                                  />
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup className="mb-3">
                                  <Label for="password">CVV</Label>
                                  <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                      <span className="input-group-text">
                                        <Calendar className="icon-dual" />
                                      </span>
                                    </InputGroupAddon>
                                    <CardCvcElement
                                      id="cvv"
                                      name="cvv"
                                      onChange={handleChange}
                                      className="form-control"
                                      // options={CARD_ELEMENT_OPTIONS}
                                    />
                                  </InputGroup>
                                  <ErrorMessage
                                    name="cvv"
                                    expirationDate="error"
                                    component="div"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                            <FormGroup className="form-group mb-0 text-center">
                              <Button
                                style={{
                                  background: COLORS.THEME_COLOR,
                                  width: "100%",
                                }}
                                type="submit"
                                // onClick={(e) => submitHandler(e)}
                                disabled={!stripe}
                              >
                                Proceed to pay
                              </Button>
                            </FormGroup>
                            {errors &&
                              _.isString(errors) &&
                              touched &&
                              _.isArray(touched) && (
                                <div className="field-error">{errors}</div>
                              )}
                            <div className={"row"}>
                              <div className={"col-12"}>
                                <code>
                                  <pre>
                                    Values: {JSON.stringify(values, null, 2)}
                                  </pre>
                                </code>
                              </div>
                              <div className={"col-12"}>
                                <pre>
                                  Errors: {JSON.stringify(errors, null, 2)}
                                </pre>
                              </div>
                              <div className={"col-12"}>
                                <pre>
                                  Touched: {JSON.stringify(touched, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </Form>
                        )}
                      />
                      {/* <p className="mt-3">
                        <strong>Username:</strong> test &nbsp;&nbsp;{" "}
                        <strong>Password:</strong> test
                      </p> */}
                    </Col>

                    <Col md={6} className="d-none d-md-inline-block">
                      <div className="auth-page-sidebar">
                        <div className="overlay"></div>
                        <div className="auth-user-testimonial">
                          {/* <p className="lead">
                            "It's a elegent templete. I love it very much!"
                          </p> */}
                          {/* <p>- Admin User</p> */}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const Checkout = () => {
  const stripePromise = loadStripe(
    "pk_test_51IvQ82SJVrKhBkqWxEocQARZw4voqqtkfVzX4R2ln44Fn7Ym8cqU1mXu52AbEnsCTp5x8duhldLbeJPzv0gZ3Pnj00wg2A54tP"
  );

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default withRouter(Checkout);
