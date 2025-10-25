// models/Hotel.js
const mongoose = require('mongoose');

const hotelImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
});

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del hotel es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [1000, 'La descripción no puede tener más de 1000 caracteres']
  },
  location: {
    type: String,
    required: [true, 'La ubicación es requerida'],
    trim: true
  },
  priceRange: {
    type: String,
    required: [true, 'El rango de precios es requerido'],
    enum: {
      values: ['$', '$$', '$$$', '$$$$'],
      message: 'El rango de precios debe ser: $, $$, $$$ o $$$$'
    },
    default: '$$'
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [hotelImageSchema],
  category: {
    type: String,
    enum: ['Económico', 'Moderado', 'Lujoso', 'Boutique', 'Ecológico', 'Familiar'],
    default: 'Moderado'
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  contactPhone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: [1, 'La calificación mínima es 1'],
    max: [5, 'La calificación máxima es 5'],
    default: 4
  },
  roomCount: {
    type: Number,
    min: [1, 'El hotel debe tener al menos 1 habitación'],
    default: 10
  }
}, {
  timestamps: true
});

// Índices para mejor rendimiento en búsquedas
hotelSchema.index({ name: 'text', description: 'text', location: 'text' });
hotelSchema.index({ priceRange: 1 });
hotelSchema.index({ category: 1 });
hotelSchema.index({ featured: -1 });
hotelSchema.index({ isActive: 1 });

// Método para obtener la URL completa de una imagen
hotelSchema.methods.getImageUrl = function(imageFilename) {
  const image = this.images.find(img => img.filename === imageFilename);
  return image ? `${process.env.BASE_URL || 'http://localhost:5000'}${image.path}` : null;
};

// Método para obtener todas las URLs de imágenes
hotelSchema.methods.getAllImageUrls = function() {
  return this.images.map(img => ({
    url: `${process.env.BASE_URL || 'http://localhost:5000'}${img.path}`,
    filename: img.filename,
    originalName: img.originalName,
    isFeatured: img.isFeatured
  }));
};

// Método para obtener la imagen destacada
hotelSchema.methods.getFeaturedImage = function() {
  const featuredImage = this.images.find(img => img.isFeatured);
  if (featuredImage) {
    return `${process.env.BASE_URL || 'http://localhost:5000'}${featuredImage.path}`;
  }
  // Si no hay imagen destacada, retornar la primera imagen
  return this.images.length > 0 ? 
    `${process.env.BASE_URL || 'http://localhost:5000'}${this.images[0].path}` : null;
};

// Método para eliminar una imagen
hotelSchema.methods.removeImage = async function(imageFilename) {
  this.images = this.images.filter(img => img.filename !== imageFilename);
  return await this.save();
};

// Método para marcar una imagen como destacada
hotelSchema.methods.setFeaturedImage = async function(imageFilename) {
  // Primero, quitar el featured de todas las imágenes
  this.images.forEach(img => {
    img.isFeatured = img.filename === imageFilename;
  });
  return await this.save();
};

// Método virtual para obtener el precio promedio basado en el rango
hotelSchema.virtual('averagePrice').get(function() {
  const priceRanges = {
    '$': { min: 50000, max: 100000 },
    '$$': { min: 100000, max: 200000 },
    '$$$': { min: 200000, max: 400000 },
    '$$$$': { min: 400000, max: 1000000 }
  };
  
  const range = priceRanges[this.priceRange];
  return range ? Math.round((range.min + range.max) / 2) : 0;
});

// Método para agregar una nueva imagen
hotelSchema.methods.addImage = async function(imageData) {
  this.images.push(imageData);
  return await this.save();
};

// Middleware para limpiar amenities antes de guardar
hotelSchema.pre('save', function(next) {
  if (this.amenities && Array.isArray(this.amenities)) {
    this.amenities = this.amenities.map(amenity => amenity.trim());
  }
  next();
});

// Método estático para encontrar hoteles activos
hotelSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

// Método estático para encontrar hoteles destacados
hotelSchema.statics.findFeatured = function() {
  return this.find({ featured: true, isActive: true });
};

// Método estático para buscar hoteles por ubicación
hotelSchema.statics.findByLocation = function(location) {
  return this.find({ 
    location: new RegExp(location, 'i'), 
    isActive: true 
  });
};

// Método estático para buscar hoteles por rango de precios
hotelSchema.statics.findByPriceRange = function(priceRange) {
  return this.find({ 
    priceRange: priceRange, 
    isActive: true 
  });
};

// Transformación para JSON para incluir virtuals y limpiar datos
hotelSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Hotel', hotelSchema);