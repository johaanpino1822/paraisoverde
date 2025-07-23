const express = require('express');
const router = express.Router();

// ✅ Correcta importación del controlador
const {
  getUsers,
  updateUser,
  deleteUser,
  getStats
} = require('../controllers/user.controller');

// ✅ Middleware de autenticación y roles
const { protect, admin, superAdmin } = require('../middleware/authMiddleware');

// ✅ Rutas definidas correctamente con sus respectivos middlewares
router.get('/users', protect, admin, getUsers);              // GET /api/admin/users
router.get('/stats', protect, admin, getStats);              // GET /api/admin/stats
router.put('/users/:id', protect, superAdmin, updateUser);   // PUT /api/admin/users/:id
router.delete('/users/:id', protect, superAdmin, deleteUser); // DELETE /api/admin/users/:id

module.exports = router;
