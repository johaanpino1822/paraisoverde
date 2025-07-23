const Site = require('../models/Site');

// Crear un nuevo sitio
exports.createSite = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      category,
      entranceFee,
      highlights
    } = req.body;

    const parsedHighlights = typeof highlights === 'string'
      ? highlights.split(',').map(h => h.trim())
      : [];

    const images = req.files.map(file =>
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    );

    const newSite = new Site({
      name,
      description,
      location,
      category,
      entranceFee: parseFloat(entranceFee),
      highlights: parsedHighlights,
      images
    });

    await newSite.save();
    res.status(201).json(newSite);
  } catch (error) {
    console.error('Error en createSite:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los sitios
exports.getSites = async (req, res) => {
  try {
    const sites = await Site.find();
    res.json(sites);
  } catch (error) {
    console.error('Error en getSites:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener sitio por ID
exports.getSiteById = async (req, res) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ message: 'Sitio no encontrado' });
    }
    res.json(site);
  } catch (error) {
    console.error('Error en getSiteById:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar sitio existente
exports.updateSite = async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      category,
      entranceFee,
      highlights
    } = req.body;

    const parsedHighlights = typeof highlights === 'string'
      ? highlights.split(',').map(h => h.trim())
      : [];

    const images = req.files?.map(file =>
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    ) || [];

    const site = await Site.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ message: 'Sitio no encontrado' });
    }

    site.name = name;
    site.description = description;
    site.location = location;
    site.category = category;
    site.entranceFee = parseFloat(entranceFee);
    site.highlights = parsedHighlights;

    if (images.length > 0) {
      site.images.push(...images); // Agrega nuevas imágenes sin borrar las anteriores
    }

    await site.save();
    res.json(site);
  } catch (error) {
    console.error('Error en updateSite:', error);
    res.status(500).json({ error: error.message });
  }
};
