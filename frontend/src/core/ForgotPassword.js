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
import { Mail } from "react-feather";

import "../global.scss";
import { NotificationManager } from "react-notifications";
import COLORS from "../assets/css/CssVariables";
import { API } from "../config";
import * as Yup from "yup";

const ForgotPassword = () => {
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
                      <div className="mx-auto mb-5">
                        <h3 className="d-inline align-middle ml-1 text-logo">
                          Forgot Password
                        </h3>
                      </div>

                      <h6 className="h5 mb-0 mt-4">Welcome back!</h6>
                      <p className="text-muted mt-1 mb-4">
                        Enter your email address and follow the instructions to
                        recover your account
                      </p>
                      <Formik
                        initialValues={{
                          email: "",
                        }}
                        validationSchema={Yup.object().shape({
                          email: Yup.string()
                            .required("Email is required")
                            .email("Enter a valid email"),
                        })}
                        onSubmit={async (values, actions) => {
                          try {
                            const response = await axios.post(
                              API + "/forgot-password",
                              {
                                email: values.email,
                              }
                            );
                            console.log(response);
                            if (response.data.systemMessageType === "success") {
                              NotificationManager.success(
                                response.data.systemMessage,
                                "Success",
                                3000
                              );
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

                            <FormGroup className="form-group mb-0 text-center">
                              <Button
                                style={{
                                  background: COLORS.THEME_COLOR,
                                  width: "100%",
                                }}
                                // onClick={this.SuperAdminHandler}
                              >
                                Recover Account
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

export default ForgotPassword;
