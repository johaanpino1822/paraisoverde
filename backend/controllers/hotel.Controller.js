const Hotel = require('../models/Hotel');
const path = require('path');
const fs = require('fs');

// 📁 Ruta a la carpeta uploads (externa al backend)
const uploadsDir = path.join(__dirname, '../../../uploads');

// Crear hotel
const createHotel = async (req, res) => {
  try {
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    const { name, description, location, priceRange, amenities } = req.body;
    
    // ✅ CORREGIDO: Crear objetos según el schema hotelImageSchema
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        console.log('Archivo guardado:', file.filename);
        // Crear objeto según el schema hotelImageSchema
        images.push({
          filename: file.filename,
          originalName: file.originalname,
          path: `/uploads/hotels/${file.filename}`,
          uploadedAt: new Date(),
          isFeatured: images.length === 0 // La primera imagen como destacada
        });
      });
    }

    const hotel = new Hotel({
      name,
      description,
      location,
      priceRange,
      amenities: amenities ? (typeof amenities === 'string' ? JSON.parse(amenities) : amenities) : [],
      images,
      createdBy: req.user.id
    });

    await hotel.save();
    
    // Para la respuesta, usar los métodos del modelo
    const hotelResponse = hotel.toObject();
    
    res.status(201).json(hotelResponse);
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({ message: 'Error al crear el hotel: ' + error.message });
  }
};

// Obtener todos los hoteles
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true })
      .populate('createdBy', 'name email');
    
    // Usar el método del modelo para obtener URLs
    const hotelsWithImageUrls = hotels.map(hotel => {
      const hotelObj = hotel.toObject();
      // Agregar URLs completas usando el método del modelo
      hotelObj.imageUrls = hotel.getAllImageUrls();
      return hotelObj;
    });
    
    res.json(hotelsWithImageUrls);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ message: 'Error al obtener los hoteles' });
  }
};

// Obtener hotel por ID
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }

    const hotelWithImageUrls = hotel.toObject();
    // Agregar URLs completas usando el método del modelo
    hotelWithImageUrls.imageUrls = hotel.getAllImageUrls();
    
    res.json(hotelWithImageUrls);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ message: 'Error al obtener el hotel' });
  }
};

// Actualizar hotel
const updateHotel = async (req, res) => {
  try {
    const { name, description, location, priceRange, amenities, existingImages } = req.body;
    
    // Obtener el hotel existente
    const existingHotel = await Hotel.findById(req.params.id);
    if (!existingHotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }

    // ✅ CORREGIDO: Procesar imágenes existentes como objetos
    let images = [];
    
    // Procesar imágenes existentes
    if (existingImages) {
      const parsedExistingImages = typeof existingImages === 'string' 
        ? JSON.parse(existingImages) 
        : existingImages;
      
      // Reconstruir objetos según el schema
      images = parsedExistingImages.map(img => {
        if (typeof img === 'string') {
          // Si es un string, crear objeto
          return {
            filename: img,
            originalName: img,
            path: `/uploads/hotels/${img}`,
            uploadedAt: new Date(),
            isFeatured: false
          };
        }
        // Si ya es un objeto, mantenerlo
        return img;
      });
    } else {
      images = [...existingHotel.images];
    }

    // Procesar nuevas imágenes
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          filename: file.filename,
          originalName: file.originalname,
          path: `/uploads/hotels/${file.filename}`,
          uploadedAt: new Date(),
          isFeatured: images.length === 0 // Destacar si es la primera
        });
      });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        location,
        priceRange,
        amenities: amenities ? (typeof amenities === 'string' ? JSON.parse(amenities) : amenities) : existingHotel.amenities,
        images,
      },
      { new: true, runValidators: true }
    );

    const hotelResponse = updatedHotel.toObject();
    hotelResponse.imageUrls = updatedHotel.getAllImageUrls();
    
    res.json(hotelResponse);
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ message: 'Error al actualizar el hotel' });
  }
};

// Eliminar hotel (soft delete)
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }

    res.json({ message: 'Hotel eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ message: 'Error al eliminar el hotel' });
  }
};

// Eliminar imagen específica
const deleteHotelImage = async (req, res) => {
  try {
    const { id, imageName } = req.params;
    
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }

    // Usar el método del modelo para eliminar la imagen
    await hotel.removeImage(imageName);

    // Eliminar el archivo físico
    const imagePath = path.join(uploadsDir, 'hotels', imageName);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log('🗑️ Imagen eliminada:', imagePath);
    }

    res.json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error al eliminar la imagen' });
  }
};

module.exports = {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  deleteHotelImage
};