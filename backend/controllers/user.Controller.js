const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Registrar nuevo usuario
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'El usuario ya existe' });
  }

  const user = await User.create({ username, email, password });

  if (user) {
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(400).json({ message: 'Datos inválidos de usuario' });
  }
});

// @desc    Autenticar usuario
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Por favor proporcione email y contraseña'
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/users/profile
// @access  Privado
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  });
});

// @desc    Actualizar perfil del usuario
// @route   PUT /api/users/profile
// @access  Privado
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    role: updatedUser.role
  });
});

// @desc    Obtener todos los usuarios
// @route   GET /api/admin/users
// @access  Privado/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Actualizar usuario por ID
// @route   PUT /api/admin/users/:id
// @access  Privado/SuperAdmin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;

  const updatedUser = await user.save();

  res.status(200).json({
    id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    role: updatedUser.role
  });
});

// @desc    Eliminar usuario por ID
// @route   DELETE /api/admin/users/:id
// @access  Privado/SuperAdmin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  await user.remove();

  res.status(200).json({ message: 'Usuario eliminado correctamente' });
});

// @desc    Obtener estadísticas simples
// @route   GET /api/admin/stats
// @access  Privado/Admin
const getStats = asyncHandler(async (req, res) => {
  const total = await User.countDocuments();
  const admins = await User.countDocuments({ role: 'admin' });
  const superAdmins = await User.countDocuments({ role: 'superadmin' });

  res.status(200).json({
    totalUsuarios: total,
    administradores: admins,
    superAdministradores: superAdmins
  });
});

// ✅ Exportar todas las funciones necesarias
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  updateUser,
  deleteUser,
  getStats
};
