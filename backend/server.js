require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Conexión a la base de datos
connectDB();

// Configuración de CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://paraisoverde.vercel.app',
    'https://www.paraisoverde.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP'
  }
});

const app = express();

// Middlewares de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net', 'fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
      connectSrc: ["'self'", 'https://api.mapbox.com', 'https://events.mapbox.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors(corsOptions));
app.use(limiter);
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Archivos estáticos
const uploadsDir = path.join(__dirname, '../uploads');
console.log('🖼️ Sirviendo archivos estáticos desde:', uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// ======================================
// RUTAS DE DEBUG Y ADMINISTRACIÓN
// ======================================

app.get('/api/debug/database-info', async (req, res) => {
  try {
    const User = require('./models/User');
    const mongoose = require('mongoose');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const users = await User.find({});
    
    res.json({
      database: {
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        collections: collections.map(c => c.name)
      },
      users: users.map(u => ({
        id: u._id,
        username: u.username,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/debug/users', async (req, res) => {
  try {
    const User = require('./models/User');
    const users = await User.find({});
    
    console.log('👥 Usuarios en la base de datos:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.username}`);
    });
    
    res.json({
      total: users.length,
      users: users.map(u => ({ 
        id: u._id, 
        email: u.email, 
        role: u.role,
        username: u.username,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/debug/clean-database', async (req, res) => {
  try {
    const User = require('./models/User');
    
    // Eliminar todos los usuarios excepto superadmin si existe
    await User.deleteMany({ 
      email: { $ne: 'superadmin@paraisoverde.com' } 
    });
    console.log('🗑️ Usuarios no esenciales eliminados');
    
    // Verificar o crear superadmin
    let superadmin = await User.findOne({ email: 'superadmin@paraisoverde.com' });
    
    if (!superadmin) {
      superadmin = new User({
        username: 'superadmin',
        email: 'superadmin@paraisoverde.com',
        password: 'AdminParaiso123!',
        role: 'superadmin',
        isVerified: true
      });
      await superadmin.save();
      console.log('✅ Nuevo superadmin creado');
    } else {
      console.log('✅ Superadmin ya existe');
    }
    
    res.json({
      success: true,
      message: 'Base de datos limpiada exitosamente',
      superadmin: {
        email: 'superadmin@paraisoverde.com',
        password: 'AdminParaiso123!'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/debug/reset-superadmin', async (req, res) => {
  try {
    const User = require('./models/User');
    
    // Buscar y actualizar o crear superadmin
    let superadmin = await User.findOne({ username: 'superadmin' });
    
    if (superadmin) {
      // Actualizar contraseña
      superadmin.password = 'AdminParaiso123!';
      superadmin.email = 'superadmin@paraisoverde.com';
      await superadmin.save();
      console.log('✅ Superadmin actualizado');
    } else {
      // Crear nuevo superadmin
      superadmin = new User({
        username: 'superadmin',
        email: 'superadmin@paraisoverde.com',
        password: 'AdminParaiso123!',
        role: 'superadmin',
        isVerified: true
      });
      await superadmin.save();
      console.log('✅ Nuevo superadmin creado');
    }

    res.json({ 
      success: true, 
      message: 'Superadmin configurado correctamente',
      credentials: {
        email: 'superadmin@paraisoverde.com',
        password: 'AdminParaiso123!'
      }
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Ruta GET fácil para resetear superadmin
app.get('/api/debug/fix-admin', async (req, res) => {
  try {
    const User = require('./models/User');
    
    let superadmin = await User.findOne({ username: 'superadmin' });
    
    if (superadmin) {
      superadmin.password = 'AdminParaiso123!';
      superadmin.email = 'superadmin@paraisoverde.com';
      await superadmin.save();
    } else {
      superadmin = new User({
        username: 'superadmin',
        email: 'superadmin@paraisoverde.com',
        password: 'AdminParaiso123!',
        role: 'superadmin',
        isVerified: true
      });
      await superadmin.save();
    }

    res.json({ 
      success: true, 
      message: '✅ SUPERADMIN CONFIGURADO CORRECTAMENTE',
      instructions: 'Ahora puedes iniciar sesión con:',
      credentials: {
        email: 'superadmin@paraisoverde.com',
        password: 'AdminParaiso123!'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================================
// RUTAS PRINCIPALES DE LA APLICACIÓN
// ======================================

app.use('/api/users', require('./routes/user.Routes'));
app.use('/api/hotels', require('./routes/hotel.Routes'));
app.use('/api/sites', require('./routes/site.Routes'));
app.use('/api/admin', require('./routes/admin.Routes'));

// Ruta de verificación de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor Paraíso Verde funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Ruta de inicio
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenido a la API de Paraíso Verde',
    endpoints: {
      auth: '/api/users',
      hotels: '/api/hotels',
      sites: '/api/sites',
      admin: '/api/admin',
      debug: '/api/debug',
      health: '/api/health'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Configuración del puerto
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🎉 SERVIDOR PARAÍSO VERDE INICIADO`);
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📁 Uploads: ${uploadsDir}`);
  console.log(`\n🔧 Rutas de administración:`);
  console.log(`   GET  /api/debug/database-info - Información de la BD`);
  console.log(`   GET  /api/debug/users - Ver todos los usuarios`);
  console.log(`   GET  /api/debug/clean-database - Limpiar base de datos`);
  console.log(`   GET  /api/debug/fix-admin - Configurar superadmin`);
  console.log(`   POST /api/debug/reset-superadmin - Resetear superadmin`);
  console.log(`\n🚀 Rutas principales:`);
  console.log(`   POST /api/users/login - Iniciar sesión`);
  console.log(`   POST /api/users/register - Registrarse`);
  console.log(`   GET  /api/health - Estado del servidor\n`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Error no capturado: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;