import React from "react";
import { withRouter } from "react-router";
import { Container, Col, Row } from "react-bootstrap";
import paymentSuccess from "../assets/img/paymentsuccess.png";

const SuccessfulPayment = ({ history }) => {
  return (
    <Container fluid>
      <Row>
        <Col md={{ span: 8, offset: 3 }}>
          <img
            src={paymentSuccess}
            width="75%"
            style={{ marginTop: 50, marginBottom: 50 }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(SuccessfulPayment);
