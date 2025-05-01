const express = require('express');
const { registerPublic, registerByAdmin, login } = require('../controllers/userController');
const { verifyToken, isAdminOrSuperadmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Registro público
router.post('/register', registerPublic);

// Registro por admin o superadmin
router.post('/admin/register', verifyToken, isAdminOrSuperadmin, registerByAdmin);

// Login
router.post('/login', login);

module.exports = router;
