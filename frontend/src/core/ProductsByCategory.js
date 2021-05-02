import React, { useEffect, useState } from "react";
import { withRouter } from "react-router";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { API } from "../config";
import ProductCard from "./ProductCard";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";

const ProductsByCategory = (props) => {
  const category = props.location.state.category;
  const [products, setProducts] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(null);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `${API}/products/category/${category._id}`
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
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
            <Col md={{ span: 4, offset: 8 }} style={{ marginBottom: 10 }}>
              <Slider
                style={{ background: "white" }}
                value={volume}
                min={0}
                max={2000}
                step={100}
                orientation="horizontal"
                onChange={handleOnChange}
                onChangeComplete={() => {
                  const temp = products.filter(filterProducts, volume);
                  setFilteredProducts(temp);
                }}
              />
            </Col>
            {filteredProducts.map((product, index) => (
              <Col key={index} sm={12} style={{ marginBottom: 30 }}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </React.Fragment>
  );
};

export default withRouter(ProductsByCategory);
