import { Router } from "express";
import { collectController } from "../controller/collect.controller.js";
import { authenticateToken } from "../middleware/is-authed.middleware.js";

export const collectRouter = Router();

// Toutes les routes sont protégées par l'authentification
collectRouter.use(authenticateToken);

// Routes de la collection personnelle
collectRouter.get("/collection", collectController.all);
collectRouter.post("/book/:id/collection", collectController.add);
collectRouter.patch("/book/:id/collection", collectController.updateStatus);
collectRouter.delete("/book/:id/collection", collectController.remove);