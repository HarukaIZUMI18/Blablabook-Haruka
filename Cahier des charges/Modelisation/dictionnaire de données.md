## Table USER 

| Attibut    | Description                      | Types de données | Format                         | Contrainte
| ---        | ---                              | ---              | ---                            | ---
| id         | identifiant de l'utilisateur     | INTEGER          | Entier positif auto-incrémenté | Clé primaire AUTO_INCREMENT NOT NULL
| email      | adresse mail de l'utilisateur    | VARCHAR          | Format email                   | NOT NULL UNIQUE
| password   | mot de passe hashé               | VARCHAR          | Max 255 caractères             | NOT NULL 
| name       | pseudo de l'utilisateur          | VARCHAR(100)     | Max 100 caractères             | NOT NULL
| created_at | Date de création du compte       | TIMESTAMP        | YYYY-MM-DD HH:MM:SS            |
| updated_at | Date de la dernière modification | TIMESTAMP        | YYYY-MM-DD HH:MM:SS            |

## Table BOOK 
| Attibut      | Description                      | Types de données | Format                         | Contrainte
| ---          | ---                              | ---              | ---                            | ---
| id           | Identifiant du livre             | INTEGER          | Entier positif auto-incrémenté | Clé primaire AUTO_INCREMENT NOT NULL
| title        | Titre du livre                   | VARCHAR(100)     | Max 100 caractères             | NOT NULL
| cover        | URL ou chemin vers l'image       | VARCHAR          | Max 255 caractères             | NOT NULL
| author       | Nom de l'auteur du livre         | VARCHAR(100)     | Max 100 caractères             | NOT NULL
| description  | Description du livre             | VARCHAR          | Max 255 caractères             | NOT NULL
| publish_year | Année de publication du livre    | YEAR             | YYYY                           | NOT NULL
| created_at   | Date de création du livre        | TIMESTAMP        | YYYY-MM-DD HH:MM:SS            |
| updated_at   | Date de la dernière modification | TIMESTAMP        | YYYY-MM-DD HH:MM:SS            |

## Table COLLECT 

| Attibut | Description                        | Types de données | Format                                      | Contrainte
| ---     | ---                                | ---              | ---                                         | ---
| user_id | Référence à l'utilisateur concerné | INTEGER          | Entier positif                              | Clé étrangère -> USER.id NOT NULL
| book_id | Référence au livre concerné        | INTEGER          | Entier positif                              | Clé étrangère -> BOOK.id NOT NULL
| status  | Statut de lecture                  | VARCHAR(50)      | Lu, A lire, En cours, Abandonnées, En pause | NOT NULL