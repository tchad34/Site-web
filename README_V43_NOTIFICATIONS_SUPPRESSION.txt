NOXSTREAM V43 — NOTIFICATIONS ACCUEIL + SUPPRESSION COMPTE

Modifications de cette version :
- Activation des notifications Push déplacée sur la page d'accueil NoxStream.
- Enregistrement de l'abonnement Push via la fonction Supabase admin-push-subscribe.
- Service Worker racine /sw.js ajouté pour permettre les notifications même lorsque la page admin est fermée.
- L'activation Push est proposée uniquement lorsque le compte connecté est administrateur.
- Page admin : ajout du bouton « Supprimer le compte ».
- La suppression passe par la fonction sécurisée Supabase admin-delete-account et supprime le compte Auth ainsi que ses profils associés.
- Le compte administrateur connecté ne peut pas être supprimé depuis cette page.

Backend déjà déployé sur le projet Supabase Site web :
- admin-delete-account : ACTIVE v1
- admin-push-subscribe : ACTIVE v10
- admin-push-send : ACTIVE v1
- Webhook notification_nouveau_compte : actif sur public.profiles, événement INSERT

Important : cette archive contient l'intégralité du dossier NoxStream + admin.
Le déploiement Cloudflare Pages reste à effectuer côté Cloudflare.
