const express = require('express');
const router = express.Router();
const {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel
} = require('../controllers/hotel.controller');

const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');

// 📦 Almacenamiento en memoria (imágenes se codifican en base64 en el controlador)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔓 Ruta pública para obtener los hoteles sin autenticación
router.get('/public', getHotels); // Esta es la nueva ruta pública

// 🔐 Rutas protegidas por autenticación y rol de admin
router.get('/', protect, admin, getHotels);             // Obtener todos los hoteles (admin)
router.get('/:id', protect, admin, getHotelById);       // Obtener hotel por ID (admin)
router.post('/', protect, admin, upload.array('images'), createHotel); // Crear hotel
router.put('/:id', protect, admin, upload.array('images'), updateHotel); // Actualizar hotel

module.exports = router;
