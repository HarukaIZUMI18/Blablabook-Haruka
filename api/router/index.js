import { Router } from "express";
import { authRouter } from "./auth.js";

export const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.json({
    name: "Blablabook API",
    version: "1.0.0",
    description: "Système de gestion de bibliothèque personnelle",
    status: "OK",
  });
});

apiRouter.use(authRouter);
