import { StatusCodes } from "http-status-codes";

export const bookMiddleware = {
  validateSearchQuery(req, res, next) {
    const search = req.query.q;
    if (!search || search.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Le paramètre de recherche 'q' est obligatoire.",
      });
    }
    next();
  },
  validateId(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "L'identifiant doit être un nombre valide.",
      });
    }
    next();
  }
};