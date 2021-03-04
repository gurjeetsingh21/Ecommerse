import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  FormGroup,
  Button,
  Alert,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from "reactstrap";
import logo from "../assets/Logo.png";
import { Field, Form, Formik, FormikProps } from "formik";
import { Mail, Lock } from "react-feather";
import { Link } from "react-router-dom";
import "../global.scss";

const Signin = () => {
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
                        <a href="/">
                          {/* <img src={logo} alt="" height="24" /> */}
                          <h3 className="d-inline align-middle ml-1 text-logo">
                            Book Your Books
                          </h3>
                        </a>
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
                        onSubmit={(values, actions) => {
                          console.log(values);
                        }}
                        render={({ values }) => (
                          <Form>
                            <FormGroup className="">
                              <Label for="username">Username</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <Mail className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  type="text"
                                  name="username"
                                  id="username"
                                  placeholder="hello@coderthemes.com"
                                  required
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup className="">
                              <Label for="password">Password</Label>
                              {/* <Link
                              to="/account/forget-password"
                              className="float-right text-muted text-unline-dashed ml-1"
                            >
                              Forgot your password?
                            </Link> */}
                              <InputGroup className="mb-3">
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <Lock className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  type="password"
                                  name="password"
                                  id="password"
                                  placeholder="Enter your password"
                                  required
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup className="form-group mb-0 text-center">
                              <Button
                                className="btn-block button"
                                // style={{ backgroundColor: "#d8b049" }}
                                // onClick={this.SuperAdminHandler}
                              >
                                Log In
                              </Button>
                            </FormGroup>
                          </Form>
                        )}
                      />
                      <p className="mt-3">
                        <strong>Username:</strong> test &nbsp;&nbsp;{" "}
                        <strong>Password:</strong> test
                      </p>
                    </Col>

                    <Col md={6} className="d-none d-md-inline-block">
                      <div className="auth-page-sidebar">
                        <div className="overlay"></div>
                        <div className="auth-user-testimonial">
                          <p className="lead">
                            "It's a elegent templete. I love it very much!"
                          </p>
                          <p>- Admin User</p>
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
