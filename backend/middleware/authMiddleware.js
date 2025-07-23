const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Autenticar usuario mediante JWT
// @access  Private
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Verificar si el token existe en los headers
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Opcional: Verificar si el token viene en cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado. Por favor inicie sesión.'
    });
  }

  try {
    // 2. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Obtener usuario del token
    req.user = await User.findById(decoded.id).select('-password -__v -createdAt -updatedAt');
    
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'El usuario asociado a este token ya no existe o está inactivo'
      });
    }

    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(401).json({
      success: false,
      message: 'Sesión inválida o expirada. Por favor inicie sesión nuevamente.',
      error: error.message
    });
  }
});

// @desc    Restringir acceso a administradores
// @access  Private/Admin
const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Usuario no autenticado.'
    });
  }

  if (['admin', 'superadmin'].includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Acceso denegado. Se requieren privilegios de administrador.'
  });
};

// @desc    Restringir acceso a superadministradores
// @access  Private/SuperAdmin
const superAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Usuario no autenticado.'
    });
  }

  if (req.user.role === 'superadmin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Acceso denegado. Se requieren privilegios de superadministrador.'
  });
};

// @desc    Verificar si el usuario es el propietario del recurso o admin
// @access  Private
const ownerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Usuario no autenticado.'
    });
  }

  // Si es admin o superadmin, permitir acceso
  if (['admin', 'superadmin'].includes(req.user.role)) {
    return next();
  }

  // Verificar si el usuario es dueño del recurso
  if (req.params.userId && req.params.userId === req.user._id.toString()) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Acceso denegado. No tienes permisos para esta acción.'
  });
};

module.exports = { 
  protect, 
  admin, 
  superAdmin,
  ownerOrAdmin
};