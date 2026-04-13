import jwt from 'jsonwebtoken';


export const createAccessToken = (user) => {
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        secret,
        { expiresIn: '3h' }
    );
    return token;
}


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