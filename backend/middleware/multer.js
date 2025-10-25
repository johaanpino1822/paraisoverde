const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta ABSOLUTA a tu carpeta uploads independiente
const UPLOADS_BASE_DIR = path.join(__dirname, '..', '..', 'uploads');

// Asegurar que las carpetas existan
const ensureUploadsDir = (folder) => {
  const fullPath = path.join(UPLOADS_BASE_DIR, folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  return fullPath;
};

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'general';
    
    // Determinar la carpeta según el tipo
    if (req.baseUrl.includes('hotels')) {
      folder = 'hotels';
    } else if (req.baseUrl.includes('sites')) {
      folder = 'sites';
    } else if (req.baseUrl.includes('users')) {
      folder = 'users';
    }
    
    const uploadPath = ensureUploadsDir(folder);
    console.log(`📁 Subiendo archivo a: ${uploadPath}`);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Nombre único: timestamp + extensión original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log(`📸 Archivo guardado como: ${filename}`);
    cb(null, filename);
  }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WEBP)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Middleware para manejar errores de Multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB permitido.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Demasiados archivos. Máximo 10 permitidos.'
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

// ✅ EXPORTAR DE FORMA COMPATIBLE CON TODAS LAS RUTAS
module.exports = {
  upload, // Para usar: upload.array(), upload.single(), etc.
  uploadSingle: (fieldName) => upload.single(fieldName), // Compatibilidad
  uploadMultiple: (fieldName, maxCount = 10) => upload.array(fieldName, maxCount), // Compatibilidad
  handleMulterError
};