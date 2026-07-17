# Sésames — Site web du centre de massage & bien-être

Site vitrine premium pour le centre **Sésames** (Sahloul, Sousse), avec espace
administrateur permettant à Firas Selmi de gérer tout le contenu sans toucher
au code.

## Fichiers

| Fichier         | Rôle |
|-----------------|------|
| `index.html`    | Page principale du site (une seule page, ancres de navigation) |
| `admin.html`    | Espace administrateur protégé par mot de passe |
| `styles.css`    | Feuille de style unique (design, animations, responsive) |
| `data.js`       | Contenu par défaut du site + moteur de stockage local |
| `main.js`       | Affichage dynamique du contenu + interactions (menu, réservation, galerie...) |
| `admin.js`      | Logique de l'espace administrateur |
| `assets/logo-icon.png` | Logo officiel (icône, fond transparent) — **un seul fichier**, utilisé partout : menu, pied de page, écran de connexion admin, en-tête admin |

## Comment ouvrir le site

1. Gardez tous les fichiers dans le **même dossier** (ne renommez rien).
2. Ouvrez `index.html` dans un navigateur, ou déposez le dossier complet chez
   un hébergeur (OVH, Hostinger, Netlify, GitHub Pages...).
3. Le site fonctionne sans base de données ni serveur : tout le contenu
   modifiable est stocké dans le **stockage local du navigateur**
   (`localStorage`), propre à chaque visiteur ou administrateur.

> ⚠️ Important : le stockage local est **local au navigateur**, pas partagé
> entre visiteurs. Cela signifie que les modifications faites dans
> `admin.html` s'appliquent au site vu depuis **ce même navigateur/ordinateur**.
> Pour un site utilisé par plusieurs personnes avec des mises à jour visibles
> par tous les visiteurs, il faudra à terme brancher une petite base de
> données (ex. Firebase, Supabase) — la structure du code (`data.js`) est
> conçue pour rendre cette évolution simple : il suffira de remplacer les
> fonctions `SesamesStore.load()` / `SesamesStore.save()` par des appels API.

## Accès à l'espace administrateur

- URL : `admin.html`
- Mot de passe par défaut : **firas.selmi.692005**
- Vous pouvez changer ce mot de passe directement dans l'onglet
  "Général → Sécurité" une fois connecté.

Depuis l'admin, vous pouvez :

- Changer le **logo**, le **nom**, le **slogan**
- Modifier **téléphone**, **WhatsApp**, **adresse**, **horaires**, **réseaux sociaux**
- Modifier le texte "À propos" et les informations du fondateur
- **Ajouter / modifier / supprimer** des massages et des types de hijama
  (nom, description, durée, prix, image)
- Gérer les **photos de la galerie**
- Gérer les **témoignages clients**
- Consulter les **demandes de réservation** envoyées depuis le site

Le bouton WhatsApp flottant et tous les liens WhatsApp du site utilisent
automatiquement le numéro renseigné dans l'admin — il n'est jamais écrit en dur
dans le code.

> Note sur le logo : le logo est maintenant **unifié** — un changement effectué
> depuis l'admin (onglet Général → Identité du centre) met à jour
> **instantanément** l'icône partout : menu du site, pied de page, écran de
> connexion admin et en-tête admin. Un seul fichier à gérer, plus aucune
> incohérence possible entre les pages.

## Nouveautés dynamiques (VFX)

- **Barre de progression** en haut de l'écran qui se remplit au fil du scroll.
- **Bulles animées** en arrière-plan du hero + légère flottaison de la photo circulaire.
- **Section "Chiffres clés"** avec compteurs qui s'animent (comptent jusqu'au chiffre final) dès qu'ils entrent à l'écran — modifiable dans l'admin (Général → Chiffres clés).
- **Effet de bascule 3D (tilt)** sur les cartes de services au survol de la souris (désactivé automatiquement sur mobile/tactile).

## Personnalisation rapide

- **Images** : les photos de service/galerie utilisent des liens Unsplash
  d'exemple. Remplacez-les par vos propres photos (upload chez un hébergeur
  d'images ou dans un dossier `assets/` du site, puis collez le chemin dans
  l'admin).
- **Couleurs / police** : tout est centralisé dans les variables CSS en haut de
  `styles.css` (`:root { --teal-deep, --teal, --teal-bright, --cream, --sand... }`),
  calquées précisément sur le teal du logo officiel (#21B6A2) pour une identité
  visuelle 100% cohérente.
- **SEO** : les balises `<title>` et `<meta description>` dans `index.html`
  sont déjà orientées vers "massage Sousse" et "hijama Sousse".

## Note sur l'aperçu dans Claude.ai

Si vous prévisualisez `index.html` ou `admin.html` directement dans l'interface
Claude.ai, certaines fonctions de stockage peuvent être limitées par le bac à
sable de prévisualisation. Téléchargez les fichiers et ouvrez-les dans un vrai
navigateur (ou hébergez-les) pour profiter de toutes les fonctionnalités,
notamment la sauvegarde des modifications de l'admin.
