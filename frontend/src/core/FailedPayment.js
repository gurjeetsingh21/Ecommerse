import React from "react";
import { withRouter } from "react-router";
import { Container, Col, Row } from "react-bootstrap";
import paymentFailed from "../assets/img/paymentfailed.png";

const FailedPayment = ({ history }) => {
  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 8, offset: 3 }}>
          <img src={paymentFailed} width="75%" />
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(FailedPayment);
