import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaLeaf } from "react-icons/fa";
import logo from "../image/logo1.png";

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
    
    const navigate = useNavigate();

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
        
        // Validación final
        const finalErrors = {};
        if (!formData.username.trim()) finalErrors.username = 'Requerido';
        if (!formData.email.trim()) finalErrors.email = 'Requerido';
        if (!formData.password) finalErrors.password = 'Requerido';
        if (!formData.confirmPassword) finalErrors.confirmPassword = 'Requerido';
        if (formData.password !== formData.confirmPassword) {
            finalErrors.confirmPassword = 'No coinciden';
        }
        
        if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);
            return;
        }
        
        setIsSubmitting(true);
        
        // Simulación de envío
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        }, 1500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className= "min-h-screen flex items-center  mt-24  justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Sección de Bienvenida - Mejorada */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-white"
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
                            <p className="text-blue-100 mb-8 max-w-md">
                                Descubre los destinos más exóticos y vive experiencias inolvidables con nuestra plataforma.
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
                            
                            <div className="mt-12 hidden md:block">
                                <motion.div
                                    animate={{ 
                                        x: [-10, 10, -10],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{
                                        duration: 12,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                >
                                    <FaLeaf className="text-4xl text-blue-300 opacity-70" />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sección de Registro - Mejorada */}
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
                                    className="text-2xl font-bold text-gray-800"
                                >
                                    Crear Cuenta
                                </motion.h2>
                                <p className="text-gray-600">Completa el formulario para registrarte</p>
                            </div>

                            {success ? (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-6"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-green-700 mb-2">¡Registro Exitoso!</h3>
                                    <p className="text-gray-600">Redirigiendo...</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    {/* Nombre de usuario */}
                                    <div className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaUser className="mr-2 text-blue-600" />
                                            Nombre de usuario
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pl-10 rounded-lg border ${
                                                    errors.username ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaEnvelope className="mr-2 text-blue-600" />
                                            Correo electrónico
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pl-10 rounded-lg border ${
                                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaLock className="mr-2 text-blue-600" />
                                            Contraseña
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pl-10 pr-10 rounded-lg border ${
                                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                                placeholder="Mínimo 6 caracteres"
                                            />
                                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FaLock className="mr-2 text-blue-600" />
                                            Confirmar Contraseña
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pl-10 pr-10 rounded-lg border ${
                                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                                placeholder="Confirma tu contraseña"
                                            />
                                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
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

                                    {/* Términos y condiciones */}
                                    <div className="flex items-center mb-6">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            required
                                        />
                                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                            Acepto los <a href="#" className="text-blue-600 hover:underline">Términos</a> y <a href="#" className="text-blue-600 hover:underline">Privacidad</a>
                                        </label>
                                    </div>

                                    {/* Botón de registro */}
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
                                            isSubmitting 
                                                ? 'bg-blue-400 cursor-not-allowed' 
                                                : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md'
                                        }`}
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
                                    <NavLink to="/login" className="font-medium text-blue-600 hover:text-blue-700 hover:underline">
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