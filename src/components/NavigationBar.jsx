import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import logo from "../image/logo1.png";


function NavigationBar() {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { path: "/", label: "Inicio" },
    { path: "/historia", label: "Historia" },
    { path: "/sitios", label: "Sitios" },
    { path: "/hoteles", label: "Hoteles" },
    { path: "/contacto", label: "Contacto" },
  ];

  return (
    <Navbar
      expand="lg"
      className={`navigation-bar ${navbarScrolled ? "scrolled" : ""}`}
      variant="dark"
      fixed="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Logo" className="logo hover-effect" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="custom-toggler" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {menuItems.map(({ path, label }, index) => (
              <Nav.Link
                key={index}
                as={Link}
                to={path}
                className={`nav-link ${location.pathname === path ? "active-link" : ""}`}
              >
                {label}
              </Nav.Link>
            ))}
          </Nav>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
              <FaFacebook size={24} />
            </a>
            <a href="https://www.instagram.com/turismo.sanjose/" target="_blank" rel="noreferrer" className="social-icon">
              <FaInstagram size={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon">
              <FaTwitter size={24} />
            </a>
          </div>
        </Navbar.Collapse>
      </Container>
      <div className="wave-separator"></div>
    </Navbar>
  );
}

export default NavigationBar;