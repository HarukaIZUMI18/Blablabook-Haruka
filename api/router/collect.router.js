import { Router } from "express";
import { collectController } from "../controller/collect.controller.js";
import { authenticateToken } from "../middleware/is-authed.middleware.js";

export const collectRouter = Router();

// Routes de la collection personnelle
collectRouter.get("/collection", authenticateToken, collectController.all);
collectRouter.post("/book/:id/collection", authenticateToken, collectController.add);
collectRouter.patch("/book/:id/collection", authenticateToken, collectController.updateStatus);
collectRouter.delete("/book/:id/collection", authenticateToken, collectController.remove);