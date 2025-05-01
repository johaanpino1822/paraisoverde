import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container, Form, InputGroup, Button } from "react-bootstrap";
import { 
  FaFacebook, FaInstagram, FaTwitter, 
  FaSearch, FaUser, FaPhoneAlt, FaMapMarkerAlt 
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../image/logo1.png";

function NavigationBar() {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHover, setActiveHover] = useState(null);
  const location = useLocation();

  // Estilos en línea (manteniendo colores originales)
  const styles = {
    navbar: {
      transition: "all 0.3s ease",
      padding: navbarScrolled ? "0.5rem 0" : "1rem 0",
      background: "linear-gradient(90deg, #00791a, #064273)",

      boxShadow: navbarScrolled ? "0 4px 20px rgba(0, 0, 0, 0.15)" : "none",
      backdropFilter: "blur(8px)",
      borderBottom: navbarScrolled ? "1px solid rgba(255, 255, 255, 0.1)" : "none"
    },
    logo: {
      height: navbarScrolled ? "60px" : "70px",
      transition: "all 0.3s ease",
      filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))"
    },
    navLink: {
      position: "relative",
      margin: "0 0.75rem",
      padding: "0.5rem 0",
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: "500",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      fontSize: "0.9rem",
      letterSpacing: "0.5px"
    },
    activeLink: {
      color: "#fff",
      fontWeight: "600"
    },
    hoverUnderline: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "2px",
      backgroundColor: "#3498db", // Color azul original
      transform: "scaleX(0)",
      transformOrigin: "right",
      transition: "transform 0.2s ease" // Más rápido
    },
    socialIcon: {
      color: "rgba(255, 255, 255, 0.7)",
      transition: "all 0.3s ease",
      margin: "0 0.5rem",
      fontSize: "1.1rem"
    },
    toggleButton: {
      border: "none",
      outline: "none",
      boxShadow: "none",
      fontSize: "1.5rem",
      color: "#fff"
    },
    searchContainer: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      backgroundColor: "#2c3e50", // Color original
      padding: "1rem",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
      zIndex: 1000
    },
    contactInfo: {
      display: "flex",
      alignItems: "center",
      marginRight: "1.5rem",
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: "0.85rem"
    },
    contactIcon: {
      marginRight: "0.5rem",
      fontSize: "0.9rem"
    },
    waveSeparator: {
      position: "absolute",
      bottom: "-10px",
      left: 0,
      width: "100%",
      height: "10px",
      background: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="${encodeURIComponent('#00791a')}" opacity=".25"/><path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="${encodeURIComponent('#064273')}" opacity=".5"/><path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="${encodeURIComponent('#00791a')}"/></svg>')`,
      backgroundSize: "cover",
      animation: "waveAnimation 10s linear infinite", // Más rápido (original era 20s)
      transformOrigin: "center"
    }
  };

  // Scroll nativo al top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", searchQuery);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const menuItems = [
    { path: "/", label: "Inicio" },
    { path: "/historia", label: "Historia" },
    { path: "/sitios", label: "Sitios Turísticos" },
    { path: "/hoteles", label: "Servicios" },
    { path: "/About", label: "Sobre Nosotros" },
  ];

  // Añadir estilo de animación para el wave
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    @keyframes waveAnimation {
      0% { background-position-x: 0; }
      100% { background-position-x: 1200px; }
    }
  `;
  document.head.appendChild(styleTag);

  return (
    <>
      <Navbar
        expand="lg"
        style={styles.navbar}
        variant="dark"
        fixed="top"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={scrollToTop}>
            <motion.img 
              src={logo} 
              alt="Logo" 
              style={styles.logo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            />
          </Navbar.Brand>

        
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            style={styles.toggleButton}
          >
            {expanded ? <FiX size={24} /> : <FiMenu size={24} />}
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              {menuItems.map(({ path, label }, index) => (
                <Nav.Link
                  key={index}
                  as={Link}
                  to={path}
                  style={{
                    ...styles.navLink,
                    ...(location.pathname === path ? styles.activeLink : {})
                  }}
                  onClick={() => setExpanded(false)}
                  onMouseEnter={() => setActiveHover(index)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  {label}
                  <motion.div
                    style={styles.hoverUnderline}
                    animate={{
                      transform: activeHover === index || location.pathname === path ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: activeHover === index ? "left" : "right"
                    }}
                    transition={{ duration: 0.2 }} // Animación más rápida
                  />
                </Nav.Link>
              ))}
            </Nav>
            <Form onSubmit={handleSearch}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Buscar destinos, hoteles, actividades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    color: "#fff",
                    padding: "0.65rem 1.00rem"
                  }}
                />
                <Button 
                  variant="primary" 
                  type="submit"
                  style={{
                    backgroundColor: "#3498db", // Color azul original
                    border: "none",
                    padding: "0 1.5rem"
                  }}
                >
                  Buscar
                </Button>
              </InputGroup>
            </Form>

            <div style={{ display: "flex", alignItems: "center" }}>
             
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link to="/login" style={{ color: "inherit" }}>
                  <FaUser style={styles.socialIcon} />
                </Link>
              </motion.div>

              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaFacebook style={styles.socialIcon} />
                </motion.div>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaInstagram style={styles.socialIcon} />
                </motion.div>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FaTwitter style={styles.socialIcon} />
                </motion.div>
              </a>
            </div>
          </Navbar.Collapse>
        </Container>

        <div style={styles.waveSeparator}></div>
      </Navbar>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            style={styles.searchContainer}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavigationBar;