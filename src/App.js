import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar"; // Importamos nuestra Navbar
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./view/Home";
import Hoteles from "./view/Hoteles";
import Sitios from "./view/Sitios";
import Historia from "./view/Historias";
import WhatsAppChat from "./components/whatsappchat";
import Login from "./components/Login";
import Signup from "./components/Signup"; // Importamos el componente Signup
import "./index.css"; 
import "bootstrap/dist/css/bootstrap.min.css"
function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar /> {/* Agregamos la Navbar */}
        <div className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hoteles" element={<Hoteles />} />
            <Route path="/sitios" element={<Sitios />} />
            <Route path="/Historia" element={<Historia />} />
            <Route path="/login" element={<Login onLogin={() => alert("Inicio de sesión exitoso")} />} />
            <Route path="/signup" element={<Signup onSignup={() => alert("Registro exitoso")} />} />
            <Route path="/WhatsAppChat" element={<WhatsAppChat />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;