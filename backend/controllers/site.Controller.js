// controllers/site.Controller.js
const Site = require('../models/Site');
const path = require('path');
const fs = require('fs');

// Ruta base para uploads
const UPLOADS_BASE_DIR = path.join(__dirname, '..', '..', 'uploads');

// Crear sitio
const createSite = async (req, res) => {
  try {
    const { name, description, location, category, entranceFee, highlights } = req.body;
    
    // Procesar imágenes con estructura completa
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          filename: file.filename,
          originalName: file.originalname,
          path: `/uploads/sites/${file.filename}`,
          uploadedAt: new Date()
        });
      });
    }

    const site = new Site({
      name,
      description,
      location,
      category,
      entranceFee: entranceFee || 0,
      highlights: highlights ? (typeof highlights === 'string' ? highlights.split(',') : highlights) : [],
      images,
      createdBy: req.user.id
    });

    await site.save();
    
    // Respuesta con URLs completas
    const siteResponse = {
      ...site.toObject(),
      images: site.images.map(img => ({
        ...img,
        url: `http://localhost:5000${img.path}`
      }))
    };
    
    res.status(201).json(siteResponse);
  } catch (error) {
    console.error('Error creating site:', error);
    
    // Limpiar archivos subidos si hay error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join(UPLOADS_BASE_DIR, 'sites', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    
    res.status(500).json({ message: 'Error al crear el sitio: ' + error.message });
  }
};

// Obtener todos los sitios
const getSites = async (req, res) => {
  try {
    const sites = await Site.find({ isActive: true })
      .populate('createdBy', 'name email');
    
    // Agregar URLs completas para el frontend
    const sitesWithFullUrls = sites.map(site => ({
      ...site.toObject(),
      images: site.images.map(img => ({
        ...img,
        url: `http://localhost:5000${img.path}`
      }))
    }));
    
    res.json(sitesWithFullUrls);
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ message: 'Error al obtener los sitios' });
  }
};

// Obtener sitio por ID - FUNCIÓN FALTANTE
const getSiteById = async (req, res) => {
  try {
    const site = await Site.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!site) {
      return res.status(404).json({ message: 'Sitio no encontrado' });
    }

    // Agregar URLs completas para las imágenes
    const siteWithFullUrls = {
      ...site.toObject(),
      images: site.images.map(img => ({
        ...img,
        url: `http://localhost:5000${img.path}`
      }))
    };
    
    res.json(siteWithFullUrls);
  } catch (error) {
    console.error('Error fetching site:', error);
    res.status(500).json({ message: 'Error al obtener el sitio' });
  }
};

// Actualizar sitio
const updateSite = async (req, res) => {
  try {
    const { name, description, location, category, entranceFee, highlights } = req.body;
    
    const existingSite = await Site.findById(req.params.id);
    if (!existingSite) {
      return res.status(404).json({ message: 'Sitio no encontrado' });
    }

    // Procesar nuevas imágenes
    let images = [...existingSite.images];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        images.push({
          filename: file.filename,
          originalName: file.originalname,
          path: `/uploads/sites/${file.filename}`,
          uploadedAt: new Date()
        });
      });
    }

    const updatedSite = await Site.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        location,
        category,
        entranceFee: entranceFee || existingSite.entranceFee,
        highlights: highlights ? (typeof highlights === 'string' ? highlights.split(',') : highlights) : existingSite.highlights,
        images,
      },
      { new: true, runValidators: true }
    );

    // Respuesta con URLs completas
    const siteResponse = {
      ...updatedSite.toObject(),
      images: updatedSite.images.map(img => ({
        ...img,
        url: `http://localhost:5000${img.path}`
      }))
    };

    res.json(siteResponse);
  } catch (error) {
    console.error('Error updating site:', error);
    res.status(500).json({ message: 'Error al actualizar el sitio' });
  }
};

// Eliminar sitio (soft delete)
const deleteSite = async (req, res) => {
  try {
    const site = await Site.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!site) {
      return res.status(404).json({ message: 'Sitio no encontrado' });
    }

    res.json({ message: 'Sitio eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting site:', error);
    res.status(500).json({ message: 'Error al eliminar el sitio' });
  }
};

// Eliminar imagen específica
const deleteSiteImage = async (req, res) => {
  try {
    const { id, imageName } = req.params;
    
    const site = await Site.findById(id);
    if (!site) {
      return res.status(404).json({ message: 'Sitio no encontrado' });
    }

    // Encontrar la imagen a eliminar
    const imageToDelete = site.images.find(img => img.filename === imageName);
    if (!imageToDelete) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    // Eliminar la imagen del array
    site.images = site.images.filter(img => img.filename !== imageName);
    await site.save();

    // Eliminar el archivo físico
    const imagePath = path.join(UPLOADS_BASE_DIR, 'sites', imageName);
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
  createSite,
  getSites,
  getSiteById, // ✅ AHORA ESTÁ INCLUIDA
  updateSite,
  deleteSite,
  deleteSiteImage
};