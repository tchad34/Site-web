NOXSTREAM — STRUCTURE FILMS

Structure :
- index.html : accueil
- style.css : feuille de style complète
- app.js : fonctionnement complet
- Films/ : un fichier HTML par film
- Films/catalogue.json : catalogue généré automatiquement
- generer_catalogue.py : détecte tous les .html présents dans Films/
- actualiser_films.bat : lance la détection automatiquement sous Windows

AJOUTER UN FILM :
1. Déposer le nouveau fichier .html dans le dossier Films/
2. Double-cliquer sur actualiser_films.bat
3. Recharger index.html

IMPORTANT :
Un navigateur sur un hébergement statique ne peut pas lister arbitrairement les fichiers d'un dossier
pour des raisons de sécurité. Le catalogue.json sert donc de liste automatique. Sur un hébergement
avec une étape de build, generer_catalogue.py peut être exécuté automatiquement à chaque déploiement.
