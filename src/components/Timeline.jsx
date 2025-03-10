import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Iconos SVG personalizados
const icons = {
  foundation: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  church: (
    <svg xmlns="" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 22H6a2 2 0 0 1-2-2V10l6-4 6 4v10a2 2 0 0 1-2 2z" />
      <path d="M12 6v8" />
      <path d="M10 14h4" />
    </svg>
  ),
  market: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  festival: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.2 3a2 2 0 0 1 2 2v16l-5-3-5 3V5a2 2 0 0 1 2-2h6z" />
      <path d="M10 10h4" />
      <path d="M12 8v4" />
    </svg>
  ),
};

const Timeline = () => {
  const events = [
    {
      year: "1600",
      title: "Fundación del pueblo",
      description: "El pueblo fue fundado en el año 1600 por un grupo de colonos que buscaban nuevas tierras para establecerse.",
      details: "La fundación del pueblo marcó el inicio de una comunidad próspera que ha crecido a lo largo de los siglos.",
      icon: icons.foundation,
      image: "https://via.placeholder.com/400x200?text=Fundación+1600",
    },
    {
      year: "1750",
      title: "Construcción de la iglesia",
      description: "La iglesia principal fue construida en 1750 y se ha mantenido como un símbolo de la fe y la comunidad desde entonces.",
      details: "La iglesia es un ejemplo destacado de la arquitectura colonial y ha sido restaurada varias veces para preservar su belleza.",
      icon: icons.church,
      image: "https://via.placeholder.com/400x200?text=Iglesia+1750",
    },
    {
      year: "1900",
      title: "Apertura del mercado",
      description: "El primer mercado abrió sus puertas en 1900, proporcionando a los residentes un lugar para comerciar y socializar.",
      details: "El mercado se convirtió en el corazón económico del pueblo, atrayendo a comerciantes de regiones cercanas.",
      icon: icons.market,
      image: "https://via.placeholder.com/400x200?text=Mercado+1900",
    },
    {
      year: "1950",
      title: "Festividades anuales",
      description: "Las festividades anuales comenzaron en 1950 y se han convertido en una tradición querida por todos los habitantes.",
      details: "Cada año, las festividades incluyen desfiles, música, comida típica y actividades para todas las edades.",
      icon: icons.festival,
      image: "https://via.placeholder.com/400x200?text=Festividades+1950",
    },
  ];

  const [visibleItems, setVisibleItems] = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const newVisibleItems = events.map((_, index) => {
        const element = document.getElementById(`event-${index}`);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.75;
      });

      setVisibleItems(newVisibleItems);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Para activar el efecto en elementos ya visibles
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEventClick = (index) => {
    setActiveEvent(activeEvent === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        {/* Título con efecto */}
        <motion.h2
          className="text-center font-bold text-5xl mb-16 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          🕰️ Línea de Tiempo
        </motion.h2>

        <div className="relative">
          {/* Línea central animada */}
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-400 to-teal-500 shadow-lg"
            initial={{ opacity: 0, height: "0%" }}
            animate={{ opacity: 1, height: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Eventos */}
          {events.map((event, index) => (
            <motion.div
              key={index}
              id={`event-${index}`}
              className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-center gap-8 mb-16`}
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: visibleItems[index] ? 1 : 0,
                y: visibleItems[index] ? 0 : 50,
              }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
            >
              {/* Punto del evento con glow */}
              <motion.div
                className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-teal-500 shadow-xl cursor-pointer"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEventClick(index)}
              >
                <div className="text-white text-2xl">{event.icon}</div>
              </motion.div>

              {/* Tarjeta del evento con efecto de vidrio */}
              <motion.div
                className="flex-1 p-8 rounded-lg backdrop-blur-md bg-white/10 border border-white/10 shadow-2xl"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                <p className="text-gray-300 mb-4">{event.description}</p>

                {/* Detalles expandibles */}
                <AnimatePresence>
                  {activeEvent === index && (
                    <motion.div
                      className="mt-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-gray-400 mb-4">{event.details}</p>
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;