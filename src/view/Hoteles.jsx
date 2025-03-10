import React, { useState } from "react";
import Login from "../components/Login";
import Footer from "../components/Footer";
import Hotescard from "../components/HotelCard"

function Hoteles() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="hoteles-container">
      <h1 className="title">🏨 Hoteles Disponibles</h1>
      <p className="description">
        Encuentra los mejores hoteles con las mejores ofertas para tu viaje.
      </p>
      <div className="hotel-list">
        <div className="hotel-card">
    
          <h3>Hotel Paradise</h3>
          <Hotescard/>

          
          <Footer/>
        </div>
      </div>
    </div>
  );
}

export default Hoteles;
