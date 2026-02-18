# Liste des routes API

## Collection non public

1. Authentification (/auth)
   - GET /auth/register > Inscription 
   - POST /auth/register > Inscription 
   - GET /auth/login > Connection 
   - POST /auth/login > Connection 

2. Gestion profil (/user)
    - GET /user/me > Mon profil
    - PATCH /user/me > Modifier email / mot de passe / pseudo
    - DELETE /user/me > Suppression du compte

3. Collection (/collection)
    - GET /collection > collection de l'utilisateur

4. Livre (/book)
    - GET /book > Listes des livres
    - GET /book/:id > Détail d'un livre
    - GET /book/search > Recherche (avec query string ?q=) 
    - GET /book/random > Liste de livre random
    - POST /book/:id/collection > Ajout livre à sa bibliothèque
    - DELETE /book/:id/collection > Supprimer un livre de sa collection
    - PATCH /book/:id/collection > Modifier le statut des livres de la collection (Lu, A lire, En cours, Abandonnées, En pause)

5. Page accueil (/)
    - GET / > Présentaion de l'API