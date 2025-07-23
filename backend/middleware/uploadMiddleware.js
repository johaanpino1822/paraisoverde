const multer = require('multer');

const storage = multer.memoryStorage(); // puedes usar diskStorage si quieres guardar en disco
const upload = multer({ storage });

module.exports = upload;
