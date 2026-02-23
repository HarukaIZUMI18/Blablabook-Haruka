# Docker Compose — Commandes

## Démarrage

Démarre en arrière-plan (detached). Le flag `-d` signifie detached, les conteneurs tournent en fond sans bloquer ton terminal.

```bash
docker compose up -d
```

Force la reconstruction des conteneurs et démarre en arrière-plan.

```bash
docker compose up -d --build
```

Redémarre des conteneurs arrêtés.

```bash
docker compose start
```

Redémarre les conteneurs.

```bash
docker compose restart
```

---

## Arrêt & Suppression

Arrête les conteneurs sans les supprimer.

```bash
docker compose stop
```

Arrête et supprime les conteneurs.

```bash
docker compose down
```

Supprime les conteneurs arrêtés.

```bash
docker compose rm
```

Tout supprimer (Volumes inclus)

```bash
docker compose down -v
```

---

## Surveillance

Affiche l'état et la liste des conteneurs du projet.

```bash
docker compose ps
```

Affiche les logs de tous les services.

```bash
docker compose logs
```

Affiche les logs en temps réel (follow).

```bash
docker compose logs -f
```

## Connection

Se connecter à la bdd

```bash
docker exec -it blablabook-database psql -U blablabook -d blablabook
```

## Maintenance & Nettoyage

Voir les ressources consommées

```bash
docker compose stats
```

Supprimer les images non utilisées

```bash
docker image prune -a
```
