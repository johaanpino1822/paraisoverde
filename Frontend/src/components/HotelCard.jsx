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
  const [imgError, setImgError] = useState(false);
  const [currentImage, setCurrentImage] = useState("/img/default.jpg");

  // Paleta de colores basada en SiteCard
  const colors = {
    primary: '#00791a',      // Verde principal
    secondary: '#064273',    // Azul secundario
    accent: '#3498db',       // Azul acento para hover
    light: '#e8f5e9',        // Verde claro para fondos
    dark: '#2c3e50',         // Texto oscuro
    muted: '#7f8c8d',        // Texto secundario
    white: '#ffffff',
    gradient: 'linear-gradient(135deg, #00791a 0%, #064273 100%)',
    gradientHover: 'linear-gradient(135deg, #009922 0%, #085a9c 100%)'
  };

  // ✅ CORRECCIÓN: Función para normalizar URLs de imágenes
  const normalizeImageUrl = (imgUrl) => {
    if (!imgUrl) return "/img/default.jpg";
    
    if (typeof imgUrl !== 'string' || imgUrl.trim() === '') {
      return "/img/default.jpg";
    }
    
    if (imgUrl.includes('/uploads/hotels//uploads/')) {
      const corrected = imgUrl.replace('/uploads/hotels//uploads/', '/uploads/hotels/');
      console.log(`✅ URL corregida para ${name}:`, corrected);
      return corrected;
    }
    
    if (!imgUrl.startsWith('http') && !imgUrl.startsWith('/') && !imgUrl.startsWith('uploads/')) {
      return `/uploads/hotels/${imgUrl}`;
    }
    
    if (imgUrl.startsWith('/uploads/hotels/')) {
      return imgUrl;
    }
    
    if (imgUrl.startsWith('http')) {
      return imgUrl;
    }
    
    return imgUrl;
  };

  // Debug de la imagen recibida
  useEffect(() => {
    console.log(`🏨 HotelCard "${name}" recibió imagen:`, image);
    
    const normalizedImage = normalizeImageUrl(image);
    console.log(`🔄 Imagen normalizada para "${name}":`, normalizedImage);
    
    setCurrentImage(normalizedImage);
    setImgError(false);
  }, [image, name]);

  const handleFavorite = (e) => {
    e.stopProplection();
    setIsFavorite(!isFavorite);
  };

  // Manejar error de imagen
  const handleImageError = (e) => {
    console.error(`❌ Error cargando imagen para "${name}":`, currentImage);
    setImgError(true);
    setCurrentImage("/img/default.jpg");
  };

  // Verificar si la imagen se carga correctamente
  const handleImageLoad = (e) => {
    console.log(`✅ Imagen cargada correctamente para "${name}":`, currentImage);
    setImgError(false);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen con overlay gradiente */}
      <div className="relative overflow-hidden h-64">
        {imgError ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-sm">Imagen no disponible</p>
            </div>
          </div>
        ) : (
          <motion.img
            key={currentImage}
            src={currentImage}
            alt={name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
        
        {/* Etiquetas superiores */}
        <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
          {exclusive && (
            <span 
              className="inline-block px-3 py-1 text-xs font-bold rounded-full text-white shadow-lg"
              style={{ background: colors.gradient }}
            >
              EXCLUSIVO
            </span>
          )}
          {discount && (
            <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Botón de favoritos */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleFavorite}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-all shadow-lg ${
            isFavorite 
              ? 'bg-gradient-to-br from-red-500 to-pink-600 text-white' 
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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

        {/* Rating */}
        {rating && (
          <div className="absolute bottom-4 left-4 flex items-center bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
            <svg className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-white">{rating}</span>
          </div>
        )}

        {/* Efecto de brillo al hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
      
      {/* Contenido de la tarjeta */}
      <div className="p-6">
        {/* Título */}
        <h3 
          className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-green-700 transition-colors duration-300"
          style={{ color: colors.secondary }}
        >
          {name}
        </h3>

        {/* Ubicación */}
        <div className="flex items-center text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">{location}</span>
        </div>

        {/* Amenities */}
        {amenities && amenities.length > 0 && (
          <div className="mb-5">
            <h4 className="text-sm font-semibold mb-2 flex items-center" style={{ color: colors.dark }}>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.primary }}>
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Comodidades
            </h4>
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index}
                  className="inline-block px-3 py-1 text-xs rounded-full font-medium transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: colors.light,
                    color: colors.primary,
                    border: `1px solid ${colors.primary}20`
                  }}
                >
                  {amenity}
                </span>
              ))}
              {amenities.length > 3 && (
                <span 
                  className="inline-block px-3 py-1 text-xs rounded-full font-medium"
                  style={{ 
                    backgroundColor: colors.secondary + '20',
                    color: colors.secondary
                  }}
                >
                  +{amenities.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Precio y botón */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            {originalPrice && (
              <p className="text-xs text-gray-500 line-through">${originalPrice}</p>
            )}
            <p className="text-xs text-gray-500 mb-1">Desde</p>
            <div className="flex items-end">
              <p 
                className="text-2xl font-bold"
                style={{ 
                  background: colors.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {price}
              </p>
              <span className="text-sm text-gray-500 ml-1">/noche</span>
            </div>
          </div>
          
          <motion.button 
            className="py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:shadow-lg flex items-center gap-2"
            style={{ background: colors.gradient }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Reservar</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
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

export default HotelCard;