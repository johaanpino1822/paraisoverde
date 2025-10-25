import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPlay, FaPause } from 'react-icons/fa';

// Importa tus imágenes
import image1 from '../image/paramo3.jpg';
import image2 from '../image/paisaje.jpg';
import paramo2 from '../image/paramo.jpg';
import Card6 from '../image/Card6.jpg';
import Card5 from '../image/Card5.jpg';

function CardGroup() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Datos de las tarjetas
  const cards = [
    {
      id: 1,
      image: image1,
      title: "Páramo",
      description: "Descubre la majestuosidad del páramo, un ecosistema único lleno de vida y misterio."
    },
    {
      id: 2,
      image: image2,
      title: "Aventura Natural",
      description: "Vive una experiencia inolvidable rodeado de paisajes impresionantes y biodiversidad."
    },
    {
      id: 3,
      image: paramo2,
      title: "Espacio Natural",
      description: "Explora reservas naturales y sumérgete en la tranquilidad de la naturaleza."
    },
    {
      id: 4,
      image: image1,
      title: "El valle de los Osos",
      description: "Descubre la majestuosidad del páramo, un ecosistema único lleno de vida y misterio."
    },
    {
      id: 5,
      image: Card5,
      title: "El bosque de niebla",
      description: "Vive una experiencia inolvidable rodeado de paisajes impresionantes y biodiversidad."
    },
    {
      id: 6,
      image: Card6,
      title: "El chorro del Aguila",
      description: "Explora reservas naturales y sumérgete en la tranquilidad de la naturaleza."
    }
  ];

  // Navegación automática
  useEffect(() => {
    let interval;
    if (autoPlay) {
      interval = setInterval(() => {
        nextCard();
      }, 4000); // Cambia cada 4 segundos
    }
    return () => clearInterval(interval);
  }, [autoPlay, currentIndex]);

  const nextCard = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === cards.length - 1 ? 0 : prevIndex + 1
    );
  }, [cards.length]);

  const prevCard = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  }, [cards.length]);

  const goToCard = (index) => {
    setCurrentIndex(index);
  };

  // Touch events para dispositivos móviles
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextCard();
    } else if (isRightSwipe) {
      prevCard();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Función para agrupar tarjetas (mostrar 3 por vista en desktop)
  const getVisibleCards = () => {
    const isMobile = window.innerWidth < 768;
    const cardsPerView = isMobile ? 1 : 3;
    
    let visibleCards = [];
    
    for (let i = 0; i < cardsPerView; i++) {
      const cardIndex = (currentIndex + i) % cards.length;
      visibleCards.push(cards[cardIndex]);
    }
    
    return visibleCards;
  };

  return (   
    <div className="container mx-auto px-4 py-12">
      {/* Título */}
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Explora Nuestros Paisajes
      </h2>

      {/* Controles del carrusel */}
      <div className="flex justify-center items-center mb-6 space-x-4">
        <motion.button 
          onClick={() => setAutoPlay(!autoPlay)}
          className={`p-2 rounded-full ${
            autoPlay ? 'bg-[#0C4B45] text-white' : 'bg-gray-200 text-gray-700'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {autoPlay ? <FaPause className="text-sm" /> : <FaPlay className="text-sm" />}
        </motion.button>
        
        <span className="text-sm text-gray-600">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Contenedor del carrusel */}
      <div 
        className="relative overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Contenedor de tarjetas con transición */}
        <div className="flex transition-transform duration-500 ease-in-out">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {getVisibleCards().map((card, index) => (
                <motion.div
                  key={`${card.id}-${currentIndex}`}
                  className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6 bg-white">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{card.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {card.description}
                    </p>
                    <motion.button 
                      className="px-4 py-2 bg-[#0C4B45] text-white rounded-lg hover:bg-[#083D38] transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explorar
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Botones de navegación */}
        <motion.button 
          onClick={prevCard}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10 backdrop-blur-sm"
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Anterior"
        >
          <FaChevronLeft className="text-[#0C4B45] text-lg" />
        </motion.button>
        
        <motion.button 
          onClick={nextCard}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg z-10 backdrop-blur-sm"
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Siguiente"
        >
          <FaChevronRight className="text-[#0C4B45] text-lg" />
        </motion.button>
      </div>

      {/* Indicadores de posición */}
      <div className="flex justify-center mt-8 space-x-2">
        {cards.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToCard(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-[#0C4B45] scale-125' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Ir a tarjeta ${index + 1}`}
          />
        ))}
      </div>

      {/* Indicadores de progreso (opcional) */}
      <div className="mt-4 flex justify-center">
        <div className="w-64 bg-gray-200 rounded-full h-1">
          <motion.div 
            className="h-full bg-[#0C4B45] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

export default CardGroup;