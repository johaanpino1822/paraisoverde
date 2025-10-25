import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Paleta de colores ultra sofisticada
const luxuryTheme = {
  dark: "#0A1F0D",
  primary: "#1A472A",
  accent: "#2E8B57",
  gold: "#D4AF37",
  platinum: "#E8E8E8",
  silver: "#C0C0C0",
  gradient: "linear-gradient(135deg, #0A1F0D 0%, #1A472A 40%, #2E8B57 100%)",
  overlay: "linear-gradient(180deg, rgba(10, 31, 13, 0.95) 0%, rgba(26, 71, 42, 0.85) 50%, rgba(46, 139, 87, 0.7) 100%)"
};

const Header = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setIsVisible(scrollTop < 100);
    };

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <motion.header
      className="relative overflow-hidden text-white"
      style={{
        height: "100vh",
        minHeight: "800px",
        background: luxuryTheme.gradient,
        marginTop: '8.5rem' // mt-34 equivalente
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Patrón geométrico de fondo */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="1" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Overlay de lujo */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: luxuryTheme.overlay,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Líneas de acento dorado */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" 
           style={{ background: `linear-gradient(90deg, transparent, ${luxuryTheme.gold}, transparent)` }} />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent" 
           style={{ background: `linear-gradient(90deg, transparent, ${luxuryTheme.gold}, transparent)` }} />

      {/* Contenido principal */}
      <div className="relative h-full flex flex-col mt-24 mb-24 items-center justify-center text-center px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          {/* Sello de autenticidad */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border mb-12 backdrop-blur-lg"
            style={{ 
              borderColor: `${luxuryTheme.gold}50`,
              background: 'rgba(212, 175, 55, 0.05)'
            }}
          >
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{ background: luxuryTheme.gold }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-light tracking-widest uppercase" style={{ color: luxuryTheme.gold }}>
              Patrimonio • 
            </span>
          </motion.div>

          {/* Título principal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-thin tracking-tight mb-8 leading-none"
              style={{ color: luxuryTheme.platinum }}
              initial={{ letterSpacing: '0.5em' }}
              animate={{ letterSpacing: '0.1em' }}
              transition={{ duration: 1.5, delay: 1.2 }}
            >
              HISTORIA
            </motion.h1>
            
            <motion.div
              className="flex items-center justify-center gap-8 mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, transparent, ${luxuryTheme.gold}, transparent)` }} />
              <motion.span
                className="text-2xl md:text-3xl font-light italic"
                style={{ color: luxuryTheme.silver }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
              >
                del Legado Cultural
              </motion.span>
              <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, transparent, ${luxuryTheme.gold}, transparent)` }} />
            </motion.div>
          </motion.div>

          {/* Línea divisora central */}
          <motion.div
            className="w-px h-32 mx-auto mb-12"
            style={{ background: `linear-gradient(180deg, transparent, ${luxuryTheme.gold}, transparent)` }}
            initial={{ height: 0 }}
            animate={{ height: 128 }}
            transition={{ duration: 1.5, delay: 2 }}
          />

          {/* Descripción elegante */}
          <motion.p
            className="text-lg md:text-xl mb-16 leading-relaxed max-w-2xl mx-auto font-light tracking-wide"
            style={{ color: luxuryTheme.silver }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 2.2 }}
          >
            Una crónica meticulosa que revela los{" "}
            <span className="font-normal" style={{ color: luxuryTheme.platinum }}>
              pilares fundamentales
            </span>{" "}
            de nuestra identidad colectiva, preservando la esencia de generaciones.
          </motion.p>

          {/* Botones de acción premium */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
            className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20"
          >
            <motion.button
              className="group relative px-12 py-5 font-light text-lg tracking-wider uppercase overflow-hidden"
              style={{
                background: 'transparent',
                color: luxuryTheme.platinum,
                border: `1px solid ${luxuryTheme.gold}`,
                letterSpacing: '0.2em'
              }}
              whileHover={{ 
                scale: 1.02,
                background: `linear-gradient(45deg, transparent, ${luxuryTheme.gold}15, transparent)`
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-4">
                EXPLORAR CRÓNICA
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </motion.svg>
              </span>
              
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gold to-transparent"
                style={{ opacity: 0.1 }}
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
            </motion.button>

            <motion.button
              className="px-10 py-5 font-light tracking-wider uppercase border backdrop-blur-lg transition-all duration-500"
              style={{
                borderColor: luxuryTheme.silver,
                color: luxuryTheme.silver,
                background: 'rgba(192, 192, 192, 0.05)',
                letterSpacing: '0.2em'
              }}
              whileHover={{ 
                background: 'rgba(192, 192, 192, 0.1)',
                borderColor: luxuryTheme.platinum,
                color: luxuryTheme.platinum
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-4">
                GALERÍA DOCUMENTAL
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            </motion.button>
          </motion.div>

          {/* Información de contexto premium */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto pt-12 border-t"
            style={{ borderColor: 'rgba(212, 175, 55, 0.3)' }}
          >
            {[
              { 
                number: "178", 
                label: "Años de Documentación",
                description: "Archivo histórico continuo"
              },
              { 
                number: "2,847", 
                label: "Documentos Preservados",
                description: "Manuscritos y registros"
              },
              { 
                number: formatTime(currentTime), 
                label: "Tiempo Actual",
                description: "Actualizado en tiempo real"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.2 + index * 0.3 }}
              >
                <div className="text-3xl font-light mb-2 tracking-wide" style={{ color: luxuryTheme.gold }}>
                  {stat.number}
                </div>
                <div className="text-sm font-medium mb-1 tracking-wider uppercase" style={{ color: luxuryTheme.platinum }}>
                  {stat.label}
                </div>
                <div className="text-xs font-light tracking-wide" style={{ color: luxuryTheme.silver, opacity: 0.7 }}>
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Indicador de scroll de lujo */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={scrollToContent}
          >
            <motion.div
              className="text-xs font-light tracking-widest uppercase mb-6"
              style={{ color: luxuryTheme.silver }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Descubre la Narrativa Completa
            </motion.div>
            
            {/* Indicador de scroll elegante */}
            <motion.div
              className="relative"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-px h-16 mx-auto" style={{ background: `linear-gradient(180deg, ${luxuryTheme.gold}, transparent)` }} />
              <div className="w-2 h-2 rounded-full mx-auto mt-2" style={{ background: luxuryTheme.gold }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;