// db.js
const { MongoClient } = require('mongodb');

// URI de conexión a MongoDB (local o en la nube)
const uri = 'mongodb://localhost:27017'; // Cambia esto si usas MongoDB Atlas

// Crear una instancia de MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Función para conectar a la base de datos
async function connect() {
    try {
        await client.connect();
        console.log('Conectado a MongoDB');
        return client.db('turismo_db'); // Selecciona la base de datos
    } catch (e) {
        console.error('Error al conectar a MongoDB', e);
    }
}

module.exports = connect;