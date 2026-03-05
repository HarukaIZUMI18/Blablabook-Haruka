import "dotenv/config";
import express from "express";
import cors from "cors";
import { xss } from "express-xss-sanitizer";
import { apiRouter } from "./router/index.js";
// Import des gestionnaires d'erreurs
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

const app = express();

app.use(cors());            // Active CORS
app.use(express.json());    // Parse le JSON
app.use(xss());             // Nettoie les entrées XSS



// Charge toutes les routes
app.use(apiRouter);

// Gestionnaire 404 pour les routes non trouvées
app.use(notFoundHandler);

// Gestionnaire d'erreurs (doit être en dernier)
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(` Api is listening on http://localhost:${port}`);
});
