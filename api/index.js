import "dotenv/config";
import express from "express";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import { apiRouter } from "./router/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(xss());

app.use(apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Api is listening on http://localhost:${port}`);
});
