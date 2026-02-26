import { Router } from "express";
import { authRouter } from "./auth.router.js";
import { userRouter } from "./user.router.js";
import { bookRouter } from "./book.route.js";

export const apiRouter = Router();

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
