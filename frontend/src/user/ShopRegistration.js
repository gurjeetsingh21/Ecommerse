import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
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
import { ShoppingCart, MapPin, User } from "react-feather";
import "../global.scss";
import { NotificationManager } from "react-notifications";
import COLORS from "../assets/css/CssVariables";
import { API } from "../config";
import * as Yup from "yup";

const ShopRegistration = () => {
  const history = useHistory();
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
                      <div className="mx-auto mb-3">
                        <a href="/">
                          {/* <img src={logo} alt="" height="24" /> */}
                          <h3 className="d-inline align-middle ml-1 text-logo">
                            Create Shop
                          </h3>
                        </a>
                      </div>

                      <h6 className="h5 mb-3 mt-2">Welcome!!!</h6>

                      <Formik
                        initialValues={{
                          owner: "",
                          shopName: "",
                          address: "",
                          pincode: "",
                        }}
                        validationSchema={Yup.object().shape({
                          shopName: Yup.string()
                            .required("Shop name is required")
                            .matches(
                              /[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/,
                              "Shop Name must only contain alphabets and space"
                            ),

                          owner: Yup.string()
                            .required("Shop owner's name is required")
                            .matches(
                              /[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/,
                              "Owner's Name must only contain alphabets and space"
                            ),
                          address: Yup.string().required("Address is required"),
                          pincode: Yup.number()
                            .typeError("Pincode must be a number")
                            .required("Pincode is required"),
                        })}
                        onSubmit={async (values, actions) => {
                          const user = JSON.parse(localStorage.getItem("user"));
                          const token = localStorage.getItem("token");
                          try {
                            const response = await axios.post(
                              API + `/shop/create/${user._id}`,
                              {
                                email: user.email,
                                name: values.shopName,
                                owner: values.owner,
                                address: values.address,
                                pincode: values.pincode,
                              },
                              {
                                headers: {
                                  Authorization: token,
                                },
                              }
                            );
                            console.log(response);
                            if (response.data.systemMessageType === "success") {
                              NotificationManager.success(
                                "Your shop has been successfully created. Please login again to continue",
                                "Success",
                                3000
                              );
                              const res = await axios.put(
                                API + `/user/${user._id}`,
                                { role: 1 },
                                {
                                  headers: {
                                    Authorization: token,
                                  },
                                }
                              );
                              console.log(res);
                              localStorage.removeItem("token");
                              localStorage.removeItem("user");
                              localStorage.setItem("cart", JSON.stringify([]));
                              history.push("/signin");
                            } else {
                              NotificationManager.error(
                                response.data.systemMessage,
                                "Error",
                                3000
                              );
                            }
                          } catch (error) {
                            NotificationManager.error(
                              error.response.data.systemMessage,
                              "Error",
                              3000
                            );
                          }
                          console.log(values);
                        }}
                        render={({ values, handleChange }) => (
                          <Form>
                            <FormGroup className="">
                              <Label for="name">Shop Name</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <ShoppingCart className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  onChange={handleChange}
                                  type="text"
                                  name="shopName"
                                  id="username"
                                  placeholder="Enter your shop name"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"shopName"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="mb-3">
                              <Label for="password">Owner Name</Label>
                              {/* <Link
                              to="/account/forget-password"
                              className="float-right text-muted text-unline-dashed ml-1"
                            >
                              Forgot your password?
                            </Link> */}
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <User className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  onChange={handleChange}
                                  name="owner"
                                  id="password"
                                  placeholder="Enter shop owner's name"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"owner"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="">
                              <Label for="username">Address</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <MapPin className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  onChange={handleChange}
                                  name="address"
                                  id="username"
                                  placeholder="Shop address"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"address"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="">
                              <Label for="username">Pincode</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <MapPin className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  onChange={handleChange}
                                  name="pincode"
                                  id="username"
                                  placeholder="Enter shop pincode"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"pincode"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="form-group mb-0 text-center">
                              <Button
                                style={{
                                  background: COLORS.THEME_COLOR,
                                  width: "100%",
                                }}
                                // onClick={this.SuperAdminHandler}
                              >
                                Register
                              </Button>
                            </FormGroup>
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

export default ShopRegistration;
