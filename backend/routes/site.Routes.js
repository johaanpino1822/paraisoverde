const express = require('express');
const {
  createSite,
  getSites,
  getSiteById,
  updateSite,
  deleteSite,
  deleteSiteImage
} = require('../controllers/site.Controller');

// ✅ CORRECTO: Importar el objeto completo y luego desestructurar
const { upload, handleMulterError } = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// 🔓 Ruta pública para mostrar los sitios turísticos al usuario
router.get('/public', getSites);

// 🔐 Rutas protegidas (solo admins pueden crear, editar y ver todo)
// ✅ CORRECTO: Usar upload.array() y handleMulterError
router.post('/', protect, admin, upload.array('images', 10), handleMulterError, createSite);
router.get('/', protect, admin, getSites);
router.get('/:id', protect, admin, getSiteById);
router.put('/:id', protect, admin, upload.array('images', 10), handleMulterError, updateSite);
router.delete('/:id', protect, admin, deleteSite);
router.delete('/:id/images/:imageName', protect, admin, deleteSiteImage);

module.exports = router;