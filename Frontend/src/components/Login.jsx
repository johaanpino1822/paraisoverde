import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaGithubAlt, FaGoogle, FaTwitter, FaUserCircle, FaLock } from "react-icons/fa";
import logo from "../image/logo1.png";

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

        // Validar campos antes de enviar
        if (!isValidEmail || !isValidPassword) {
            setError("Por favor, corrige los errores en el formulario.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Enviar solicitud al backend para iniciar sesión
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email, // Usamos el campo "email" en lugar de "username"
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Si el inicio de sesión es exitoso, llamamos a onLogin
                onLogin(data.user); // Pasamos los datos del usuario a onLogin
            } else {
                // Si hay un error, mostramos el mensaje del backend
                throw new Error(data.message || "Error al iniciar sesión");
            }
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(""), 3000); // Limpiar el mensaje de error después de 3 segundos
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mt-[150px]">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transform transition-all hover:shadow-3xl">
                {/* Sección de bienvenida */}
                <div className="w-full lg:w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white flex flex-col justify-center items-center text-center">
                    <h2 className="text-4xl font-bold mb-4 animate-fade-in">¡Bienvenido a Turismo!</h2>
                    <p className="text-lg mb-6 animate-fade-in delay-100">Explora destinos únicos y vive experiencias inolvidables.</p>
                    <img src={logo} alt="Logo Turismo" className="w-32 h-32 mb-6 animate-fade-in delay-200" />
                    <p className="text-sm animate-fade-in delay-300">Inicia sesión para acceder a contenido exclusivo.</p>
                </div>

                {/* Sección de inicio de sesión */}
                <div className="w-full lg:w-1/2 p-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2 animate-fade-in">Inicia Sesión</h3>
                    <p className="text-gray-600 mb-6 animate-fade-in delay-100">Accede a contenido exclusivo</p>

                    {/* Botones de redes sociales */}
                    <div className="flex gap-4 mb-6 animate-fade-in delay-200">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-all hover:scale-105">
                            <FaGoogle className="text-red-600" size={20} /> Google
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-all hover:scale-105">
                            <FaTwitter className="text-blue-500" size={20} /> Twitter
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-all hover:scale-105">
                            <FaGithubAlt className="text-gray-800" size={20} /> GitHub
                        </button>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">
                            {error}
                        </div>
                    )}

                    {/* Formulario de inicio de sesión */}
                    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in delay-300">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                <FaUserCircle className="inline-block mr-2" /> Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Ingresa tu email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                                    isValidEmail ? "focus:ring-blue-500" : "focus:ring-red-500 border-red-500"
                                } transition-all`}
                                required
                            />
                            {!isValidEmail && (
                                <p className="text-sm text-red-500 mt-1">Ingresa un correo válido.</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                <FaLock className="inline-block mr-2" /> Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Ingresa tu contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                                    isValidPassword ? "focus:ring-blue-500" : "focus:ring-red-500 border-red-500"
                                } transition-all`}
                                required
                            />
                            {!isValidPassword && (
                                <p className="text-sm text-red-500 mt-1">La contraseña debe tener al menos 6 caracteres.</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !isValidEmail || !isValidPassword}
                            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Procesando...
                                </div>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </button>
                    </form>

                    {/* Enlace de registro */}
                    <p className="text-center text-gray-600 mt-6 animate-fade-in delay-400">
                        ¿No tienes cuenta?{" "}
                        <NavLink to="/signup" className="text-blue-600 hover:underline">
                            Regístrate
                        </NavLink>
                    </p>
                </div>
            </div>
        </div>
    );
}