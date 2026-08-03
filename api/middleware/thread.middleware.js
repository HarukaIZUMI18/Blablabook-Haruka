import { StatusCodes } from "http-status-codes";

export const threadMiddleware = {
    validateId(req, res, next){
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)){
            return res.status(StatusCodes.BAD_REQUEST).json({erreur: "ID invalide"});
        }
        next();
    },
    validateCreate(req, res, next) {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erreur: "title et body sont requis" });
    }
    next();
  },

  validateComment(req, res, next) {
    if (!req.body.body) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erreur: "body est requis" });
    }
    next();
  },
  validateCommentId(req, res, next) {
    const id = parseInt(req.params.commentId, 10);
    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erreur: "ID de commentaire invalide" });
    }
    next();
  },
}