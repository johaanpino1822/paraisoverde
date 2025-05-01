import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from "./view/Home";
import Servicios from "./view/Servicios";
import Sitios from "./view/Sitios";
import Historia from "./view/Historias";
import Contacto from "./view/Contacto";
import WhatsAppChat from "./components/whatsappchat";
import Login from "./components/Login";
import Signup from "./components/Signup";


// 👑 Importa vistas de admin
import LoginAdmin from "./view/admin/LoginAdmin";
import Dashboard from "./view/admin/Dashboard";

// 🔒 Importa ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div className="">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/hoteles" element={<Servicios />} />
            <Route path="/sitios" element={<Sitios />} />
            <Route path="/Historia" element={<Historia />} />
            <Route path="/Contacto" element={<Contacto />} />
       
            <Route path="/login" element={<Login onLogin={() => alert("Inicio de sesión exitoso")} />} />
            <Route path="/signup" element={<Signup onSignup={() => alert("Registro exitoso")} />} />
            <Route path="/WhatsAppChat" element={<WhatsAppChat />} />

            {/* 👑 Rutas admin */}
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
