import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaGithubAlt, FaGoogle, FaTwitter, FaUserCircle, FaLock, FaEye, FaEyeSlash, FaRocket } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../image/logo1.png";

export default function Login({ onLogin }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Efecto de estrellas animadas (alternativa a tsparticles)
    useEffect(() => {
        const container = document.getElementById('particles-container');
        if (!container) return;

        // Crear estrellas
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'absolute rounded-full bg-white/30 animate-twinkle';
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            container.appendChild(star);
        }

        return () => {
            container.innerHTML = '';
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

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

        if (!isValidEmail || !isValidPassword) {
            setError("Por favor, corrige los errores en el formulario.");
            setIsSubmitting(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const response = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await new Promise(resolve => setTimeout(resolve, 800));
                onLogin(data.user);
            } else {
                throw new Error(data.message || "Error al iniciar sesión");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 relative overflow-hidden mt-10">
            {/* Efecto de partículas alternativo */}
            <div id="particles-container" className="absolute inset-0 z-0 overflow-hidden" />
            
            {/* Efecto de luz */}
            <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transform transition-all hover:shadow-3xl border border-white/20 relative z-10"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                {/* Efecto de borde luminoso */}
                <motion.div 
                    animate={{
                        boxShadow: isHovered 
                            ? "0 0 30px 5px rgba(99, 102, 241, 0.5)" 
                            : "0 0 15px 2px rgba(99, 102, 241, 0.2)"
                    }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                ></motion.div>

                {/* Sección de bienvenida */}
                <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90 p-8 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative z-10"
                    >
                        <motion.img 
                            src={logo} 
                            alt="Logo" 
                            className="w-32 h-32 mb-6 mx-auto"
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.h2 
                            className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            ¡Bienvenido a la Experiencia Premium!
                        </motion.h2>
                        <motion.p 
                            className="text-lg mb-6 text-blue-100"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Accede a contenido exclusivo y funciones avanzadas.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex justify-center space-x-4"
                        >
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '0s' }}></div>
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Sección de inicio de sesión */}
                <div className="w-full lg:w-1/2 p-8 bg-white/90 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-3xl font-bold text-gray-800">Inicia Sesión</h3>
                                <p className="text-gray-600">Accede a tu cuenta premium</p>
                            </div>
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 1 }}
                                className="text-indigo-600"
                            >
                                <FaRocket size={28} />
                            </motion.div>
                        </div>

                        {/* Botones de redes sociales */}
                        <div className="flex gap-4 mb-6">
                            {['google', 'twitter', 'github'].map((provider) => (
                                <motion.button
                                    key={provider}
                                    whileHover={{ y: -2, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-all ${provider === 'google' ? 'text-red-600' : provider === 'twitter' ? 'text-blue-500' : 'text-gray-800'}`}
                                >
                                    {provider === 'google' && <FaGoogle size={18} />}
                                    {provider === 'twitter' && <FaTwitter size={18} />}
                                    {provider === 'github' && <FaGithubAlt size={18} />}
                                    <span className="hidden sm:inline">{provider.charAt(0).toUpperCase() + provider.slice(1)}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Divisor estilizado */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-2 bg-white text-gray-500 text-sm">o ingresa con tu email</span>
                            </div>
                        </div>

                        {/* Mensaje de error animado */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6"
                                >
                                    <p>{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Formulario de inicio de sesión */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <FaUserCircle className="mr-2 text-indigo-600" /> Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${isValidEmail ? 'focus:ring-indigo-500 border-gray-300' : 'focus:ring-red-500 border-red-500'}`}
                                    required
                                />
                                {!isValidEmail && (
                                    <motion.p 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-sm text-red-500 mt-1"
                                    >
                                        Ingresa un correo válido.
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <FaLock className="mr-2 text-indigo-600" /> Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${isValidPassword ? 'focus:ring-indigo-500 border-gray-300' : 'focus:ring-red-500 border-red-500'}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {!isValidPassword && (
                                    <motion.p 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="text-sm text-red-500 mt-1"
                                    >
                                        La contraseña debe tener al menos 6 caracteres.
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-3 px-6 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                                </button>
                            </motion.div>
                        </form>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                ¿No tienes cuenta?{" "}
                                <NavLink to="/Signup" className="text-indigo-600 hover:underline">
                                    Regístrate
                                </NavLink>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
