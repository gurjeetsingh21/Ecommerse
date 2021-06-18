import React, { useContext } from "react";
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
import { Mail, Lock } from "react-feather";

import "../global.scss";
import { NotificationManager } from "react-notifications";
import COLORS from "../assets/css/CssVariables";
import { API } from "../config";
import * as Yup from "yup";
import { AppStateContext } from "../context/AppStateProvider";

const Signin = () => {
  const history = useHistory();
  console.log(process.env.REACT_APP_API_URL);
  const { setCartChanged } = useContext(AppStateContext);
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
                          LOGIN
                        </h3>
                      </div>

                      <h6 className="h5 mb-0 mt-4">Welcome back!</h6>
                      <p className="text-muted mt-1 mb-4">
                        Enter your email address and password to access admin
                        panel.
                      </p>
                      <Formik
                        initialValues={{
                          email: "",
                          password: "",
                        }}
                        validationSchema={Yup.object().shape({
                          email: Yup.string()
                            .required("Email is required")
                            .email("Enter a valid email"),
                          password: Yup.string()
                            .required("Password is required")
                            .min(8, "Minimum 8 characters")
                            .matches(
                              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                              "Password Must contain one oppercase, one lowercase, one number and one special case character"
                            )
                            .max(20, "Maximum 20 characters"),
                        })}
                        onSubmit={async (values, actions) => {
                          try {
                            const response = await axios.post(API + "/signin", {
                              email: values.email,
                              password: values.password,
                            });
                            console.log(response);
                            if (response.data.systemMessageType === "success") {
                              NotificationManager.success(
                                "You have successfully logged in",
                                "Success",
                                3000
                              );
                              localStorage.setItem(
                                "token",
                                response.data.user.token
                              );
                              delete response.data.user.token;
                              localStorage.setItem(
                                "user",
                                JSON.stringify(response.data.user)
                              );
                              localStorage.setItem(
                                "cart",
                                JSON.stringify([
                                  ...response.data.user.history[0].cart,
                                ])
                              );

                              if (response.data.user.role === 1) {
                                history.push("/admin/dashboard");
                              } else {
                                history.push("/");
                              }
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
                        }}
                        render={({ values, handleChange }) => (
                          <Form>
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
                                  placeholder="hello@coderthemes.com"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"email"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="mb-3">
                              <Label for="password">Password</Label>
                              {/* <Link
                              to="/account/forget-password"
                              className="float-right text-muted text-unline-dashed ml-1"
                            >
                              Forgot your password?
                            </Link> */}
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <Lock className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  onChange={handleChange}
                                  type="password"
                                  name="password"
                                  id="password"
                                  placeholder="Enter your password"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"password"}
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
                                Log In
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

export default Signin;
