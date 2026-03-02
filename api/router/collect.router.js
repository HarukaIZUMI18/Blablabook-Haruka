import { Router } from "express";
import { collectController } from "../controller/collect.controller.js";
import { authenticateToken } from "../middleware/is-authed.middleware.js";

export const collectRouter = Router();

// Toutes les routes sont protégées par l'authentification
collectRouter.use(authenticateToken);

// Routes de la collection personnelle
collectRouter.get("/collect", collectController.all);
collectRouter.post("/collect", collectController.add);
collectRouter.patch("/collect/:bookId", collectController.updateStatus);
collectRouter.delete("/collect/:bookId", collectController.remove);

