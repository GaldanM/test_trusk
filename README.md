Si Redis n'arrive pas à se connecter, il faut changer l'IP dans "redisHelpers.js" et la remplacer par ce que donne cette commande

```docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' redis```

J'ai cherché à comprendre comment résoudre ce bug, il faudrait que je fasse un docker-compose ou bien changer la config du Redis.

Pour des raisons de manque de temps, j'ai préféré laisser comme tel.
