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
    if(!title.trim().length < 5) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erreur: "Le title doit contenir au moins 5 caractères" });
    }
    if(!title.trim().length < 20) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erreur: "Le commentaire contenir au moins 20 caractères" });
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

  validateUpdate(req, res, next) {
    const { title, body } = req.body;
    if (!title && !body) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erreur: "title ou body est requis" });
    }
    if (title !== undefined && !title.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erreur: "Le title ne peut pas être vide" });
    }
       if(!title.trim().length < 5) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erreur: "Le title doit contenir au moins 5 caractères" });
    }
    if (body !== undefined && !body.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erreur: "body ne peut pas être vide" });
    }
    if(!title.trim().length < 10) {
      return res.status(StatusCodes.BAD_REQUEST).json({ erreur: "Le commentaire contenir au moins 10 caractères" });
    }
    next();
  },
}