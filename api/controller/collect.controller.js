import Joi from "joi";
import { Collect, Book } from "../models/index.js";
import { StatusCodes } from "http-status-codes";

// Statuts valides pour la collection
const VALID_STATUSES = ["à lire", "en cours", "lu", "abandonné"];

// Schémas de validation Joi
const addSchema = Joi.object({
  bookId: Joi.number().integer().positive().required(),
  status: Joi.string().valid(...VALID_STATUSES),
});

const statusSchema = Joi.object({
  status: Joi.string().valid(...VALID_STATUSES).required(),
});

export const collectController = {
  // GET /collect - Récupérer tous les livres de la collection
  async all(req, res) {
    try {
      const userId = req.userId;
      const { status } = req.query;

      // Préparer les options de requête Sequelize
      const options = {
        where: { user_id: userId },
        include: [
          {
            model: Book,
            attributes: ["id", "title", "author", "cover", "publish_year"],
          },
        ],
        order: [[Book, "title", "ASC"]],
      };

      // Ajouter le filtre par statut si fourni
      if (status && VALID_STATUSES.includes(status)) {
        options.where.status = status;
      }

      const collection = await Collect.findAll(options);

      // Formater la réponse
      const books = collection.map((item) => ({
        id: item.Book.id,
        title: item.Book.title,
        author: item.Book.author,
        cover: item.Book.cover,
        publish_year: item.Book.publish_year,
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

  // POST /collect - Ajouter un livre à la collection
  async add(req, res) {
    try {
      const userId = req.userId;

      // Valider les données entrantes
      const { error, value } = addSchema.validate(req.body);
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }

      const { bookId, status } = value;
      const defaultStatus = "à lire";

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

      // Créer l'entrée dans la collection
      await Collect.create({
        user_id: userId,
        book_id: bookId,
        status: status || defaultStatus,
      });

      res.status(StatusCodes.CREATED).json({
        message: "Livre ajouté à la collection",
        bookId,
        status: status || defaultStatus,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout à la collection:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de l'ajout à la collection",
      });
    }
  },

  // PATCH /collect/:bookId - Modifier le statut d'un livre
  async updateStatus(req, res) {
    try {
      const userId = req.userId;
      const { bookId } = req.params;

      // Valider le nouveau statut
      const { error, value } = statusSchema.validate(req.body);
      if (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: error.details[0].message,
        });
      }

      const newStatus = value.status;

      // Vérifier que l'entrée existe et appartient à l'utilisateur
      const collectEntry = await Collect.findOne({
        where: { user_id: userId, book_id: bookId },
      });

      if (!collectEntry) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Livre non trouvé dans votre collection",
        });
      }

      // Mettre à jour le statut
      collectEntry.status = newStatus;
      await collectEntry.save();

      res.status(StatusCodes.OK).json({
        message: "Statut mis à jour",
        bookId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Erreur lors de la mise à jour du statut",
      });
    }
  },

  // DELETE /collect/:bookId - Retirer un livre de la collection
  async remove(req, res) {
    try {
      const userId = req.userId;
      const { bookId } = req.params;

      // Vérifier que l'entrée existe et appartient à l'utilisateur
      const collectEntry = await Collect.findOne({
        where: { user_id: userId, book_id: bookId },
      });

      if (!collectEntry) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Livre non trouvé dans votre collection",
        });
      }

      // Supprimer l'entrée
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

