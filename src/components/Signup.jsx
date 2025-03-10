import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { FaUserCircle, FaLock, FaEnvelope, FaUser } from "react-icons/fa";
import logo from "../image/logo1.png";
import "../css/Signup.css";

export default function Signup({ onSignup }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

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
        if (name === "confirmPassword" || name === "password") {
            setPasswordsMatch(formData.password === formData.confirmPassword);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        // Simulación de una llamada a una API o validación
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula un retraso de red

            if (
                formData.email === "admin@turismo.com" ||
                formData.password !== formData.confirmPassword
            ) {
                throw new Error("Las contraseñas no coinciden o el correo ya está registrado");
            } else {
                onSignup(); // Llama a la función onSignup si el registro es exitoso
            }
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(""), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="signup-container">
            <Row className="w-100">
                <Col md={6} className="welcome-section">
                    <Card className="welcome-card">
                        <Card.Body>
                            <h2 className="welcome-title">¡Únete a Turismo!</h2>
                            <p className="welcome-text">Descubre destinos únicos y vive experiencias inolvidables.</p>
                            <img src={logo} alt="Logo Turismo" className="welcome-logo" />
                            <p className="welcome-subtext">Regístrate para acceder a contenido exclusivo.</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6} className="signup-section">
                    <Card className="signup-card">
                        <Card.Body>
                            <h3 className="signup-title">Regístrate</h3>
                            <p className="signup-text">Crea una cuenta para empezar</p>

                            {error && <Alert variant="danger" className="error-message">{error}</Alert>}

                            <Form className="signup-form" onSubmit={handleSubmit}>
                                <Form.Group className="form-group">
                                    <Form.Label htmlFor="name" className="form-label">
                                        <FaUser className="icon" /> Nombre
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Ingresa tu nombre"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="form-group">
                                    <Form.Label htmlFor="email" className="form-label">
                                        <FaEnvelope className="icon" /> Email
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

                                <Form.Group className="form-group">
                                    <Form.Label htmlFor="confirmPassword" className="form-label">
                                        <FaLock className="icon" /> Confirmar Contraseña
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirma tu contraseña"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        isInvalid={!passwordsMatch}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Las contraseñas no coinciden.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button
                                    variant="success"
                                    type="submit"
                                    className="submit-button"
                                    disabled={isSubmitting || !isValidEmail || !isValidPassword || !passwordsMatch}
                                >
                                    {isSubmitting ? (
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    ) : (
                                        "Registrarse"
                                    )}
                                </Button>
                            </Form>

                            <p className="login-text">
                                ¿Ya tienes cuenta? 
                                <NavLink to="/login" className="login-link">Inicia Sesión</NavLink>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}