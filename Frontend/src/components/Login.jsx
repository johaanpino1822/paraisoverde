import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  FaUserCircle,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRocket,
  FaLeaf,
  FaCheck
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/Auth/authSlice";
import api from "../Api/config";
import logo from "../image/logo3.png";

// Paleta de colores verde profesional
const greenTheme = {
  primary: '#00791a',
  secondary: '#064273',
  accent: '#27ae60',
  success: '#2ecc71',
  dark: '#1a3c27',
  light: '#e8f5e9',
  gradient: 'linear-gradient(135deg, #00791a 0%, #064273 100%)',
  glass: 'rgba(255, 255, 255, 0.98)',
  shadow: '0 20px 40px rgba(0, 121, 26, 0.15)'
};

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const container = document.getElementById("particles-container");
    if (!container) return;

    // Partículas profesionales sutiles
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full";
      particle.style.width = `${Math.random() * 2 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animation = `float ${Math.random() * 10 + 10}s infinite ease-in-out`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.backgroundColor = greenTheme.accent;
      particle.style.opacity = `${Math.random() * 0.2 + 0.1}`;
      container.appendChild(particle);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
      const response = await api.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      if (!data.token || !data.user) {
        throw new Error("Respuesta inválida del servidor.");
      }

      localStorage.setItem("token", data.token);
      dispatch(setCredentials(data));

      const role = data.user.role;
      if (role === "user") {
        navigate("/services");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Error al iniciar sesión";
      setError(msg);
      localStorage.removeItem("token");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gray-50"
      style={{ marginTop: '6rem' }}
    >
      {/* Fondo profesional con gradiente sutil */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, ${greenTheme.dark}15 0%, ${greenTheme.secondary}10 50%, ${greenTheme.primary}08 100%)`
        }}
      />
      
      {/* Partículas de fondo */}
      <div id="particles-container" className="absolute inset-0 z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden relative z-10 shadow-xl"
        style={{
          border: `1px solid ${greenTheme.primary}10`,
          boxShadow: greenTheme.shadow
        }}
      >
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Lado izquierdo - Bienvenida profesional */}
          <div 
            className="lg:w-2/5 p-8 text-white relative overflow-hidden"
            style={{
              background: greenTheme.gradient
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white"></div>
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-center">
              {/* Logo y branding */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex justify-center mb-4"
                >
                  <div className="relative">
                    <img
                      src={logo}
                      alt="Paraíso Verde"
                      className="h-16 w-16 mx-auto drop-shadow-lg"
                    />
                    <motion.div
                      className="absolute -inset-2 rounded-full border-2 border-white/30"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </motion.div>
                
                <motion.h1 
                  className="text-2xl font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Bienvenido a
                </motion.h1>
                <motion.h2 
                  className="text-3xl font-black mb-3 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #e8f5e9, #ffffff)`
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Paraíso Verde
                </motion.h2>
                <motion.p 
                  className="text-green-100 text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Experiencias eco-turísticas premium
                </motion.p>
              </div>

              {/* Features list */}
              <motion.div 
                className="space-y-3 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3 text-green-100">
                  <FaCheck className="text-green-300 text-sm" />
                  <span className="text-sm">Hoteles eco-sostenibles</span>
                </div>
                <div className="flex items-center gap-3 text-green-100">
                  <FaCheck className="text-green-300 text-sm" />
                  <span className="text-sm">Reservas instantáneas</span>
                </div>
                <div className="flex items-center gap-3 text-green-100">
                  <FaCheck className="text-green-300 text-sm" />
                  <span className="text-sm">Experiencias únicas</span>
                </div>
              </motion.div>

              {/* Decoración sutil */}
              <motion.div 
                className="flex justify-center gap-4 mt-8 opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.8 }}
              >
                <FaLeaf className="text-green-200" />
                <FaLeaf className="text-green-200" />
                <FaLeaf className="text-green-200" />
              </motion.div>
            </div>
          </div>

          {/* Lado derecho - Formulario profesional */}
          <div className="lg:w-3/5 p-8">
            <div className="h-full flex flex-col justify-center">
              {/* Header del formulario */}
              <div className="text-center mb-8">
                <motion.h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: greenTheme.dark }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Iniciar Sesión
                </motion.h3>
                <motion.p 
                  className="text-gray-600 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Accede a tu cuenta para gestionar tus reservas
                </motion.p>
              </div>

              {/* Mensaje de error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-6 p-4 rounded-lg border text-sm font-medium"
                    style={{
                      backgroundColor: `${greenTheme.light}30`,
                      borderColor: `${greenTheme.accent}30`,
                      color: greenTheme.dark
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Email */}
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: greenTheme.dark }}>
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="ejemplo@correo.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        isValidEmail 
                          ? 'border-gray-200 focus:border-green-500 focus:ring-green-500/20' 
                          : 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      }`}
                      style={{
                        backgroundColor: `${greenTheme.light}10`
                      }}
                    />
                    <FaUserCircle 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                      size={16} 
                    />
                  </div>
                </div>

                {/* Campo Contraseña */}
                <div>
                  <label className="block text-sm font-semibold mb-3" style={{ color: greenTheme.dark }}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Ingresa tu contraseña"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        isValidPassword 
                          ? 'border-gray-200 focus:border-green-500 focus:ring-green-500/20' 
                          : 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      }`}
                      style={{
                        backgroundColor: `${greenTheme.light}10`
                      }}
                    />
                    <FaLock 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
                      size={14} 
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Botón de envío */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 ${
                    isSubmitting 
                      ? "opacity-70 cursor-not-allowed" 
                      : "shadow-lg hover:shadow-xl active:shadow-md"
                  }`}
                  style={{
                    background: greenTheme.gradient
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Procesando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <FaRocket className="text-sm" />
                      Acceder a la Plataforma
                    </span>
                  )}
                </motion.button>
              </form>

              {/* Enlace de registro */}
              <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: `${greenTheme.primary}10` }}>
                <p className="text-sm text-gray-600">
                  ¿Primera vez en Paraíso Verde?{" "}
                  <NavLink 
                    to="/signup" 
                    className="font-semibold hover:underline transition-colors"
                    style={{ color: greenTheme.primary }}
                  >
                    Crear cuenta nueva
                  </NavLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
}