import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Asignar el userId o id al objeto de la solicitud
    req.user = decoded; // Ahora req.user tendrá el userId del token

    console.log("Decoded token:", decoded); // Para verificar el contenido del token

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed, invalid token.' });
  }
};
  