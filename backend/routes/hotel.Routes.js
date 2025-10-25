const express = require('express');
const {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  deleteHotelImage
} = require('../controllers/hotel.Controller');

// ✅ CORRECTO: Importar el objeto completo y luego desestructurar
const { upload, handleMulterError } = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// 🔓 Rutas públicas
router.get('/public', getHotels);

// 🔐 Rutas protegidas por autenticación y rol de admin
router.get('/', protect, admin, getHotels);
router.get('/:id', protect, admin, getHotelById);
router.post('/', protect, admin, upload.array('images', 10), handleMulterError, createHotel);
router.put('/:id', protect, admin, upload.array('images', 10), handleMulterError, updateHotel);
router.delete('/:id', protect, admin, deleteHotel);
router.delete('/:id/images/:imageName', protect, admin, deleteHotelImage);

module.exports = router;