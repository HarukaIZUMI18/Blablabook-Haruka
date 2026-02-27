import { Book, sequelize } from "../models/index.js";
import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";

export const bookController = {

  async all(req, res) {
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const order = req.query.order === "Z-A" ? "DESC" : "ASC";

    const options = {
      order: [["title", order]],
    };

    if (page && limit) {
      options.limit = limit;
      options.offset = (page - 1) * limit;
    }

    const { count, rows } = await Book.findAndCountAll(options);

    res.status(StatusCodes.OK).json({
      totalItems: count,
      books: rows,
      // On n'envoie ces infos que si la pagination était demandée
      ...(page &&
        limit && {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
        }),
    });
  },
  // Récupère un livre par son id
  async one(req, res) {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(StatusCodes.NOT_FOUND).json({
        erreur: "Le livre n'a pas été trouver",
      });
    }
    res.status(StatusCodes.OK).json(book);
  },
  // Récupère une liste de 5 livres au hasard
  async randomList(req, res) {
    const limitCount = 6;
    const random = await Book.findAll({
      order: [sequelize.random()],
      limit: limitCount,
    });
    res.status(StatusCodes.OK).json(random);
  },
  // Recherche par auteur et titre
  async search(req, res) {
    const search = req.query.q;
    /*
        1. search.replace(/\s+/g, "%") : remplace chaque bloc d'espaces par un symbole '%'
        2. Les `%` aux extrémités permettent de chercher "ceci" n'importe où dans le texte.
        Exemple : "j k rowling" devient "%j%k%rowling%" (ce qui matche avec "J. K. Rowling")
    */
    const flexibleSearch = `%${search.replace(/\s+/g, "%")}%`;
    const resultSearch = await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              // iLike = Insensible à la casse (Maj/Min)
              [Op.iLike]: flexibleSearch,
            },
          },
          {
            author: {
              [Op.iLike]: flexibleSearch,
            },
          },
        ],
      },
      limit: 20,
    });
    res.status(StatusCodes.OK).json(resultSearch);
  },
};
