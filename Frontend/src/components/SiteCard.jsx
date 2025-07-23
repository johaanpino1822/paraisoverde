import { useState } from 'react';
import { FiMapPin, FiStar, FiBookmark, FiShare2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SiteCard = ({ 
  name, 
  location, 
  category, 
  entranceFee, 
  originalFee,
  image, 
  highlights,
  rating,
  isPremium = false,
  isExclusive = false,
  isTrending = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images] = useState([
    image || "/img/default.jpg",
    "https://source.unsplash.com/random/800x600/?tourist,attraction",
    "https://source.unsplash.com/random/800x600/?landmark,view"
  ]);

  const handleSwipe = (direction) => {
    if (direction === 'left') {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div 
      className={`relative max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 text-white border border-gray-700/50 shadow-xl transition-shadow duration-300 ${
        isHovered ? 'shadow-2xl' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges de estado premium */}
      <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
        {isExclusive && (
          <span className="flex items-center bg-gradient-to-r from-amber-400 to-amber-600 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            <FiStar className="mr-1" /> EXCLUSIVO
          </span>
        )}
        {isTrending && (
          <span className="flex items-center bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            🔥 TRENDING
          </span>
        )}
        {isPremium && (
          <span className="flex items-center bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            ⭐ PREMIUM
          </span>
        )}
      </div>

      {/* Barra de acciones */}
      <div className={`absolute top-4 right-4 z-20 flex flex-col space-y-2 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-70'
      }`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          className={`p-2 rounded-full backdrop-blur-md ${
            isSaved 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
              : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/90'
          } shadow-md`}
        >
          <FiBookmark className="h-4 w-4" />
        </button>
        
        <button
          className="p-2 rounded-full backdrop-blur-md bg-gray-800/80 text-gray-300 hover:bg-gray-700/90 shadow-md"
          onClick={(e) => e.stopPropagation()}
        >
          <FiShare2 className="h-4 w-4" />
        </button>
      </div>

      {/* Galería de imágenes */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent ${
          isHovered ? 'opacity-100' : 'opacity-90'
        }`}></div>

        {/* Navegación de imágenes */}
        {images.length > 1 && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSwipe('right');
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSwipe('left');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Indicadores de imagen */}
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
            />
          ))}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-white truncate">
            {name}
          </h3>
          
          {rating && (
            <div className="flex items-center bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              <FiStar className="text-amber-400" />
              <span className="ml-1 text-sm font-semibold text-white">{rating}</span>
            </div>
          )}
        </div>

        {/* Ubicación y categoría */}
        <div className="flex items-center text-gray-300 mb-4">
          <FiMapPin className="text-blue-400 mr-2" />
          <p className="text-sm">
            {location} <span className="mx-1 text-gray-500">•</span> 
            <span className="font-medium text-gray-100">{category}</span>
          </p>
        </div>

        {/* Highlights */}
        <div className="mb-5 overflow-x-auto pb-3 scrollbar-hide">
          <div className="flex space-x-3">
            {highlights?.map((h, i) => (
              <span
                key={i}
                className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-xs font-medium text-white"
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Precio y CTA */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <div>
            {originalFee && (
              <p className="text-xs text-gray-400 line-through">${originalFee}</p>
            )}
            <div className="flex items-baseline">
              <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                ${entranceFee}
              </p>
              <span className="text-xs text-gray-400 ml-1">entrada</span>
            </div>
          </div>
          
          <button
            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center space-x-2 hover:shadow-lg"
          >
            <span>Reservar Tour</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
          </button>
        </div>
      </div>

      {/* Efecto de hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none border-2 border-white/10 rounded-3xl"></div>
      )}
    </div>
  );
};

export default SiteCard;