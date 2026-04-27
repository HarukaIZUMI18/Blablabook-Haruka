import { Router } from "express";
import { authRouter } from "./auth.router.js";
import { userRouter } from "./user.router.js";
import { bookRouter } from "./book.router.js";
import { collectRouter } from "./collect.router.js";

export const apiRouter = Router();

// Route d'information sur l'API
apiRouter.get("/", (req, res) => {
  res.json({
    name: "Blablabook API",
    version: "1.0.0",
    description: "Système de gestion de bibliothèque personnelle",
    status: "OK",
  });
});

apiRouter.use(bookRouter);
apiRouter.use(authRouter);
apiRouter.use(userRouter);
apiRouter.use(collectRouter);
