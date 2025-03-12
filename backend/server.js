// server.js
const express = require('express');
const cors = require('cors');
const { registerUser, loginUser } = require('./auth');

const app = express();
const port = 5000; // Puerto para el servidor

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Para parsear JSON en las solicitudes

// Ruta para registrar un usuario
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const result = await registerUser(username, email, password);
        res.status(201).json({ message: 'Usuario registrado', userId: result.insertedId });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await loginUser(email, password);
        res.status(200).json({ message: 'Inicio de sesión exitoso', user });
    } catch (e) {
        res.status(401).json({ message: e.message });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});