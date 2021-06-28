import React, { useEffect, useState } from "react";
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
import { Book, Tag, User } from "react-feather";
import "../global.scss";
import { NotificationManager } from "react-notifications";
import COLORS from "../assets/css/CssVariables";
import { API } from "../config";
import * as Yup from "yup";
import { IoImageOutline } from "react-icons/io5";
import Select from "react-select";

const ProductDetails = ({ history, location }) => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [shopOptions, setShopOptions] = useState([]);
  const [productImage, setProductImage] = useState("");
  const [productBinaryPhoto, setProductBinaryPhoto] = useState("");

  useEffect(() => {
    function dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    }

    function getBase64(url) {
      return axios
        .get(url, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          setProductImage(
            `data:image/jpeg;base64,${Buffer.from(
              response.data,
              "binary"
            ).toString("base64")}`
          );
          setProductBinaryPhoto(
            dataURLtoFile(
              `data:image/jpeg;base64,${Buffer.from(
                response.data,
                "binary"
              ).toString("base64")}`,
              "hello.png"
            )
          );
        });
    }
    if (location.state) {
      getBase64(`${API}/product/photo/${location.state.data._id}`);
    }
  }, []);

  console.log(productBinaryPhoto);

  useEffect(async () => {
    const response = await axios.get(`${API}/categories`);
    const temp = [];
    if (response.data) {
      response.data.map((category) => {
        temp.push({ _id: category._id, name: category.name });
      });
    }
    setCategoryOptions([...temp]);
  }, []);

  useEffect(async () => {
    const response = await axios.get(`${API}/shops`);
    const temp = [];
    if (response.data) {
      response.data.map((shop) => {
        temp.push({ _id: shop._id, name: shop.name });
      });
    }
    setShopOptions([...temp]);
  }, []);

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
                          {location.state ? "Update Product" : "Create Product"}
                        </h3>
                      </div>

                      <h6 className="h5 mb-0 mt-4">Hey There!</h6>
                      <p className="text-muted mt-1 mb-4">
                        {location.state
                          ? "Please update the selected product."
                          : "Create a product so that your customers can buy that."}
                      </p>
                      <Formik
                        initialValues={{
                          name: location.state ? location.state.data.name : "",
                          description: location.state
                            ? location.state.data.description
                            : "",
                          price: location.state
                            ? location.state.data.price
                            : "",
                          category: location.state
                            ? location.state.data.category
                            : "",
                          shop: location.state ? location.state.data.shop : "",
                          shipping: true,
                          quantity: location.state
                            ? location.state.data.quantity
                            : "",
                          author: location.state
                            ? location.state.data.author
                            : "",
                        }}
                        validationSchema={Yup.object().shape({
                          name: Yup.string().required(
                            "Category name is required"
                          ),
                          description: Yup.string().required(
                            "Product description is required"
                          ),

                          price: Yup.number()
                            .typeError("Product price must be a number")
                            .required("Product price is required"),
                          category: Yup.object()
                            .typeError("Please select a category")
                            .required("Please select a category"),
                          shop: Yup.object()
                            .typeError("Please select a shop")
                            .required("Please select a shop"),
                          quantity: Yup.number()
                            .typeError("Product price must be a number")
                            .required("Product quantity is required"),
                          author: Yup.string().required("Author is required"),
                        })}
                        onSubmit={async (values, actions) => {
                          console.log("Gurjeet");
                          const user = JSON.parse(localStorage.getItem("user"));
                          const token = localStorage.getItem("token");
                          let formData = new FormData();
                          formData.append("name", values.name);
                          formData.append("photo", productBinaryPhoto);
                          formData.append("description", values.description);
                          formData.append("price", values.price);
                          formData.append("category", values.category._id);
                          formData.append("shop", values.shop._id);
                          formData.append("shipping", values.shipping);
                          formData.append("quantity", values.quantity);
                          formData.append("author", values.author);
                          if (location.state) {
                            console.log("Gurjeet");
                            try {
                              const response = await axios.put(
                                API +
                                  `/product/${location.state.data._id}/${user._id}`,
                                formData,
                                {
                                  headers: {
                                    Authorization: token,
                                  },
                                }
                              );
                              console.log(response);
                              if (
                                response.data.systemMessageType === "success"
                              ) {
                                NotificationManager.success(
                                  "Successfully updated product.",
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
                          } else {
                            try {
                              const response = await axios.post(
                                API + `/product/create/${user._id}`,
                                formData,
                                {
                                  headers: {
                                    Authorization: token,
                                  },
                                }
                              );
                              console.log(response);
                              if (
                                response.data.systemMessageType === "success"
                              ) {
                                NotificationManager.success(
                                  "Successfully created product.",
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
                          }
                        }}
                        render={({ values, handleChange, setFieldValue }) => (
                          <Form style={{ width: "100%" }}>
                            <FormGroup className="">
                              <Label for="image">Product Image</Label>
                              <InputGroup>
                                <Label for="image" style={{ width: "100%" }}>
                                  {productImage === "" ? (
                                    <IoImageOutline
                                      size={50}
                                      style={{ cursor: "pointer" }}
                                    />
                                  ) : (
                                    <img src={productImage} width="100%" />
                                  )}
                                </Label>
                                <Input
                                  type="file"
                                  onChange={(event) => {
                                    console.log(event.target.files);
                                    if (event.target.files.length > 0) {
                                      setProductImage(
                                        URL.createObjectURL(
                                          event.target.files[0]
                                        )
                                      );
                                      setProductBinaryPhoto(
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
                              <Label for="name">Product Name</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <Book className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  value={values.name}
                                  onChange={handleChange}
                                  name="name"
                                  id="name"
                                  placeholder="Product Name"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"name"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="">
                              <Label for="author">Product Author</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <User className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  value={values.author}
                                  onChange={handleChange}
                                  name="author"
                                  id="author"
                                  placeholder="Author"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"author"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="">
                              <Label for="description">
                                Product Description
                              </Label>
                              <InputGroup>
                                <Input
                                  value={values.description}
                                  type="textarea"
                                  onChange={handleChange}
                                  name="description"
                                  id="description"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"description"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="">
                              <Label for="shop">Select Category</Label>
                              <InputGroup>
                                <Select
                                  id="shop"
                                  className="category-select"
                                  name="shop"
                                  placeholder="Select Shop"
                                  value={values.shop}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option._id}
                                  onChange={(shop) =>
                                    setFieldValue("shop", shop)
                                  }
                                  options={shopOptions}
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"shop"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="">
                              <Label for="price">Product Price</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <Tag className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  value={values.price}
                                  onChange={handleChange}
                                  name="price"
                                  id="price"
                                  placeholder="Product Price"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"price"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="">
                              <Label for="select">Select Category</Label>
                              <InputGroup>
                                <Select
                                  id="category"
                                  className="category-select"
                                  name="category"
                                  placeholder="Select Category"
                                  value={values.category}
                                  getOptionLabel={(option) => option.name}
                                  getOptionValue={(option) => option._id}
                                  onChange={(category) =>
                                    setFieldValue("category", category)
                                  }
                                  options={categoryOptions}
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"category"}
                                className="error"
                                component="div"
                              />
                            </FormGroup>
                            <FormGroup className="">
                              <Label for="quality">Product Quantity</Label>
                              <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                  <span className="input-group-text">
                                    <Tag className="icon-dual" />
                                  </span>
                                </InputGroupAddon>
                                <Input
                                  value={values.quantity}
                                  onChange={handleChange}
                                  name="quantity"
                                  id="quality"
                                  placeholder="Product Quantity"
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={"quantity"}
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
                                type="submit"
                              >
                                {location.state
                                  ? "Update Product"
                                  : "Create Product"}
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

export default withRouter(ProductDetails);
