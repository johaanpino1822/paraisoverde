import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { FaGithubAlt, FaGoogle, FaTwitter, FaUserCircle, FaLock } from "react-icons/fa";
import logo from "../image/logo1.png";
import "./Login.css";

export default function Login({ onLogin }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validación en tiempo real
        if (name === "email") {
            setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        }
        if (name === "password") {
            setIsValidPassword(value.length >= 6);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        // Simulación de una llamada a una API o validación
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula un retraso de red

            if (formData.email === "admin@turismo.com" && formData.password === "123456") {
                onLogin(); // Llama a la función onLogin si las credenciales son correctas
            } else {
                throw new Error("Correo o contraseña incorrectos");
            }
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(""), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="login-container">
            <Row className="w-100">
                <Col md={6} className="welcome-section">
                    <Card className="welcome-card">
                        <Card.Body>
                            <h2 className="welcome-title">¡Bienvenido a Turismo!</h2>
                            <p className="welcome-text">Explora destinos únicos y vive experiencias inolvidables.</p>
                            <img src={logo} alt="Logo Turismo" className="welcome-logo" />
                            <p className="welcome-subtext">Inicia sesión para acceder a contenido exclusivo.</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="login-section">
                    <Card className="login-card">
                        <Card.Body>
                            <h3 className="login-title">Inicia Sesión</h3>
                            <p className="login-text">Accede a contenido exclusivo</p>

                            <SocialLoginButtons />

                            {error && <Alert variant="danger" className="error-message">{error}</Alert>}

                            <Form className="login-form" onSubmit={handleSubmit}>
                                <Form.Group className="form-group">
                                    <Form.Label htmlFor="email" className="form-label">
                                        <FaUserCircle className="icon" /> Email
                                    </Form.Label>
                                    <Form.Control 
                                        type="email" 
                                        id="email"
                                        name="email"
                                        placeholder="Ingresa tu email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        isInvalid={!isValidEmail}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Ingresa un correo válido.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="form-group">
                                    <Form.Label htmlFor="password" className="form-label">
                                        <FaLock className="icon" /> Contraseña
                                    </Form.Label>
                                    <Form.Control 
                                        type="password" 
                                        id="password"
                                        name="password"
                                        placeholder="Ingresa tu contraseña" 
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        isInvalid={!isValidPassword}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        La contraseña debe tener al menos 6 caracteres.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button 
                                    variant="success" 
                                    type="submit" 
                                    className="submit-button"
                                    disabled={isSubmitting || !isValidEmail || !isValidPassword}
                                >
                                    {isSubmitting ? (
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    ) : (
                                        "Iniciar Sesión"
                                    )}
                                </Button>
                            </Form>

                            <p className="signup-text">
                                ¿No tienes cuenta? 
                                <NavLink to="/signup" className="signup-link">Regístrate</NavLink>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

function SocialLoginButtons() {
    return (
        <div className="social-login">
            <Button variant="outline-danger" className="social-button">
                <FaGoogle size={20} /> Google
            </Button>
            <Button variant="outline-primary" className="social-button">
                <FaTwitter size={20} /> Twitter
            </Button>
            <Button variant="outline-dark" className="social-button">
                <FaGithubAlt size={20} /> GitHub
            </Button>
        </div>
    );
}