import { Router } from "express";
import { userController } from "../controller/user.controller.js";
import { authenticateToken } from "../middleware/is-authed.middleware.js";

export const userRouter = Router();
userRouter.use(authenticateToken);
userRouter.get("/user/me", userController.UserInfo);
userRouter.patch("/user/me", userController.updateProfile);
userRouter.delete("/user/me", userController.deleteAccount);
