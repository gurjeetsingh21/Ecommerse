import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import banner1 from "../assets/img/banner1.png";
import banner2 from "../assets/img/banner2.png";
import banner3 from "../assets/img/banner3.png";
import axios from "axios";
import { API } from "../config";
import { withRouter } from "react-router";
import CategoryCard from "./CategoryCard";
import ProductCard from "./ProductCard";

const Home = ({ history }) => {
  const [categories, setCategories] = useState(null);
  const [newArrivals, setNewArrivals] = useState(null);

  useEffect(() => {
    async function fetchData() {
      console.log(API);
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `${API}/products?sortBy=${"createdAt"}&order=desc&limit=6`
      );
      console.log(response);
      setNewArrivals(response.data);
    }
    fetchData();
  }, []);

  return (
    <React.Fragment>
      {categories && (
        <Container fluid style={{ padding: 0 }}>
          <Carousel
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={false}
            transitionTime={3000}
            stopOnHover={true}
            interval={5500}
          >
            <div>
              <img src={banner1} />
            </div>
            <div>
              <img src={banner2} />
            </div>
            <div>
              <img src={banner3} />
            </div>
          </Carousel>
          <Container style={{ marginTop: 20 }}>
            <Row>
              <Col sm={12}>
                <h1 className="home-category-heading">New Arrivals</h1>
              </Col>
            </Row>
            <Row style={{ marginBottom: 20 }}>
              {newArrivals &&
                newArrivals.map((product, index) => (
                  <Col key={index} sm={12} style={{ marginBottom: 30 }}>
                    <ProductCard product={product} />
                  </Col>
                ))}
            </Row>
          </Container>
          <Container style={{ marginTop: 20 }}>
            <Row>
              <Col sm={12}>
                <h1 className="home-category-heading">Categories</h1>
              </Col>
            </Row>
            <Row style={{ marginBottom: 20 }}>
              {categories.map((category, index) => (
                <Col key={index} style={{ marginBottom: 30 }} sm={4}>
                  <CategoryCard category={category} />
                </Col>
              ))}
            </Row>
          </Container>
        </Container>
      )}
    </React.Fragment>
  );
};

export default withRouter(Home);
