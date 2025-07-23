const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Site = require('../models/Site');
const asyncHandler = require('express-async-handler');

// @desc    Obtener todos los usuarios
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Actualizar usuario
// @route   PUT /api/admin/users/:id
// @access  Private/SuperAdmin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Eliminar usuario
// @route   DELETE /api/admin/users/:id
// @access  Private/SuperAdmin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Obtener estadísticas del sistema
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  try {
    const [users, hotels, sites] = await Promise.all([
      User.countDocuments(),
      Hotel.countDocuments({ isActive: true }),
      Site.countDocuments({ isActive: true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        hotels,
        sites
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

module.exports = {
  getUsers,
  updateUser,
  deleteUser,
  getStats
};