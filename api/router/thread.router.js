import { Router } from "express";
import { threadController } from "../controller/thread.controoler.js";
import { threadMiddleware } from "../middleware/thread.middleware.js";
import { authenticateToken } from "../middleware/is-authed.middleware.js";

export const threadRouter = Router();

threadRouter.get("/thread", threadController.all);
threadRouter.get("/thread/:id", threadMiddleware.validateId, threadController.one);

threadRouter.post("/thread", authenticateToken, threadMiddleware.validateCreate, threadController.create);
threadRouter.post("/thread", authenticateToken, threadMiddleware.validateId, threadMiddleware.validateComment, threadController.addComment);

threadRouter.delete("/thread/:id", authenticateToken, threadMiddleware.validateId, threadController.remove,);
threadRouter.delete("/thread/:id/comment/:commentId", authenticateToken, threadMiddleware.validateId, threadMiddleware.validateCommentId, threadController.removeComment,);