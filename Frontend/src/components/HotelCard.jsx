import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function HotelCard({ 
  name, 
  location, 
  price, 
  originalPrice,
  image, 
  amenities, 
  rating, 
  discount,
  exclusive = false 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([image || "/img/default.jpg"]);

  // Simular múltiples imágenes para el carrusel
  useEffect(() => {
    if (image) {
      setImages([
        image,
        image.replace('1', '2') || image,
        image.replace('1', '3') || image
      ]);
    }
  }, [image]);

  // Carrusel automático al hacer hover
  useEffect(() => {
    let interval;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative max-w-sm overflow-hidden transition-all mt-44 duration-500 ease-in-out ${
        isHovered ? 'transform -translate-y-2 shadow-2xl' : 'shadow-xl'
      } rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Etiquetas superiores */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        {exclusive && (
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
            EXCLUSIVO
          </span>
        )}
        {discount && (
          <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            -{discount}% OFF
          </span>
        )}
      </div>

      {/* Botón de favoritos premium */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleFavorite}
        className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
          isFavorite 
            ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white shadow-lg' 
            : 'bg-white/10 backdrop-blur-sm text-gray-300 hover:text-white hover:bg-white/20'
        } shadow-md`}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill={isFavorite ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isFavorite ? 0 : 2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </motion.button>

      {/* Carrusel de imágenes con efecto parallax */}
      <div className="relative overflow-hidden h-64">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`w-full h-full object-cover transition-transform duration-1000 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
        </AnimatePresence>
        
        {/* Overlay y controles del carrusel */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-90'
        }`}></div>
        
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentImageIndex === index 
                    ? 'w-6 bg-white' 
                    : 'w-3 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <motion.h3 
            className="text-2xl font-bold text-white truncate"
            whileHover={{ color: '#f59e0b' }}
          >
            {name}
          </motion.h3>
          
          {rating && (
            <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm font-semibold text-white">{rating}</span>
            </div>
          )}
        </div>

        {/* Ubicación con icono animado */}
        <motion.div 
          className="flex items-center text-gray-300 mb-4"
          whileHover={{ x: 5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="text-sm">{location}</p>
        </motion.div>

        {/* Amenities con scroll horizontal táctil */}
        <div className="mb-5 overflow-x-auto pb-3 custom-scrollbar">
          <div className="flex space-x-3">
            {amenities?.map((a, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-xs font-medium text-white flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {a}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Precio y botón de reserva */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <div>
            {originalPrice && (
              <p className="text-xs text-gray-400 line-through">${originalPrice}</p>
            )}
            <p className="text-xs text-gray-400">Desde</p>
            <div className="flex items-end">
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                {price}
              </p>
              <span className="text-sm text-gray-400 ml-1">/noche</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all flex items-center"
          >
            Reservar ahora
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Efecto de destello al hacer hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
        </div>
      )}
    </motion.div>
  );
}

export default HotelCard;