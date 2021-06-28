import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { API } from "../config";
import ProductCard from "./ProductCard";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import Select from "react-select";

const ProductsByCategory = (props) => {
  const category = props.location.state.category;
  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [pincodeFilteredProducts, setPincodeFilteredProducts] = useState(null);
  const [volume, setVolume] = useState(0);
  const [pincodeOptions, setPincodeOptions] = useState([]);
  const [selectedPincode, setSelectedPinCode] = useState([
    { value: 0, label: "All" },
  ]);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `${API}/products/category/${category._id}`
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
      setPincodeFilteredProducts(response.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${API}/shops`);
      let temp = [];
      response.data.map((shop) => {
        temp.push(shop.pincode);
      });
      temp = Array.from(new Set(temp));
      const secTemp = [{ value: 0, label: "All" }];
      temp.map((pincode) => {
        secTemp.push({ value: pincode, label: pincode });
      });
      setPincodeOptions([...secTemp]);
    }
    fetchData();
  }, []);

  function filterProducts(product) {
    return product.price <= this;
  }

  const handleOnChange = (value) => {
    console.log(value);
    setVolume(value);
  };

  function filterPincode(product) {
    return product.shop.pincode === this.value;
  }

  useEffect(() => {
    if (products !== null && products !== []) {
      if (selectedPincode.value !== 0) {
        const temp = products.filter(filterPincode, selectedPincode);
        setPincodeFilteredProducts([...temp]);
        setFilteredProducts([...temp]);
        setVolume(0);
      } else {
        setPincodeFilteredProducts([...products]);
        setFilteredProducts([...products]);
        setVolume(0);
      }
    }
  }, [selectedPincode]);

  return (
    <React.Fragment>
      {filteredProducts && (
        <Container>
          <Row>
            <Col sm={12}>
              <h1 className="product-by-category-heading">{category.name}</h1>
            </Col>
            <Col md={{ span: 4, offset: 8 }}>
              <h5 className="filter-heading">Price</h5>
            </Col>
            <Col md={4}>
              <Select
                id="shop"
                className="category-select"
                name="shop"
                placeholder="Select Shop"
                value={selectedPincode}
                onChange={(selected) => setSelectedPinCode(selected)}
                options={pincodeOptions}
              />
            </Col>
            <Col md={{ span: 4, offset: 4 }} style={{ marginBottom: 10 }}>
              <Slider
                style={{ background: "white" }}
                value={volume}
                min={0}
                max={2000}
                step={100}
                orientation="horizontal"
                onChange={handleOnChange}
                onChangeComplete={() => {
                  const temp = pincodeFilteredProducts.filter(
                    filterProducts,
                    volume
                  );
                  setFilteredProducts(temp);
                }}
              />
            </Col>
            {filteredProducts.length > 0 ? (
              <>
                {filteredProducts.map((product, index) => (
                  <Col key={index} sm={12} style={{ marginBottom: 30 }}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </>
            ) : (
              <Container>
                <Row>
                  <Col>
                    <h3 style={{ textAlign: "center", color: "white" }}>
                      Sorry, no items match your filter. <br /> Please try
                      again.
                    </h3>
                  </Col>
                </Row>
              </Container>
            )}
          </Row>
        </Container>
      )}
    </React.Fragment>
  );
};

export default withRouter(ProductsByCategory);
