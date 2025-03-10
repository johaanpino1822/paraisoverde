import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import logo from "../image/logo1.png";

function NavigationBar() {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false); // Estado para controlar la expansión del Navbar
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cierra el Navbar.Collapse cuando se cambia de ruta
  useEffect(() => {
    setExpanded(false); // Cierra el menú al cambiar de ruta
  }, [location.pathname]);

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
      expanded={expanded} // Controla si el Navbar está expandido o no
      onToggle={() => setExpanded(!expanded)} // Alterna el estado de expansión
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
                onClick={() => setExpanded(false)} // Cierra el menú al hacer clic en un enlace
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