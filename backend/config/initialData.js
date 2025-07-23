const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createInitialData = async () => {
  try {
    // Verificar si existe un superadmin
    const superAdminExists = await User.findOne({ role: 'superadmin' });
    
    if (!superAdminExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.SUPERADMIN_INITIAL_PASSWORD || 'Admin123!', 
        12
      );
      
      await User.create({
        username: 'superadmin',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'superadmin',
        isActive: true,
        emailVerified: true
      });
      
      console.log('Superadmin creado automáticamente');
    }
  } catch (error) {
    console.error('Error creando datos iniciales:', error);
  }
};

module.exports = { createInitialData };