/**
 * Middleware de gestion des erreurs pour l'API Express
 */

// Gestionnaire d'erreurs 500 - erreurs serveur internes
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erreur Interne du Serveur',
    message: 'Une erreur est survenue de notre côté.'
  });
};

// Gestionnaire 404 - routes non trouvées
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Non Trouvé',
    message: 'La ressource demandée n\'existe pas.'
  });
};
