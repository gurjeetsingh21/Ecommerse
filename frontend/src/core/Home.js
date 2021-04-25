import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import banner1 from "../assets/img/banner1.png";
import banner2 from "../assets/img/banner2.png";
import banner3 from "../assets/img/banner3.png";
import axios from "axios";
import { API } from "../config";
import ServeImage from "../components/ServeImage";

const Home = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${API}/categories`);
      console.log(response.data);
      setCategories(response.data);
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
            transitionTime={2000}
            stopOnHover={true}
            interval={5000}
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
            <Row style={{ marginBottom: 20 }}>
              {categories.map((category) => (
                <Col sm={4}>
                  <Card
                    style={{
                      height: 200,
                      boxShadow: "0px 0px 6px 3px #f3f4f7",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ height: "100%" }}>
                      <ServeImage
                        item={category}
                        type="category"
                        style={{
                          height: "100%",
                          backgroundSize: "contain",
                          opacity: 0.3,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        textAlign: "center",
                      }}
                    >
                      <h2 style={{ fontSize: "xxx-large" }}>
                        <span
                          style={{
                            color: "black",
                            boxShadow: "inset 0px 0px 20px 2px #b3b3b3",
                            fontWeight: "bold",
                          }}
                        >
                          {category.name}
                        </span>
                      </h2>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </Container>
      )}
    </React.Fragment>
  );
};

export default Home;
