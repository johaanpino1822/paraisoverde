import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import "../css/Bottom.css";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bottomtop-container">
      <motion.button
        onClick={scrollToTop}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -50 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bottomtop-button"
        style={{ 
          zIndex: 9999, 
          animation: isVisible ? "float 3s ease-in-out infinite" : "none" 
        }}
      >
        <ArrowUp size={32} className="bottomtop-icon" />
        <span className="bottomtop-tooltip">Volver arriba</span>
      </motion.button>
    </div>
  );
}
