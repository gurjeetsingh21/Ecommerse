import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import { Card, Row, Col, Container } from "react-bootstrap";
import { FaListAlt, FaBook } from "react-icons/fa";
import { GrUserManager } from "react-icons/gr";

const Dashboard = () => {
  return (
    <Container>
      <Row>
        <Col
          sm={12}
          md={6}
          style={{
            marginTop: 20,
            marginBottom: 20,
            textAlign: "-webkit-center",
          }}
        >
          <Card style={{ backgroundColor: "#dee1e3", width: "80%" }}>
            <Card.Body>
              <Row>
                <Col style={{ display: "flex" }} className="dashboard-card">
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
          <Card style={{ backgroundColor: "#dee1e3", width: "80%" }}>
            <Card.Body>
              <Row>
                <Col style={{ display: "flex" }} className="dashboard-card">
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
          <Card style={{ backgroundColor: "#dee1e3", width: "80%" }}>
            <Card.Body>
              <Row>
                <Col style={{ display: "flex" }} className="dashboard-card">
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
          <Card style={{ backgroundColor: "#dee1e3", width: "80%" }}>
            <Card.Body>
              <Row>
                <Col style={{ display: "flex" }} className="dashboard-card">
                  <GrUserManager fill="#131921" size={35} />
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
