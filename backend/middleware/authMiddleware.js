const jwt = require('jsonwebtoken');

// Verificar token de autenticación
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, autorización denegada' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Guardamos el usuario decodificado en la request
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token no válido' });
    }
};

// Verificar que sea Admin o SuperAdmin
const isAdminOrSuperadmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado: Solo Admins o SuperAdmins' });
    }
};

module.exports = {
    verifyToken,
    isAdminOrSuperadmin
};
