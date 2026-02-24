# Blablabook

## Présentation du Projet

Le projet consiste à développer une plateforme en ligne dédiée à l'inventaire et à l'organisation de bibliothèques personnelles. Porté par l'association BlaBlaBook, cet outil numérique permet aux utilisateurs de centraliser la gestion de leurs ouvrages de manière structurée et efficace.

## Objectif: créer un gestionnaire de bibliothèque personnnelle

1. Page accueil
   - On souhaite créer une application présentant un « gestionnaire de bibliothèque », où il est possible de référencer nos collection de livres

   - Présentation de BlaBlaBook et quelques livres “random”.

2. Authentification
   - Système d'inscription et de connexion / déconnexion (JWT).
   - Systeme de desinscription du compte

3. Bibliothèque personnelle
   - Gestion de bibliothèque personnelle : y ajouter des livres, lus et à lire, pouvoir les retirer de sa liste (et non de la base de données).

4. Autre
   - Recherche et découverte de nouveaux livres : moteur de recherche par nom de livre.

   - Page de détail d'un livre avec les informations liées à ce dernier.

## MVP

1. Accueil + livres random
2. Inscription/Connexion indépendantes
3. Bibliothèque perso CRUD
4. Recherche livres

## Evolution possible

1. Pouvoir mettre un avis une note ou un avis sur un livre
2. Améliorer la fonction de filtrage par genre, date de publication..

## Technologie utiliser

## Front-end

- Framework : SVELTE
- CSS
- JS

## Back-end

- NPM
- Node js
- Express
- Base de données : PostgreSQL
- Hashage mots de passe:Argon 2
- Validation de données: Joi
- Auth:JWT
- ORM: Sequelize
- API externe: Open Library API
- express-xss-sanitizer

## Outil

- Docker

## Rôle de chacun

- Kevin Merlo -> Product Owner
- Haruka IZUMI -> Lead developer front
- Sabrya Djennane -> Référente technique: git master
- Alexandre Loncle -> Lead developer back
