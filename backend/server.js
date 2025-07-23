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

// Configuración de CORS (Actualizada)
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
  max: 1000, // Límite de peticiones por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde'
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

// Configuración de archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas API
app.use('/api/users', require('./routes/user.Routes'));
app.use('/api/hotels', require('./routes/hotel.Routes'));
app.use('/api/sites', require('./routes/site.Routes'));
app.use('/api/admin', require('./routes/admin.Routes')); // Cambiado para mejor estructura

// Ruta de verificación de salud
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
});

// Middleware de manejo de errores (DEBE SER EL ÚLTIMO)
app.use(errorHandler);

// Configuración del puerto
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en modo ${process.env.NODE_ENV || 'development'} en puerto ${PORT}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error no capturado: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;