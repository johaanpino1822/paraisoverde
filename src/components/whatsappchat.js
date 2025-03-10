import React, { useState } from "react";
import './whatsappchat.css';

const WhatsAppChat = () => {
  const phoneNumber = "573113714389"; // Reemplaza con tu número de WhatsApp
  const defaultMessage = "Hola, me gustaría obtener más información."; // Mensaje predeterminado
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  // Estado para controlar la visibilidad del tooltip
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div className="whatsapp-chat-container">
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-chat"
        aria-label="Chat de WhatsApp"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/124/124034.png"
          alt="WhatsApp"
          className="whatsapp-icon"
        />
        {isTooltipVisible && (
          <span className="whatsapp-tooltip">¡Chatea con nosotros!</span>
        )}
      </a>
    </div>
  );
};

export default WhatsAppChat;