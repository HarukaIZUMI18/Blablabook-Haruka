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
      order: Joi.string().valid("A-Z", "Z-A").optional().default("A-Z"),
    });
    const { error, value } = schemaPagination.validate(req.query);

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Paramètres de requête invalides",
      });
    }
    req.query.page = value.page;
    req.query.limit = value.limit;
    req.query.order = value.order;
    next();
  },
};
