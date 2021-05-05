import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import COLORS from "../assets/css/CssVariables";
import NavbarLogo from "../assets/img/Capture.PNG";
import { FaFacebookF } from "react-icons/fa";
import { GrInstagram } from "react-icons/gr";
import { AiOutlineTwitter } from "react-icons/ai";

const Footer = () => {
  return (
    <React.Fragment>
      <div style={{ backgroundColor: COLORS.THEME_COLOR }}>
        <Container style={{ paddingTop: 70, paddingBottom: 70 }}>
          <Row>
            <Col sm={3} style={{ textAlign: "center", alignSelf: "center" }}>
              <img src={NavbarLogo} height={80} />
            </Col>
            <Col sm={3}>
              <h3 className="footer-heading">Contact us:</h3>
              <h5 className="footer">+91-9834693773</h5>
              <h5 className="footer">info@bookyourbooks.com</h5>
              <h5 className="footer">Company Address</h5>
            </Col>
            <Col sm={3}>
              <h3 className="footer-heading">Useful Links</h3>
              <h5 className="footer">Novels</h5>
              <h5 className="footer">Engineering</h5>
              <h5 className="footer">Exam Central</h5>
            </Col>
            <Col sm={3}>
              <h3 className="footer-heading">Social Media</h3>
              <FaFacebookF fill="white" size={30} />
              <GrInstagram
                fill="white"
                size={30}
                style={{ marginLeft: 20, marginRight: 20 }}
              />
              <AiOutlineTwitter fill="white" size={30} />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Footer;
