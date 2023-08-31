import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import logoImage from '../images/images.jpg';
import './About.css'; // Import your custom CSS for styling

function About() {
  return (
    <Container className="about-container mt-5">
      <div className="text-center mb-5">
        <h2>About Me</h2>
        <div className="divider mx-auto"></div>
      </div>
      <Row className="align-items-center">
        <Col md={4} className="text-center mb-4">
          <Image src={logoImage} alt="Your Name" className="profile-image" roundedCircle fluid />
        </Col>
        <Col md={8}>
          <p className="about-text larger-font">
            Hello! I'm <strong>Vinayak Sawant</strong>
          </p>
          <p className="about-text">
            Feel free to reach out to me at <strong>vinayaksawant02@gmail.com</strong> for any inquiries or collaborations, or for updates and more.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
