const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const connectDB = async () => {
  try {
    // Configuración optimizada de conexión a MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 50,
      wtimeoutMS: 2500
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Verificar e inicializar datos esenciales
    await initializeEssentialData();
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

const initializeEssentialData = async () => {
  try {
    const User = require('../models/User');
    const Role = require('../models/Role'); // Asumiendo que tienes un modelo de roles

    // 1. Crear roles del sistema si no existen
    const roles = ['superadmin', 'admin', 'user', 'guest'];
    for (const roleName of roles) {
      await Role.findOneAndUpdate(
        { name: roleName },
        { name: roleName, permissions: getDefaultPermissions(roleName) },
        { upsert: true, new: true }
      );
    }
    console.log('🔄 Roles del sistema verificados/creados');

    // 2. Crear superadmin inicial (solo si no existe)
    const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@example.com';
    const superAdminExists = await User.findOne({ email: superAdminEmail });
    
    if (!superAdminExists) {
      const tempPassword = process.env.SUPERADMIN_INITIAL_PASSWORD || uuidv4();
      const hashedPassword = await bcrypt.hash(tempPassword, 12);
      
      const superAdmin = new User({
        username: 'superadmin',
        email: superAdminEmail,
        password: hashedPassword,
        role: 'superadmin',
        isVerified: true,
        apiKey: uuidv4()
      });

      await superAdmin.save();
      
      // IMPORTANTE: Mostrar la contraseña solo en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔑 Superadmin creado - Contraseña temporal: ${tempPassword}`);
      } else {
        console.log('🔑 Superadmin creado - Verifica el correo para la contraseña');
      }
    }

    // 3. Otras inicializaciones necesarias...
    await initializeDefaultSettings();

  } catch (err) {
    console.error(`⚠️ Error en inicialización de datos: ${err.message}`);
  }
};

// Función para permisos por defecto (extensible)
const getDefaultPermissions = (role) => {
  const permissions = {
    superadmin: ['*'],
    admin: ['users:read', 'users:write', 'content:manage'],
    user: ['profile:manage', 'content:create'],
    guest: ['content:read']
  };
  return permissions[role] || [];
};

// Función para configuraciones iniciales
const initializeDefaultSettings = async () => {
  const Setting = require('../models/Setting');
  const defaultSettings = [
    { key: 'siteName', value: 'Paraíso Verde', isPublic: true },
    { key: 'maintenanceMode', value: false, isPublic: true },
    { key: 'maxLoginAttempts', value: 5, isPublic: false }
  ];

  for (const setting of defaultSettings) {
    await Setting.findOneAndUpdate(
      { key: setting.key },
      setting,
      { upsert: true }
    );
  }
  console.log('⚙️ Configuraciones por defecto inicializadas');
};

module.exports = connectDB;