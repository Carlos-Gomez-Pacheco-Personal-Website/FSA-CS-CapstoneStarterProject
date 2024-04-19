// Footer.jsx
import { Container, Row, Col } from "react-bootstrap";
import GitPicture from "../assets/Github.jpeg";
import LNPicture from "../assets/logoLN.png";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col className="text-center py-3">© 2024 Your E-commerce Website</Col>
        </Row>
        <Row>
          <Col className="text-center">
            <a
              href="https://www.linkedin.com/in/carlosegomezp/"
              target="_blank"
              rel="noreferrer"
            >
              <img src={LNPicture} alt="LinkedIn" width="30" height="30" />
            </a>
            <a
              href="https://github.com/Hases00"
              target="_blank"
              rel="noreferrer"
            >
              <img src={GitPicture} alt="GitHub" width="30" height="30" />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
