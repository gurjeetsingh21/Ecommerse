import React from "react";
import { withRouter } from "react-router";
import { Card, Row, Col, Container } from "react-bootstrap";
import { FaListAlt, FaBook, FaTemperatureLow } from "react-icons/fa";
import { GrUserManager, GrView } from "react-icons/gr";
import BarChart from "./charts/BarChart";
import { API } from "../config";
import axios from "axios";

const Dashboard = ({ history }) => {
  const [quantityArray, setQuantityArray] = useState([]);
  const [soldArray, setSoldArray] = useState([]);
  const [productName, setProductName] = useState([]);

  useEffect(async () => {
    const sTemp = [];
    const qTemp = [];
    const temp = [];
    if (JSON.parse(localStorage.getItem("user")).role === 1) {
      const response = await axios.get(
        `${API}/products/shop/${JSON.parse(localStorage.getItem("shop"))._id}`
      );
      response.data.map((product) => {
        sTemp.push(product.sold);
        qTemp.push(product.quantity);
        temp.push(product.name);
      });
    } else {
      const response = await axios.get(`${API}/products?limit=undefined`);
      response.data.map((product) => {
        sTemp.push(product.sold);
        qTemp.push(product.quantity);
        temp.push(product.name);
      });
    }
    setQuantityArray([...qTemp]);
    setProductName([...temp]);
    setSoldArray([...sTemp]);
  }, []);

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <h1 className="admin-dashboard-heading">Admin Links</h1>
        </Col>
        {JSON.parse(localStorage.getItem("user")).role === 2 && (
          <Col
            sm={12}
            md={6}
            style={{
              marginTop: 20,
              marginBottom: 20,
              textAlign: "-webkit-center",
            }}
          >
            <Card
              style={{ backgroundColor: "#dee1e3", width: "80%" }}
              className="dashboard-card"
              onClick={() => history.push("/admin/create/category")}
            >
              <Card.Body>
                <Row>
                  <Col style={{ display: "flex", alignItems: "center" }}>
                    <FaListAlt fill="#131921" size={35} />
                    <div className="dashboard-card-text">Create Category</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        )}
        <Col
          sm={12}
          md={6}
          style={{
            marginTop: 20,
            marginBottom: 20,
            textAlign: "-webkit-center",
          }}
        >
          <Card
            style={{ backgroundColor: "#dee1e3", width: "80%" }}
            className="dashboard-card"
            onClick={() => history.push("/admin/create/product")}
          >
            <Card.Body>
              <Row>
                <Col style={{ display: "flex", alignItems: "center" }}>
                  <FaBook fill="#131921" size={35} />
                  <div className="dashboard-card-text">Create Product</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col
          sm={12}
          md={6}
          style={{
            marginTop: 20,
            marginBottom: 20,
            textAlign: "-webkit-center",
          }}
        >
          <Card
            style={{ backgroundColor: "#dee1e3", width: "80%" }}
            className="dashboard-card"
            onClick={() => history.push("/admin/manage/products")}
          >
            <Card.Body>
              <Row>
                <Col style={{ display: "flex", alignItems: "center" }}>
                  <GrUserManager fill="#131921" size={35} />
                  <div className="dashboard-card-text">Manage Product</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        {JSON.parse(localStorage.getItem("user")).role === 2 && (
          <Col
            sm={12}
            md={6}
            style={{
              marginTop: 20,
              marginBottom: 20,
              textAlign: "-webkit-center",
            }}
          >
            <Card
              style={{ backgroundColor: "#dee1e3", width: "80%" }}
              className="dashboard-card"
              onClick={() =>
                window.open("https://dashboard.stripe.com/login", "_blank")
              }
            >
              <Card.Body>
                <Row>
                  <Col style={{ display: "flex", alignItems: "center" }}>
                    <GrView fill="#131921" size={35} />
                    <div className="dashboard-card-text">View Orders</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        )}
        {soldArray.length > 0 && quantityArray.length > 0 && (
          <Col xs={12}>
            <Card style={{ backgroundColor: "#dee1e3" }}>
              <BarChart
                sold={soldArray}
                quantity={quantityArray}
                name={productName}
              />
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default withRouter(Dashboard);
