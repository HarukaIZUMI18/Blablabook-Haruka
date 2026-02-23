import { Router } from "express";
import { authRouter } from "./auth.js";

export const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  console.log("route home");
});
apiRouter.use(authRouter);
