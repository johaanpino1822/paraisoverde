const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 50,
      wtimeoutMS: 2500
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    
    // Inicializar datos esenciales
    await initializeEssentialData();
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

const initializeEssentialData = async () => {
  try {
    const User = require('../models/User');

    console.log('🔄 INICIANDO CONFIGURACIÓN DE BASE DE DATOS...');
    
    const superAdminEmail = process.env.SUPERADMIN_INITIAL_EMAIL || 'superadmin@paraisoverde.com';
    const superAdminPassword = process.env.SUPERADMIN_INITIAL_PASSWORD || 'AdminParaiso123!';
    
    // Verificar si ya existe el superadmin
    const superAdminExists = await User.findOne({ 
      $or: [
        { email: superAdminEmail },
        { username: 'superadmin' }
      ] 
    });
    
    if (!superAdminExists) {
      // Crear nuevo superadmin
      const newSuperAdmin = new User({
        username: process.env.SUPERADMIN_INITIAL_USERNAME || 'superadmin',
        email: superAdminEmail,
        password: superAdminPassword,
        role: 'superadmin',
        isVerified: true
      });

      await newSuperAdmin.save();
      console.log(`✅ SUPERADMIN CREADO: ${superAdminEmail}`);
      console.log(`🔑 Contraseña: ${superAdminPassword}`);
    } else {
      console.log('✅ Superadmin ya existe en la base de datos');
      console.log(`📧 Email: ${superAdminExists.email}`);
      console.log(`👤 Username: ${superAdminExists.username}`);
      console.log(`🎯 Role: ${superAdminExists.role}`);
    }

    // Contar usuarios totales
    const userCount = await User.countDocuments();
    console.log(`👥 Total de usuarios en la base de datos: ${userCount}`);

    console.log('🎉 Configuración de base de datos completada');

  } catch (err) {
    console.error(`⚠️ Error en inicialización de datos: ${err.message}`);
  }
};

module.exports = connectDB;