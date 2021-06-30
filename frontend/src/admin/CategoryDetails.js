import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
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
import { ShoppingBag } from "react-feather";
import "../global.scss";
import { NotificationManager } from "react-notifications";
import COLORS from "../assets/css/CssVariables";
import { API } from "../config";
import * as Yup from "yup";
import { IoImageOutline } from "react-icons/io5";

const CreateCategory = ({ history }) => {
  return (
    <React.Fragment>
      <div className="my-5">
        <Container>
          <Row className="justify-content-center">
            <Col xl={10}>
              <Card className="">
                <CardBody className="p-0">
                  <Row style={{ justifyContent: "center" }}>
                    <Col md={6} className="p-5 position-relative">
                      <div className="mx-auto mb-5">
                        <h3 className="d-inline align-middle ml-1 text-logo">
                          Create Category
                        </h3>
                      </div>

                      <h6 className="h5 mb-0 mt-4">Hey There!</h6>
                      <p className="text-muted mt-1 mb-4">
                        Create a category so that you could add books to it
                        later.
                      </p>
                      <Formik
                        initialValues={{
                          name: "",
                          image: "",
                          photo: null,
                        }}
                        validationSchema={Yup.object().shape({
                          name: Yup.string().required(
                            "Category name is required"
                          ),
                          image: Yup.string().required("Image is required"),
                        })}
                        onSubmit={async (values, actions) => {
                          const user = JSON.parse(localStorage.getItem("user"));
                          const token = localStorage.getItem("token");
                          let formData = new FormData();
                          formData.append("name", values.name);
                          formData.append("photo", values.photo);
                          try {
                            const response = await axios.post(
                              API + `/category/create/${user._id}`,
                              formData,
                              {
                                headers: {
                                  Authorization: token,
                                },
                              }
                            );
                            if (response.data.systemMessageType === "success") {
                              history.push("/admin/create/product");
                              NotificationManager.success(
                                "Successfully created category. Now you can add Products to it.",
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
                        render={({ values, handleChange, setFieldValue }) => (
                          <Form style={{ width: "100%" }}>
                            <FormGroup className="">
                              <Label for="image">Category Image</Label>
                              <InputGroup>
                                <Label for="image" style={{ width: "100%" }}>
                                  {values.image === "" ? (
                                    <IoImageOutline
                                      size={50}
                                      style={{ cursor: "pointer" }}
                                    />
                                  ) : (
                                    <img src={values.image} width="100%" />
                                  )}
                                </Label>
                                <Input
                                  type="file"
                                  onChange={(event) => {
                                    if (event.target.files.length > 0) {
                                      setFieldValue(
                                        "image",
                                        URL.createObjectURL(
                                          event.target.files[0]
                                        )
                                      );
                                      setFieldValue(
                                        "photo",
                                        event.target.files[0]
                                      );
                                    }
                                  }}
                                  accept="image/*"
                                  name="image"
                                  id="image"
                                  style={{ display: "none" }}
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"image"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="">
                              <Label for="username">Category Name</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <ShoppingBag className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  onChange={handleChange}
                                  name="name"
                                  id="username"
                                  placeholder="Category Name"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"name"}
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
                                Create Category
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

export default withRouter(CreateCategory);
