import React, { useState, useEffect, useRef } from "react";
import './whatsappchat.css';
  
const WhatsAppChat = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
  
    const advisors = [
      { name: "John fernando", role: "Asesor", phoneNumber: "573113714389" },
      { name: "Johaan David", role: "Asesor", phoneNumber: "573233019836" }
    ];
  
    const handleChat = (phoneNumber) => {
      const defaultMessage = "Hola, me gustaría obtener más información.";
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
      window.open(whatsappURL, "_blank");
  
      // Cierra el menú después de elegir un asesor
      setIsMenuOpen(false);
    };
  
    // Cierra el menú si se hace clic fuera
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsMenuOpen(false);
        }
      };
  
      if (isMenuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isMenuOpen]);
  
    return (
      <div className="whatsapp-container">
        {/* Botón de WhatsApp */}
        <div 
          className="whatsapp-button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✖" : <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="WhatsApp" />}
        </div>
  
        {/* Menú desplegable */}
        {isMenuOpen && (
          <div className="whatsapp-menu" ref={menuRef}>
            {advisors.map((advisor, index) => (
              <div key={index} className="whatsapp-card" onClick={() => handleChat(advisor.phoneNumber)}>
                <img src="https://cdn-icons-png.flaticon.com/512/124/124034.png" alt="WhatsApp" className="whatsapp-icon" />
                <div className="whatsapp-info">
                  <p className="whatsapp-name">{advisor.name}</p>
                  <p className="whatsapp-role">{advisor.role}</p>
                </div>
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="Ir al chat" className="whatsapp-go-icon" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
export default WhatsAppChat;