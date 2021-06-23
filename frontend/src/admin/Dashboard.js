import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { Card, Row, Col, Container } from "react-bootstrap";
import { FaListAlt, FaBook } from "react-icons/fa";
import { GrUserManager, GrView } from "react-icons/gr";

const Dashboard = ({ history }) => {
  return (
    <Container>
      <Row>
        <Col xs={12}>
          <h1 className="admin-dashboard-heading">Admin Links</h1>
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
      </Row>
    </Container>
  );
};

export default withRouter(Dashboard);
