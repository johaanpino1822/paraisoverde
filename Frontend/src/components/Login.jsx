import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  FaGithubAlt,
  FaGoogle,
  FaTwitter,
  FaUserCircle,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRocket,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/Auth/authSlice";
import api from "../Api/config";
import logo from "../image/logo1.png";

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

    for (let i = 0; i < 50; i++) {
      const star = document.createElement("div");
      star.className = "absolute rounded-full bg-white/30 animate-twinkle";
      star.style.width = `${Math.random() * 3 + 1}px`;
      star.style.height = star.style.width;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(star);
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
      // ✅ Enviar solicitud al backend
      const response = await api.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      // ✅ Validar que tenga token
      if (!data.token || !data.user) {
        throw new Error("Respuesta inválida del servidor.");
      }

      // ✅ Guardar token y credenciales
      localStorage.setItem("token", data.token);
      dispatch(setCredentials(data));

      // ✅ Redirigir según rol - CORRECCIÓN APLICADA AQUÍ
      const role = data.user.role;
      if (role === "user") {
        navigate("/services"); // Usuarios normales van a /services
      } else {
        navigate("/admin/dashboard"); // Admins mantienen su ruta
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 relative overflow-hidden mt-24">
      <div id="particles-container" className="absolute inset-0 z-0 overflow-hidden" />
      <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transform transition-all hover:shadow-3xl border border-white/20 relative z-10"
      >
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600/90 via-indigo-600/90 to-purple-600/90 p-8 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>

          <motion.img
            src={logo}
            alt="Logo"
            className="w-32 h-32 mb-6 mx-auto"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.h2 className="text-4xl font-bold mb-4 text-white">
            ¡Bienvenido a Paraíso Verde!
          </motion.h2>
          <motion.p className="text-lg mb-6 text-blue-100">
            Descubre experiencias turísticas únicas
          </motion.p>
        </div>

        <div className="w-full lg:w-1/2 p-8 bg-white/90 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-3xl font-bold text-gray-800">Inicia Sesión</h3>
              <p className="text-gray-600">Accede a tu cuenta</p>
            </div>
            <FaRocket size={28} className="text-indigo-600" />
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaUserCircle className="mr-2 text-indigo-600" /> Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg ${isValidEmail ? 'border-gray-300' : 'border-red-500'}`}
              />
              {!isValidEmail && (
                <p className="text-sm text-red-500 mt-1">Ingresa un correo válido</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaLock className="mr-2 text-indigo-600" /> Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg ${isValidPassword ? 'border-gray-300' : 'border-red-500'}`}
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
                <p className="text-sm text-red-500 mt-1">Mínimo 6 caracteres</p>
              )}
            </div>

            {/* Botón */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <NavLink to="/signup" className="text-indigo-600 hover:underline">
                Regístrate
              </NavLink>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}