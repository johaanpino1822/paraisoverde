import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { 
  FaFacebook, FaInstagram, FaTwitter, 
  FaUser, FaSignOutAlt, FaUserCircle,
  FaHome, FaHistory, FaMountain, FaHotel, FaInfoCircle
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { clearCredentials } from "../features/Auth/authSlice";
import api from "../Api/config";
import logo from "../image/logo3.png";

function NavigationBar() {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Estilos mejorados manteniendo la misma estructura
  const styles = {
    navbar: {
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      padding: navbarScrolled ? "0.6rem 0" : "1.2rem 0",
      background: "linear-gradient(135deg, #00791a 0%, #064273 100%)",
      boxShadow: navbarScrolled ? "0 8px 32px rgba(0, 0, 0, 0.2)" : "none",
      backdropFilter: "blur(12px)",
      borderBottom: navbarScrolled ? "1px solid rgba(255, 255, 255, 0.15)" : "none",
      position: "fixed",
      top: 0,
      width: "100%",
      zIndex: 1000
    },
    logo: {
      height: navbarScrolled ? "55px" : "65px",
      transition: "all 0.4s ease",
      filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"
    },
    navLink: {
      position: "relative",
      margin: "0 1rem",
      padding: "0.75rem 0",
      color: "rgba(255, 255, 255, 0.9)",
      fontWeight: "500",
      transition: "all 0.3s ease",
      textTransform: "uppercase",
      fontSize: "0.85rem",
      letterSpacing: "1px",
      display: "flex",
      alignItems: "center",
      gap: "8px"
    },
    activeLink: {
      color: "#fff",
      fontWeight: "600",
      textShadow: "0 0 10px rgba(255, 255, 255, 0.5)"
    },
    hoverUnderline: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "3px",
      background: "linear-gradient(90deg, #27ae60, #2ecc71)",
      transform: "scaleX(0)",
      transformOrigin: "right",
      transition: "transform 0.3s ease",
      borderRadius: "2px"
    },
    socialIcon: {
      color: "rgba(255, 255, 255, 0.8)",
      transition: "all 0.3s ease",
      margin: "0 0.5rem",
      fontSize: "1.2rem",
      padding: "8px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)"
    },
    toggleButton: {
      border: "none",
      outline: "none",
      boxShadow: "none",
      fontSize: "1.5rem",
      color: "#fff",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "8px",
      padding: "8px 12px",
      transition: "all 0.3s ease"
    },
    waveSeparator: {
      position: "absolute",
      bottom: "-8px",
      left: 0,
      width: "100%",
      height: "12px",
      background: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="${encodeURIComponent('#00791a')}" opacity=".3"/><path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="${encodeURIComponent('#064273')}" opacity=".6"/><path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="${encodeURIComponent('#00791a')}"/></svg>')`,
      backgroundSize: "cover",
      animation: "waveAnimation 8s linear infinite",
      transformOrigin: "center"
    },
    userDropdown: {
      backgroundColor: "rgba(255, 255, 255, 0.98)",
      border: "none",
      borderRadius: "12px",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
      backdropFilter: "blur(16px)",
      minWidth: "220px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      overflow: "hidden"
    },
    dropdownItem: {
      padding: "0.875rem 1.25rem",
      color: "#2d3748",
      transition: "all 0.3s ease",
      borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontWeight: "500"
    },
    userInfo: {
      backgroundColor: "#f8fafc",
      borderBottom: "3px solid #00791a",
      padding: "1.25rem"
    }
  };

  const menuItems = [
    { path: "/", label: "Inicio", icon: <FaHome size={14} /> },
    { path: "/historia", label: "Historia", icon: <FaHistory size={14} /> },
    { path: "/sitios", label: "Sitios Turísticos", icon: <FaMountain size={14} /> },
    { path: "/hoteles", label: "Servicios", icon: <FaHotel size={14} /> },
    { path: "/About", label: "Sobre Nosotros", icon: <FaInfoCircle size={14} /> },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.warn('Error durante el logout:', error);
    } finally {
      dispatch(clearCredentials());
      setExpanded(false);
      navigate('/', { replace: true });
      
      if (window.toast) {
        window.toast.success('Sesión cerrada correctamente');
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setNavbarScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes waveAnimation {
        0% { background-position-x: 0; }
        100% { background-position-x: 1200px; }
      }
      
      .custom-dropdown-toggle::after {
        display: none !important;
      }
      
      .user-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00791a, #064273);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 15px;
        border: 2px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
      }
      
      .nav-link-active-glow {
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin');
  if (isAdminRoute) return null;

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const socialIcons = [
    { icon: <FaFacebook />, url: "https://facebook.com" },
    { icon: <FaInstagram />, url: "https://instagram.com" },
    { icon: <FaTwitter />, url: "https://twitter.com" },
  ];

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
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          </Navbar.Brand>

          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            style={styles.toggleButton}
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {expanded ? <FiX size={20} /> : <FiMenu size={20} />}
            </motion.div>
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              {menuItems.map(({ path, label, icon }, index) => (
                <Nav.Link
                  key={index}
                  as={Link}
                  to={path}
                  style={{
                    ...styles.navLink,
                    ...(location.pathname === path ? styles.activeLink : {})
                  }}
                  className={location.pathname === path ? "nav-link-active-glow" : ""}
                  onClick={() => setExpanded(false)}
                  onMouseEnter={() => setActiveHover(index)}
                  onMouseLeave={() => setActiveHover(null)}
                >
                  {icon}
                  {label}
                  <motion.div
                    style={styles.hoverUnderline}
                    animate={{
                      transform: activeHover === index || location.pathname === path ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: activeHover === index ? "left" : "right"
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </Nav.Link>
              ))}
            </Nav>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {isAuthenticated ? (
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="link" 
                    id="user-dropdown"
                    className="custom-dropdown-toggle"
                    style={{ 
                      border: 'none', 
                      background: 'transparent',
                      padding: '0.25rem',
                    }}
                  >
                    <motion.div 
                      className="user-avatar"
                      whileHover={{ scale: 1.15, boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)" }}
                      whileTap={{ scale: 0.9 }}
                      title={user?.name || 'Usuario'}
                    >
                      {getUserInitials()}
                    </motion.div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={styles.userDropdown}>
                    <div 
                      style={{...styles.dropdownItem, ...styles.userInfo}}
                      className="text-center"
                    >
                      <FaUserCircle size={24} style={{ color: "#00791a", marginBottom: "0.5rem" }} />
                      <div className="fw-bold text-dark" style={{ fontSize: "1.1rem" }}>
                        {user?.name || 'Usuario'}
                      </div>
                      <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                        {user?.email}
                      </small>
                    </div>

                    <Dropdown.Item 
                      as={Link} 
                      to="/profile"
                      style={styles.dropdownItem}
                      onClick={() => setExpanded(false)}
                    >
                      <FaUser style={{ color: "#00791a" }} />
                      Mi Perfil
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item 
                      style={styles.dropdownItem}
                      onClick={handleLogout}
                      className="text-danger"
                    >
                      <FaSignOutAlt />
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <motion.div 
                  whileHover={{ scale: 1.15 }} 
                  whileTap={{ scale: 0.9 }}
                  style={{ background: "rgba(255, 255, 255, 0.15)", borderRadius: "50%", padding: "8px" }}
                >
                  <Link to="/login" style={{ color: "inherit", display: "flex" }} onClick={() => setExpanded(false)}>
                    <FaUser style={{ ...styles.socialIcon, background: "none", margin: 0 }} title="Iniciar Sesión" />
                  </Link>
                </motion.div>
              )}

              {socialIcons.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div style={styles.socialIcon}>
                    {social.icon}
                  </div>
                </motion.a>
              ))}
            </div>
          </Navbar.Collapse>
        </Container>

        <div style={styles.waveSeparator}></div>
      </Navbar>

      {/* Espacio para el navbar fijo */}
     
    </>
  );
}

export default NavigationBar;