# Liste des routes API

## Collection non public

1. Authentification (/auth)
   - POST /auth/register > Inscription 
   - POST /auth/login > Connection 

2. Gestion profil (/user)
    - GET /user/me > Mon profil

3. Collection (/collection)
    - GET /collection > collection de l'utilisateur

4. Livre (/book)
    - GET /book > Listes des livres
    - GET /book/:id > Détail d'un livre
    - GET /book/search?q= > Recherche 
    - GET /book/random > Liste de livre random
    - POST /book/:id/collection > Ajout livre à sa bibliothèque
    - DELETE /book/:id/collection > Supprimer un livre de sa collection
    - PATCH /book/:id/collection > Modifier le status des livres de la collection (Lu, A lire, En cours, Abandonnées, En pause)
