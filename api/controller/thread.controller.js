import { Thread, Comment, User } from "../models/index.js";
import { StatusCodes } from "http-status-codes";

export const threadController = {
    // liste des sujets
    async all(req, res){
        const page = req.query.page ? parseInt(req.query.page) : null;
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        const options = {
            order: [["created_at", "DESC"]],
            include: [{ model: User, attributes: ["id", "name"]}],
        };
        if (page && limit){
            options.limit = limit;
            options.offset = (page -1 ) * limit;
        }
        const { count, rows } = await Thread.findAndCountAll(options);

        res.status(StatusCodes.OK).json({
            totalItems: count,
            threads: rows,
            ...(page &&
                limit && {
                    currentPage: page,
                    totalPages: Math.ceil(count / limit),
                }
            ),
        });
    },
    // Détail d'un sujet + ses commentaires (lecture publique)
    async one(req, res) {
        const thread = await Thread.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ["id", "name"]},
                { model: Comment,
                    include: [{ model: User, attributes: ["id", "name"]}],
                },
            ],
        });
        if (!thread) {
            return res.status(StatusCodes.NOT_FOUND).json({ erreur: "Le sujet n'a pas été trouvé" });
        }
        res.status(StatusCodes.OK).json(thread);
    },
    // Création d'un sujet (authentifié)
  async create(req, res) {
    const { title, body } = req.body;
    const thread = await Thread.create({ title, body, user_id: req.userId });
    res.status(StatusCodes.CREATED).json(thread);
  },

  // Ajout d'un commentaire (authentifié)
  async addComment(req, res) {
    const thread = await Thread.findByPk(req.params.id);
    if (!thread) {
      return res.status(StatusCodes.NOT_FOUND).json({ erreur: "Le sujet n'a pas été trouvé" });
    }

    const comment = await Comment.create({
      body: req.body.body,
      user_id: req.userId,
      thread_id: thread.id,
    });
    res.status(StatusCodes.CREATED).json(comment);
},
// Suppression d'un sujet (auteur uniquement)
  async remove(req, res) {
    const thread = await Thread.findByPk(req.params.id);

    if (!thread) {
      return res.status(StatusCodes.NOT_FOUND).json({ erreur: "Le sujet n'a pas été trouvé" });
    }

    if (thread.user_id !== req.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ erreur: "Vous n'êtes pas l'auteur de ce sujet" });
    }

    await thread.destroy(); // Comment associés supprimés via onDelete: CASCADE
    res.status(StatusCodes.OK).json({ message: "Sujet supprimé" });
  },

  // Suppression d'un commentaire (auteur uniquement)
  async removeComment(req, res) {
    const comment = await Comment.findByPk(req.params.commentId);

    if (!comment || comment.thread_id !== parseInt(req.params.id, 10)) {
      return res.status(StatusCodes.NOT_FOUND).json({ erreur: "Le commentaire n'a pas été trouvé" });
    }

    if (comment.user_id !== req.userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ erreur: "Vous n'êtes pas l'auteur de ce commentaire" });
    }

    await comment.destroy();
    res.status(StatusCodes.OK).json({ message: "Commentaire supprimé" });
  },
};