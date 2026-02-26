import { Router } from "express";
import { bookController } from "../controller/book.controller.js";
import { bookMiddleware } from "../middleware/book.middleware.js";

export const bookRouter = Router();

bookRouter.get("/book/search", bookMiddleware.validateSearchQuery, bookController.search);
bookRouter.get("/book/random", bookController.randomList);
bookRouter.get("/book/:id",bookMiddleware.validateId, bookController.one);
bookRouter.get("/book", bookController.all);
