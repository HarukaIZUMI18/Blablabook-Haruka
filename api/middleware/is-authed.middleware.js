import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  
  // Lit l'en-tête Authorization
  const authHeader = req.headers["authorization"];

  // Extrait le token après "Bearer"
  const token = authHeader && authHeader.split(" ")[1]; 

// Aucun token fourni
  if (!token) {
    return res.status(401).json({ message: "Token requis" });
  }
// Vérifie le token
  jwt.verify(token, process.env.JWT_SECRET , (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
// Ajoute l'ID utilisateur à la requête
    req.userId = user.userId;
    next();
  });
};