NOXSTREAM — DEPLOIEMENT CLOUDFLARE PAGES

Cette archive est prête à être déployée à la racine du projet Cloudflare Pages noxstream-tv.

Structure importante :
- index.html = site NoxStream
- admin/index.html = panneau d'administration

Après déploiement :
https://noxstream-tv.pages.dev/admin/

Le panneau admin utilise Supabase et vérifie les droits administrateur côté base.
Ne jamais ajouter de clé service_role dans les fichiers publics.
