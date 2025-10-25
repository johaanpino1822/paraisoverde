import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fundacion from "../image/fundacion.jpg";

// Paleta de colores profesional y suave
const professionalTheme = {
  primary: '#00791a',
  secondary: '#064273',
  accent: '#27ae60',
  success: '#2ecc71',
  light: '#e8f5e9',
  dark: '#1a3c27',
  text: '#2d3748',
  textLight: '#718096',
  background: '#f7fafc',
  gradient: 'linear-gradient(135deg, #00791a 0%, #064273 100%)',
  glass: 'rgba(255, 255, 255, 0.92)'
};

// Iconos suaves y profesionales
const ProfessionalIcon = ({ children }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const icons = {
  foundation: (
    <ProfessionalIcon>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </ProfessionalIcon>
  ),
  church: (
    <ProfessionalIcon>
      <path d="M18 22H6a2 2 0 0 1-2-2V10l6-4 6 4v10a2 2 0 0 1-2 2z" />
      <path d="M12 6v8" />
      <path d="M10 14h4" />
    </ProfessionalIcon>
  ),
  market: (
    <ProfessionalIcon>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </ProfessionalIcon>
  ),
  festival: (
    <ProfessionalIcon>
      <path d="M15.2 3a2 2 0 0 1 2 2v16l-5-3-5 3V5a2 2 0 0 1 2-2h6z" />
      <path d="M10 10h4" />
      <path d="M12 8v4" />
    </ProfessionalIcon>
  ),
};

const Timeline = () => {
  const events = [
    {
      year: "1916",
      title: "Fundación del Pueblo",
      description: "Fundado en 1916 por Esteban Velásquez como corregimiento llamándose San José de San Andrés.",
      details: "La fundación del pueblo marcó el inicio de una comunidad próspera que ha crecido a lo largo de los siglos, estableciendo las bases para el desarrollo cultural y social de la región.",
      icon: icons.foundation,
      image: Fundacion,
      significance: "Hito Fundacional"
    },
    {
      year: "1750",
      title: "Construcción de la Iglesia",
      description: "La iglesia principal fue construida en 1750 y se ha mantenido como un símbolo de la fe y la comunidad.",
      details: "La iglesia es un ejemplo destacado de la arquitectura colonial y ha sido restaurada varias veces para preservar su belleza original y significado histórico.",
      icon: icons.church,
      image: "",
      significance: "Patrimonio Arquitectónico"
    },
    {
      year: "1900",
      title: "Apertura del Mercado Central",
      description: "El primer mercado abrió sus puertas en 1900, proporcionando a los residentes un lugar para comerciar y socializar.",
      details: "El mercado se convirtió en el corazón económico del pueblo, atrayendo a comerciantes de regiones cercanas y estableciendo rutas comerciales importantes.",
      icon: icons.market,
      image: "",
      significance: "Desarrollo Económico"
    },
    {
      year: "1950",
      title: "Festividades Anuales",
      description: "Las festividades anuales comenzaron en 1950 y se han convertido en una tradición querida por todos los habitantes.",
      details: "Cada año, las festividades incluyen desfiles, música, comida típica y actividades para todas las edades, reforzando la identidad cultural.",
      icon: icons.festival,
      image: "",
      significance: "Tradición Cultural"
    },
  ];

  const [activeEvent, setActiveEvent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timelineRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Auto-play suave
  useEffect(() => {
    if (!isAutoPlaying) return;

    autoPlayRef.current = setInterval(() => {
      setActiveEvent(prev => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, events.length]);

  const handleEventClick = (index) => {
    setActiveEvent(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section 
      className="relative py-20 bg-white"
      style={{ marginTop: '8.5rem' }}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header suave y profesional */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ 
              background: `${professionalTheme.light}`,
              color: professionalTheme.primary
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-2 h-2 rounded-full bg-current" />
            <span className="text-sm font-medium">Línea de Tiempo Histórica</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-light text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Nuestra Historia
          </motion.h2>

          <motion.div
            className="w-16 h-0.5 mx-auto mb-6"
            style={{ background: professionalTheme.gradient }}
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Un recorrido por los momentos que definieron nuestra comunidad
          </motion.p>
        </motion.div>

        {/* Timeline principal - Diseño horizontal suave */}
        <div className="relative" ref={timelineRef}>
          {/* Línea de tiempo horizontal */}
          <motion.div
            className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Puntos de tiempo */}
          <motion.div
            className="relative flex justify-between mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {events.map((event, index) => (
              <motion.button
                key={index}
                className="flex flex-col items-center group cursor-pointer"
                variants={itemVariants}
                onClick={() => handleEventClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Punto de tiempo */}
                <motion.div
                  className={`w-4 h-4 rounded-full mb-4 transition-all duration-300 ${
                    activeEvent === index ? 'scale-125' : 'scale-100'
                  }`}
                  style={{
                    background: activeEvent === index ? professionalTheme.primary : professionalTheme.success,
                    boxShadow: activeEvent === index 
                      ? `0 0 0 4px ${professionalTheme.primary}20` 
                      : 'none'
                  }}
                  animate={{
                    scale: activeEvent === index ? 1.2 : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Año */}
                <motion.div
                  className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                    activeEvent === index ? 'text-gray-800' : 'text-gray-500'
                  }`}
                >
                  {event.year}
                </motion.div>

                {/* Línea conectiva */}
                <motion.div
                  className="w-0.5 h-8"
                  style={{
                    background: activeEvent === index 
                      ? professionalTheme.gradient 
                      : 'transparent'
                  }}
                  animate={{
                    height: activeEvent === index ? 32 : 0
                  }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
            ))}
          </motion.div>

          {/* Contenido del evento activo */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="p-8">
                <div className="flex items-start gap-6">
                  {/* Icono */}
                  <motion.div
                    className="flex-shrink-0 p-3 rounded-xl"
                    style={{
                      background: `${professionalTheme.primary}15`,
                      color: professionalTheme.primary
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {events[activeEvent].icon}
                  </motion.div>

                  {/* Contenido */}
                  <div className="flex-1">
                    <motion.div
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                      style={{
                        background: `${professionalTheme.success}20`,
                        color: professionalTheme.dark
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      {events[activeEvent].significance}
                    </motion.div>

                    <motion.h3
                      className="text-2xl font-semibold text-gray-800 mb-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      {events[activeEvent].title}
                    </motion.h3>

                    <motion.p
                      className="text-gray-600 leading-relaxed mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      {events[activeEvent].description}
                    </motion.p>

                    <motion.p
                      className="text-gray-700 leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      {events[activeEvent].details}
                    </motion.p>
                  </div>
                </div>

                {/* Imagen si existe */}
                {events[activeEvent].image && (
                  <motion.div
                    className="mt-6"
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <img
                      src={events[activeEvent].image}
                      alt={events[activeEvent].title}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navegación inferior */}
          <motion.div
            className="flex justify-center items-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button
              onClick={() => handleEventClick((activeEvent - 1 + events.length) % events.length)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              style={{ color: professionalTheme.primary }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Indicadores */}
            <div className="flex gap-2">
              {events.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleEventClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeEvent === index 
                      ? 'bg-gray-800 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => handleEventClick((activeEvent + 1) % events.length)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              style={{ color: professionalTheme.primary }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;