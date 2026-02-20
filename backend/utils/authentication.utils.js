import jwt from 'jsonwebtoken';

// Agregamos la palabra 'export' antes de la constante
export const createAccessToken = (user) => {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
        { id: user._id, username: user.username },
        secret,
        { expiresIn: '1h' }
    );
    return token;
}

// Agregamos la palabra 'export' antes de la constante
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};