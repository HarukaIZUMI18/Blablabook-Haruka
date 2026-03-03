import Joi from "joi";
import { Collect, Book } from "../models/index.js";
import { StatusCodes } from "http-status-codes";

// Statuts valides pour la collection (selon spec)
const VALID_STATUSES = ["à lire", "en cours", "lu", "abandonné", "en pause"];

// Schéma de validation pour la mise à jour du statut
const statusSchema = Joi.object({
  status: Joi.string().valid(...VALID_STATUSES).required(),
});

export const collectController = {
  // GET /collection - Récupérer tous les livres de la collection
  async all(req, res) {
    try {
      const userId = req.userId;
      const { status } = req.query;

      const options = {
        where: { user_id: userId },
        include: [
          {
            model: Book,
            attributes: ["id", "title", "author", "cover", "publish_year"],
          },
        ],
        order: [[{ model: Book }, "title", "ASC"]],
      };

      // Filtre optionnel par statut
      if (status && VALID_STATUSES.includes(status)) {
        options.where.status = status;
      }

      const collection = await Collect.findAll(options);

      const books = collection.map((item) => ({
        id: item.book.id,
        title: item.book.title,
        author: item.book.author,
        cover: item.book.cover,
        publish_year: item.book.publish_year,
        collectStatus: item.status,
      }));

      res.status(StatusCodes.OK).json({ books });
    } catch (error) {
      console.error("Erreur lors de la récupération de la collection:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de la récupération de la collection",
      });
    }
  },

  // POST /book/:id/collection - Ajouter un livre à la collection
  async add(req, res) {
    try {
      const userId = req.userId;
      // bookId vient de l'URL (route : /book/:id/collection)
      const bookId = parseInt(req.params.id, 10);

      if (isNaN(bookId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "L'identifiant du livre est invalide",
        });
      }

      // Statut optionnel dans le body
      const { status } = req.body;
      if (status && !VALID_STATUSES.includes(status)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Statut invalide. Valeurs acceptées : ${VALID_STATUSES.join(", ")}`,
        });
      }

      // Vérifier que le livre existe
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Livre non trouvé",
        });
      }

      // Vérifier que le livre n'est pas déjà dans la collection
      const existing = await Collect.findOne({
        where: { user_id: userId, book_id: bookId },
      });

      if (existing) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "Ce livre est déjà dans votre collection",
        });
      }

      const finalStatus = status || "à lire";

      await Collect.create({
        user_id: userId,
        book_id: bookId,
        status: finalStatus,
      });

      res.status(StatusCodes.CREATED).json({
        message: "Livre ajouté à la collection",
        bookId,
        status: finalStatus,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout à la collection:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de l'ajout à la collection",
      });
    }
  },

  // PATCH /book/:id/collection - Modifier le statut d'un livre
  async updateStatus(req, res) {
    try {
      const userId = req.userId;
      const bookId = parseInt(req.params.id, 10);

      if (isNaN(bookId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "L'identifiant du livre est invalide",
        });
      }

      const { error, value } = statusSchema.validate(req.body);
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }

      const collectEntry = await Collect.findOne({
        where: { user_id: userId, book_id: bookId },
      });

      if (!collectEntry) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Livre non trouvé dans votre collection",
        });
      }

      collectEntry.status = value.status;
      await collectEntry.save();

      res.status(StatusCodes.OK).json({
        message: "Statut mis à jour",
        bookId,
        status: value.status,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de la mise à jour du statut",
      });
    }
  },

  // DELETE /book/:id/collection - Retirer un livre de la collection
  async remove(req, res) {
    try {
      const userId = req.userId;
      const bookId = parseInt(req.params.id, 10);

      if (isNaN(bookId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "L'identifiant du livre est invalide",
        });
      }

      const collectEntry = await Collect.findOne({
        where: { user_id: userId, book_id: bookId },
      });

      if (!collectEntry) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Livre non trouvé dans votre collection",
        });
      }

      await collectEntry.destroy();

      res.status(StatusCodes.OK).json({
        message: "Livre retiré de la collection",
        bookId,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de la suppression",
      });
    }
  },
};