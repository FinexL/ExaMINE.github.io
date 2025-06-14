import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Navi() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard">
          ExaMINE
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/dashboard">
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/features">
            Features
          </Nav.Link>
          <Nav.Link as={Link} to="/pricing">
            Pricing
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navi;
