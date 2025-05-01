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

    // Maneja los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validación en tiempo real
        if (name === "email") {
            setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        }
        if (name === "password") {
            setIsValidPassword(value.length >= 6);
            setPasswordsMatch(value === formData.confirmPassword);
        }
        if (name === "confirmPassword") {
            setPasswordsMatch(value === formData.password);
        }
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        // Validaciones antes de enviar
        if (!isValidEmail || !isValidPassword || !passwordsMatch) {
            setError("Por favor, corrige los errores en el formulario.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Enviar solicitud al backend para registrar el usuario
            const response = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onSignup(data.user);
            } else {
                throw new Error(data.message || "Error al registrar usuario");
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
                {/* Sección de bienvenida */}
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

                {/* Sección de registro */}
                <Col md={6} className="signup-section">
                    <Card className="signup-card">
                        <Card.Body>
                            <h3 className="signup-title">Regístrate</h3>
                            <p className="signup-text">Crea una cuenta para empezar</p>

                            {/* Mostrar error si hay alguno */}
                            {error && <Alert variant="danger" className="error-message">{error}</Alert>}

                            {/* Formulario de registro */}
                            <Form className="signup-form" onSubmit={handleSubmit}>
                                {/* Nombre */}
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

                                {/* Email */}
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

                                {/* Contraseña */}
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

                                {/* Confirmar Contraseña */}
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

                                {/* Botón de registro */}
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

                            {/* Enlace para iniciar sesión */}
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
