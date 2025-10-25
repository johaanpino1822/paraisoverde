import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaLeaf } from "react-icons/fa";
import axios from 'axios';
import logo from "../image/logo3.png";

export default function Signup() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiError, setApiError] = useState("");
    
    const navigate = useNavigate();

    // Paleta de colores verde
    const greenTheme = {
        primary: '#00791a',
        secondary: '#064273',
        accent: '#27ae60',
        success: '#2ecc71',
        warning: '#f39c12',
        error: '#e74c3c',
        dark: '#1a3c27',
        light: '#e8f5e9',
        gradient: 'linear-gradient(135deg, #00791a 0%, #064273 100%)',
        gradientLight: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)'
    };

    // Configurar axios base URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    // Validaciones en tiempo real
    useEffect(() => {
        const newErrors = {};
        
        if (formData.username.length > 0 && formData.username.length < 3) {
            newErrors.username = 'Mínimo 3 caracteres';
        }
        
        if (formData.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Correo no válido';
        }
        
        if (formData.password.length > 0 && formData.password.length < 6) {
            newErrors.password = 'Mínimo 6 caracteres';
        }
        
        if (formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'No coinciden';
        }
        
        setErrors(newErrors);
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        
        // Validación final
        const finalErrors = {};
        if (!formData.username.trim()) finalErrors.username = 'Requerido';
        if (!formData.email.trim()) finalErrors.email = 'Requerido';
        if (!formData.password) finalErrors.password = 'Requerido';
        if (!formData.confirmPassword) finalErrors.confirmPassword = 'Requerido';
        if (formData.password !== formData.confirmPassword) {
            finalErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        
        if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // ENVÍO REAL AL BACKEND
            const response = await axios.post(`${API_URL}/users/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            console.log('✅ Usuario registrado:', response.data);
            
            setIsSubmitting(false);
            setSuccess(true);
            
            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error en registro:', error);
            setIsSubmitting(false);
            
            if (error.response) {
                // Error del servidor
                setApiError(error.response.data.message || 'Error en el servidor');
            } else if (error.request) {
                // Error de conexión
                setApiError('Error de conexión con el servidor');
            } else {
                // Otro error
                setApiError('Error inesperado');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error de API cuando el usuario empiece a escribir
        if (apiError) setApiError("");
    };

    return (
        <div className="min-h-screen flex items-center mt-24 justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <div className="w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
                <div className="flex flex-col md:flex-row">
                    {/* Sección de Bienvenida */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full md:w-1/2 p-8 text-white"
                        style={{ background: greenTheme.gradient }}
                    >
                        <div className="flex flex-col h-full justify-center items-center text-center">
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="mb-8"
                            >
                                <img src={logo} alt="Logo" className="w-32 h-32 object-contain" />
                            </motion.div>
                            
                            <h2 className="text-3xl font-bold mb-4">¡Bienvenido a Paraíso Verde!</h2>
                            <p className="text-green-100 mb-8 max-w-md">
                                Descubre los destinos más exóticos y vive experiencias inolvidables con nuestra plataforma ecológica.
                            </p>
                            
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="hidden md:flex space-x-2"
                            >
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-3 h-3 rounded-full bg-white"
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.6, 1, 0.6]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.3
                                        }}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Sección de Registro */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-full md:w-1/2 p-8 md:p-12"
                    >
                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-8">
                                <motion.h2 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-2xl font-bold"
                                    style={{ color: greenTheme.dark }}
                                >
                                    Crear Cuenta
                                </motion.h2>
                                <p className="text-gray-600">Completa el formulario para registrarte</p>
                            </div>

                            {/* Mostrar error de API */}
                            {apiError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 rounded-lg border"
                                    style={{ 
                                        backgroundColor: `${greenTheme.error}15`,
                                        borderColor: greenTheme.error,
                                        color: greenTheme.error
                                    }}
                                >
                                    <strong>Error:</strong> {apiError}
                                </motion.div>
                            )}

                            {success ? (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-6"
                                >
                                    <div 
                                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                        style={{ backgroundColor: `${greenTheme.success}20` }}
                                    >
                                        <svg 
                                            className="w-8 h-8" 
                                            style={{ color: greenTheme.success }} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h3 
                                        className="text-xl font-bold mb-2"
                                        style={{ color: greenTheme.success }}
                                    >
                                        ¡Registro Exitoso!
                                    </h3>
                                    <p className="text-gray-600">Redirigiendo al login...</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {/* Nombre de usuario */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium mb-1 flex items-center">
                                            <FaUser className="mr-2" style={{ color: greenTheme.primary }} />
                                            <span style={{ color: greenTheme.dark }}>Nombre de usuario</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                                    errors.username 
                                                        ? 'border-red-500 focus:ring-red-500' 
                                                        : `border-gray-300 focus:ring-[${greenTheme.primary}]`
                                                }`}
                                                placeholder="Ej: viajero123"
                                            />
                                            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                        {errors.username && (
                                            <motion.p 
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-xs mt-1"
                                            >
                                                {errors.username}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium mb-1 flex items-center">
                                            <FaEnvelope className="mr-2" style={{ color: greenTheme.primary }} />
                                            <span style={{ color: greenTheme.dark }}>Correo electrónico</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                                    errors.email 
                                                        ? 'border-red-500 focus:ring-red-500' 
                                                        : `border-gray-300 focus:ring-[${greenTheme.primary}]`
                                                }`}
                                                placeholder="tucorreo@ejemplo.com"
                                            />
                                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                        {errors.email && (
                                            <motion.p 
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-xs mt-1"
                                            >
                                                {errors.email}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Contraseña */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium mb-1 flex items-center">
                                            <FaLock className="mr-2" style={{ color: greenTheme.primary }} />
                                            <span style={{ color: greenTheme.dark }}>Contraseña</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pl-10 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                                    errors.password 
                                                        ? 'border-red-500 focus:ring-red-500' 
                                                        : `border-gray-300 focus:ring-[${greenTheme.primary}]`
                                                }`}
                                                placeholder="Mínimo 6 caracteres"
                                            />
                                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <motion.p 
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-xs mt-1"
                                            >
                                                {errors.password}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Confirmar Contraseña */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-1 flex items-center">
                                            <FaLock className="mr-2" style={{ color: greenTheme.primary }} />
                                            <span style={{ color: greenTheme.dark }}>Confirmar Contraseña</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pl-10 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                                                    errors.confirmPassword 
                                                        ? 'border-red-500 focus:ring-red-500' 
                                                        : `border-gray-300 focus:ring-[${greenTheme.primary}]`
                                                }`}
                                                placeholder="Confirma tu contraseña"
                                            />
                                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <motion.p 
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-xs mt-1"
                                            >
                                                {errors.confirmPassword}
                                            </motion.p>
                                        )}
                                    </div>

                                    {/* Botón de registro */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all shadow-md ${
                                            isSubmitting 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'hover:shadow-lg'
                                        }`}
                                        style={{ 
                                            background: isSubmitting ? '#9ca3af' : greenTheme.gradient
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Registrando...
                                            </div>
                                        ) : (
                                            "Registrarse"
                                        )}
                                    </motion.button>
                                </form>
                            )}

                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600">
                                    ¿Ya tienes una cuenta?{" "}
                                    <NavLink 
                                        to="/login" 
                                        className="font-medium hover:underline"
                                        style={{ color: greenTheme.primary }}
                                    >
                                        Inicia sesión
                                    </NavLink>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}