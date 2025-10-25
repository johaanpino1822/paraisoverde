// models/Site.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
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
  }
});

const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
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
    required: [true, 'La ubicación es requerida']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['Naturaleza', 'Cultural', 'Aventura', 'Histórico', 'Gastronómico']
  },
  entranceFee: {
    type: Number,
    default: 0,
    min: [0, 'La tarifa de entrada no puede ser negativa']
  },
  highlights: [{
    type: String,
    trim: true
  }],
  images: [imageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Método para obtener la URL completa de una imagen
siteSchema.methods.getImageUrl = function(imageFilename) {
  const image = this.images.find(img => img.filename === imageFilename);
  return image ? `http://localhost:5000${image.path}` : null;
};

// Método para eliminar una imagen
siteSchema.methods.removeImage = async function(imageFilename) {
  this.images = this.images.filter(img => img.filename !== imageFilename);
  return await this.save();
};

module.exports = mongoose.model('Site', siteSchema);