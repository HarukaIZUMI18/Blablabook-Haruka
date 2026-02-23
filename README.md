# Blablabook 

Application de gestion de bibliothèque comprenant une API (Node.js/PostgreSQL) et un Client (Frontend).

---

## 🚀 Installation avec Docker

### 1. Préparation

Créez un fichier `.docker.env` à la racine du projet en vous basant sur le fichier `.docker.env.exemple`.

### 2. Lancement

Pour construire les images et lancer les services en arrière-plan :

```bash
docker compose up -d
```

## Architecture des Services

| Service      | Conteneur             | Port Externe | Image / Runtime                 |
| ------------ | --------------------- | ------------ | ------------------------------- |
| **API**      | `blablabook-api`      | `3000`       | Node.js 24-alpine               |
| **Client**   | `blablabook-client`   | `4173`       | Node.js 24-alpine (Svelte/Vite) |
| **Database** | `blablabook-database` | `5432`       | PostgreSQL 18-alpine            |
