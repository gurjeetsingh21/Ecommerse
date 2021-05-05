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
import { Mail, Lock, User } from "react-feather";
import "../global.scss";
import { NotificationManager } from "react-notifications";
import COLORS from "../assets/css/CssVariables";
import { API } from "../config";
import * as Yup from "yup";

const Signup = () => {
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
                            Register
                          </h3>
                        </a>
                      </div>

                      <h6 className="h5 mb-3 mt-2">Welcome!!!</h6>

                      <Formik
                        initialValues={{
                          email: "",
                          password: "",
                          name: "",
                        }}
                        validationSchema={Yup.object().shape({
                          name: Yup.string()
                            .required("Name is required")
                            .matches(
                              /^[A-Za-z]+$/,
                              "Name must only contain alphabets"
                            ),
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
                            const response = await axios.post(API + "/signup", {
                              name: values.name,
                              email: values.email,
                              password: values.password,
                            });
                            console.log(response);
                            if (response.data.systemMessageType === "success") {
                              NotificationManager.success(
                                "You have been registered. Please login to continue",
                                "Success",
                                3000
                              );
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
                        }}
                        render={({ values, handleChange }) => (
                          <Form>
                            <FormGroup className="">
                              <Label for="name">Name</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <User className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  onChange={handleChange}
                                  type="text"
                                  name="name"
                                  id="username"
                                  placeholder="Enter your name"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"name"}
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

export default Signup;
