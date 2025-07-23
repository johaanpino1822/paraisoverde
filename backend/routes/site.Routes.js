const express = require('express');
const {
  createSite,
  getSites,
  getSiteById,
  updateSite
} = require('../controllers/site.Controller');

const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// 🔓 Ruta pública para mostrar los sitios turísticos al usuario
router.get('/public', getSites);

// 🔐 Rutas protegidas (solo admins pueden crear, editar y ver todo)
router.post('/', protect, admin, upload.array('images'), createSite);
router.get('/', protect, admin, getSites);
router.get('/:id', protect, admin, getSiteById);
router.put('/:id', protect, admin, upload.array('images'), updateSite);

module.exports = router;
