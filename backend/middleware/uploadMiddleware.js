// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta base para uploads
const UPLOADS_BASE_DIR = path.join(__dirname, '..', '..', 'uploads');

// Crear carpetas organizadas por tipo
const ensureUploadsDir = (folder) => {
  const fullPath = path.join(UPLOADS_BASE_DIR, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Carpeta creada: ${fullPath}`);
  }
  return fullPath;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'general';
    
    // Determinar carpeta según la ruta
    if (req.baseUrl.includes('sites')) {
      folder = 'sites';
    } else if (req.baseUrl.includes('hotels')) {
      folder = 'hotels';
    } else if (req.baseUrl.includes('users')) {
      folder = 'users';
    }
    
    const uploadPath = ensureUploadsDir(folder);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'img-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes. Tipo: ' + file.mimetype), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB permitido.'
      });
    }
  } else if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next();
};

module.exports = { upload, handleMulterError };