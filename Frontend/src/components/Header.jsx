import React, { useState } from "react";


const Header = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <header
      className={`position-relative overflow-hidden text-white mt-4 mb-2 ${
        hovered ? "scale-105" : "scale-100"
      }`}
      style={{
        height: "35rem",
        background:
          "linear-gradient(135deg, #0d2601, #1b5e20, #4caf50, #8bc34a)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        transition: "transform 0.7s ease-in-out",
       
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Overlay con un degradado sutil */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.7) 20%, rgba(0, 0, 0, 0.3) 80%)",
        }}
      ></div>

      {/* Contenido principal */}
      <div className="position-relative d-flex flex-column align-items-center justify-content-center h-100 text-center px-4">
        <h1
          className="display-3 fw-bold text-uppercase mb-4"
          style={{
            color: "#e3f2fd",
            textShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)",
            animation: "fadeInDown 1.5s ease-in-out",
          }}
        >
          Historia del Pueblo
        </h1>
        <p
          className="lead fs-4 mb-5"
          style={{
            color: "#c8e6c9",
            animation: "fadeInUp 1.5s ease-in-out",
          }}
        >
          Descubre las raíces, costumbres y tradiciones que forjaron nuestra comunidad.
        </p>
        <button
          className="btn btn-lg mt-3 px-5 py-2 fw-bold shadow-lg"
          style={{
            background: "linear-gradient(90deg, #1b5e20, #4caf50)",
            color: "#e8f5e9",
            borderRadius: "50px",
            border: "none",
            transition: "transform 0.4s ease-in-out, background 0.3s ease",
            animation: "fadeIn 2s ease-in-out",
          }}
          onMouseEnter={(e) => (e.target.style.background = "linear-gradient(90deg, #0d2601, #1b5e20)")}
          onMouseLeave={(e) => (e.target.style.background = "linear-gradient(90deg, #1b5e20, #4caf50)")}
          onClick={() => alert("¡Gracias por interesarte en nuestra historia!")}
        >
          Leer Más
        </button>
      </div>

      {/* Elementos decorativos sutiles */}
      <div
        className="position-absolute top-0 start-0 bg-success rounded-circle opacity-10"
        style={{
          width: "5rem",
          height: "5rem",
          filter: "blur(40px)",
          transform: "translate(-50%, -50%)",
          animation: "float 6s infinite ease-in-out",
        }}
      ></div>
      <div
        className="position-absolute bottom-0 end-0 bg-light rounded-circle opacity-10"
        style={{
          width: "6rem",
          height: "6rem",
          filter: "blur(50px)",
          transform: "translate(50%, 50%)",
          animation: "float 8s infinite ease-in-out",
        }}
      ></div>

      {/* Animación de scroll down */}
      <div
        className="position-absolute bottom-4 start-50 translate-middle-x text-center"
        style={{ animation: "bounce 2s infinite" }}
      >
        <span
          className="d-block fs-6 mb-2"
          style={{ color: "#c8e6c9", textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)" }}
        >
          Desplázate
        </span>
        <i
          className="bi bi-chevron-down fs-4"
          style={{ color: "#c8e6c9", textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)" }}
        ></i>
      </div>
    </header>
  );
};

export default Header;

// Animaciones CSS
const styles = `
  @keyframes fadeInDown {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

// Agregar estilos al documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);