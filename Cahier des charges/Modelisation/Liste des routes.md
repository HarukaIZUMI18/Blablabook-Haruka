# Liste des routes API

1. Authentification (/auth)
   - Inscription (/register) POST
   - Connection (/login) POST

2. Gestion profil (/user)
    - Mon profil (/profil) GET
    - Ajout livre à sa bibliothèque (/addBook) POST 
    - Supprimer livre (bibliothèque user) (/deleteBook/:id) DELETE
    - Bibliothèque user (/library) GET
    - Modifier status livre bibliothèque (Lu, A lire, En cours, Abandonnées, En pause) (/:id/status) PATCH

3. Livre (/book)
    - Listes des livres (/books) GET
    - Recherche (/research) POST
    - Détail livre (/:id) GET
    - Liste de livre random (/randomList) GET
