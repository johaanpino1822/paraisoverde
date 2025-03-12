// auth.js
const bcrypt = require('bcrypt');
const connect = require('./db');

// Función para registrar un usuario
async function registerUser(username, email, password) {
    const db = await connect();
    const usersCollection = db.collection('users');

    // Verificar si el usuario ya existe
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
        throw new Error('El correo ya está registrado');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar el usuario en la base de datos
    const user = {
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(user);
    return result;
}

// Función para iniciar sesión
async function loginUser(email, password) {
    const db = await connect();
    const usersCollection = db.collection('users');

    // Buscar el usuario por email
    const user = await usersCollection.findOne({ email });
    if (!user) {
        throw new Error('Credenciales incorrectas');
    }

    // Comparar la contraseña hasheada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Credenciales incorrectas');
    }

    return user;
}

module.exports = { registerUser, loginUser };