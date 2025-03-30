const mongoose = require('mongoose'); // Asegúrate de importar mongoose

const SiteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    image: { type: String } // URL de la imagen del sitio
}, { timestamps: true });

const Site = mongoose.model('Site', SiteSchema);
module.exports = Site;
