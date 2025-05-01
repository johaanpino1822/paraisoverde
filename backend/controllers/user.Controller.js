const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Registro público (usuarios normales)
const registerPublic = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // Crear usuario con rol "user"
        const newUser = new User({
            name,
            email,
            password,
            role: 'user'
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

// Registro solo para Admins/SuperAdmins
const registerByAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!['user', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ message: 'Rol inválido' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const newUser = new User({
            name,
            email,
            password,
            role
        });

        await newUser.save();

        res.status(201).json({ message: `Usuario ${role} registrado exitosamente` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar usuario por admin' });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

module.exports = {
    registerPublic,
    registerByAdmin,
    login
};
