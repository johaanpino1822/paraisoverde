// src/components/SiteCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

function SiteCard({ id, name, description, location, category, entranceFee, images, highlights }) {
  
  // Obtener la imagen principal con URL completa
  const getMainImage = () => {
    if (images && images.length > 0) {
      if (typeof images[0] === 'string') {
        return `http://localhost:5000/uploads/sites/${images[0]}`;
      }
      if (images[0].url) {
        return images[0].url;
      }
      if (images[0].path) {
        return `http://localhost:5000${images[0].path}`;
      }
    }
    return '/default-image.jpg';
  };

  const mainImage = getMainImage();

  // Paleta de colores basada en la navbar
  const colors = {
    primary: '#00791a',      // Verde principal
    secondary: '#064273',    // Azul secundario
    accent: '#3498db',       // Azul acento para hover
    light: '#e8f5e9',        // Verde claro para fondos
    dark: '#2c3e50',         // Texto oscuro
    muted: '#7f8c8d',        // Texto secundario
    white: '#ffffff',
    gradient: 'linear-gradient(135deg, #00791a 0%, #064273 100%)'
  };

  return (
    <motion.div 
      className="relative bg-white rounded-2xl shadow-xl overflow-hidden group cursor-pointer"
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Imagen con overlay gradiente */}
      <div className="relative overflow-hidden">
        <img 
          src={mainImage} 
          alt={name}
          className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/default-image.jpg';
          }}
        />
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
        
        {/* Badge de categoría */}
        <div className="absolute top-4 left-4">
          <span 
            className="inline-block px-3 py-1 text-xs font-bold rounded-full text-white shadow-lg"
            style={{ background: colors.gradient }}
          >
            {category}
          </span>
        </div>
        
        {/* Precio */}
        <div className="absolute top-4 right-4">
          <div 
            className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-sm shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            ${entranceFee || 0}
          </div>
        </div>
        
        {/* Efecto de brillo al hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
      
      {/* Contenido de la tarjeta */}
      <div className="p-6">
        {/* Título */}
        <h3 
          className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-green-700 transition-colors duration-300"
          style={{ color: colors.secondary }}
        >
          {name}
        </h3>
        
        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>
        
        {/* Ubicación */}
        <div className="flex items-center text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{location}</span>
        </div>

        {/* Destacados */}
        {highlights && highlights.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.primary }}>
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Lo más destacado
            </h4>
            <div className="flex flex-wrap gap-2">
              {highlights.slice(0, 3).map((highlight, index) => (
                <span 
                  key={index}
                  className="inline-block px-3 py-1 text-xs rounded-full font-medium transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: colors.light,
                    color: colors.primary,
                    border: `1px solid ${colors.primary}20`
                  }}
                >
                  {highlight}
                </span>
              ))}
              {highlights.length > 3 && (
                <span 
                  className="inline-block px-3 py-1 text-xs rounded-full font-medium"
                  style={{ 
                    backgroundColor: colors.secondary + '20',
                    color: colors.secondary
                  }}
                >
                  +{highlights.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Botón de acción */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <motion.button 
            className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:shadow-lg"
            style={{ background: colors.gradient }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center">
              Ver detalles
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </motion.button>
        </div>
      </div>
      
      {/* Efecto de borde al hover */}
      <div 
        className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ borderColor: colors.primary }}
      />
    </motion.div>
  );
}

export default SiteCard;