import { StatusCodes } from "http-status-codes";
import Joi from "joi";

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
  },
  validatePagination(req, res, next) {
    const schemaPagination = Joi.object({
      page: Joi.number().integer().min(1).optional(),
      limit: Joi.number().integer().max(100).optional(),
    });
    const { error, value } = schemaPagination.validate(req.query);

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Paramètres de requête invalides",
      });
    }
    if (value.page) req.query.page = value.page;
    if (value.limit) req.query.limit = value.limit;
    next();
  },
};
