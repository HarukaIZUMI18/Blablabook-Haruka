import { Router } from "express";
import { userController } from "../controller/user.controller.js";
import { authenticateToken } from "../middleware/is-authed.middleware.js";

export const userRouter = Router();

// Protège toutes les routes utilisateur

userRouter.get("/user/me", authenticateToken, userController.UserInfo);
userRouter.patch("/user/me", authenticateToken, userController.updateProfile);
userRouter.delete("/user/me", authenticateToken, userController.deleteAccount);
