// utils/imageHelper.js
const getImageUrl = (imageName, folder = 'hotels') => {
  if (!imageName) return '/default-image.jpg';
  
  // Si ya es una URL completa
  if (imageName.startsWith('http')) {
    return imageName;
  }
  
  // Para desarrollo - desde la carpeta uploads
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:5000/uploads/${folder}/${imageName}`;
  }
  
  // Para producción - desde tu dominio
  return `https://tudominio.com/uploads/${folder}/${imageName}`;
};

module.exports = { getImageUrl };