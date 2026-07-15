# Sésames — Site web du centre de massage & bien-être

Site vitrine premium pour le centre **Sésames** (Sahloul, Sousse), avec espace
administrateur permettant à Firas Selmi de gérer tout le contenu sans toucher
au code.

## 🔧 Résumé des corrections apportées

J'ai analysé l'intégralité du code (HTML/CSS/JS), reproduit chaque bug dans un
environnement de test automatisé, corrigé les causes réelles, puis re-testé
tout le site (bureau + mobile, via un vrai moteur de navigateur) avant de vous
livrer cette version.

### 1. Réservation — bug trouvé et corrigé
**Cause réelle du problème :** le formulaire ne se protégeait pas contre une
double soumission. En cliquant deux fois rapidement sur "Confirmer la
demande" (ce qui arrive très souvent sur mobile — double-tap accidentel), le
scénario suivant se produisait :
1. Le 1er clic valide le formulaire, enregistre la réservation, affiche le
   message de succès, **et vide les champs** (`form.reset()`).
2. Le 2e clic (quelques centaines de millisecondes plus tard) se retrouve
   avec des champs vides → la validation échoue → un message d'erreur rouge
   s'affiche **par-dessus** le message de succès.

Résultat pour vous : la réservation était en réalité bien enregistrée, mais
l'écran affichait une erreur, donnant l'impression que "ça plante". J'ai
reproduit ce scénario exact en environnement de test pour confirmer le
diagnostic avant de corriger.

**Correction appliquée** (`main.js`) :
- Un verrou anti-double-soumission empêche désormais un second clic/tap
  pendant qu'une demande est en cours de traitement (bouton désactivé avec le
  texte "Envoi en cours…").
- Si le stockage local du navigateur est réellement indisponible (navigation
  privée stricte, aperçu en bac à sable, etc.), le site l'indique clairement
  au lieu d'afficher un faux message de succès.
- Une date minimale (aujourd'hui) est désormais appliquée au champ date pour
  éviter les réservations dans le passé.
- J'ai testé le flux de bout en bout (soumission simple, triple-clic rapide,
  plusieurs réservations distinctes à la suite) : tout fonctionne
  correctement dans tous les cas.

### 2. Logo — corrigé de façon définitive
**Cause probable :** le logo était référencé via un chemin de fichier
(`assets/logo-icon.png`), qui ne se retrouve "cassé" en production que si le
dossier `assets/` n'est pas déployé correctement avec le reste du projet.

**Correction appliquée** : le logo est maintenant **encodé directement dans
le code** (`data.js`, ainsi que dans le `<head>`/le HTML des deux pages) sous
forme d'image intégrée (base64). Il ne dépend donc plus d'aucun chemin de
fichier, d'aucune structure de dossier, ni d'aucune configuration
d'hébergeur : il fait partie intégrante du fichier lui-même et s'affichera
toujours, sur Vercel comme sur n'importe quel autre hébergeur. Le fichier
`assets/logo-icon.png` original reste fourni dans le projet à titre de
référence (utile par exemple si vous voulez un favicon haute résolution
ailleurs), mais n'est plus une dépendance critique.

### 3. Bouton WhatsApp — redessiné
Le bouton reprend maintenant les codes du site : ombre douce cohérente avec
les autres éléments (`--shadow-card`), liseré blanc identique à la photo du
hero, animation de pulsation plus subtile, et une **info-bulle** ("Discuter
sur WhatsApp") qui apparaît au survol, dans les couleurs et la police du
site (Outfit, teal profond, crème). La fonctionnalité (ouverture de WhatsApp
avec le bon numéro) est inchangée et a été retestée. Un garde-fou a aussi été
ajouté : si aucun numéro WhatsApp n'est configuré dans l'admin, le bouton se
masque proprement au lieu d'afficher un lien cassé.

### 4. Sécurité — faille corrigée
Les réservations envoyées par vos visiteurs étaient affichées dans l'espace
admin sans protection : un visiteur malveillant aurait pu insérer du code
dans le champ "message" ou "nom", qui se serait exécuté dans le navigateur de
l'administrateur en consultant l'onglet Réservations. J'ai corrigé cette
faille (échappement systématique de tout contenu affiché) et testé avec
plusieurs tentatives d'injection : tout est maintenant affiché en texte brut,
sans risque. Cette même protection a été étendue par précaution aux autres
champs gérés depuis l'admin (services, galerie, témoignages, horaires) pour
éviter qu'une apostrophe ou un guillemet ne casse l'affichage.

### 5. Robustesse générale
- Les lectures/écritures du mot de passe administrateur sont désormais
  protégées (try/catch), pour éviter un blocage si le stockage local est
  restreint par le navigateur.
- Les messages de confirmation dans l'admin ("Modifications enregistrées")
  reflètent maintenant la réalité : si la sauvegarde locale échoue, vous en
  êtes informé au lieu de voir un faux message de succès.
- Ajout de `rel="noopener noreferrer"` sur tous les liens qui s'ouvrent dans
  un nouvel onglet (bonne pratique de sécurité/performance).
- Ajout de balises Open Graph de base pour un meilleur partage sur les
  réseaux sociaux.

## ✅ Tests effectués avant livraison
- Simulation complète du parcours de réservation (soumission simple, double
  clic rapide, plusieurs réservations à la suite) — aucune erreur, données
  correctement enregistrées à chaque fois.
- Connexion à l'espace admin, consultation des réservations, tentative
  d'injection de code malveillant — correctement neutralisée.
- Rendu visuel réel (bureau et mobile) du site, du bouton WhatsApp et de la
  fenêtre de réservation.
- Vérification qu'aucune erreur JavaScript ne se produit sur l'ensemble du
  parcours (accueil, filtres de services, galerie/lightbox, formulaire de
  contact, formulaire de réservation).

## Fichiers

| Fichier         | Rôle |
|-----------------|------|
| `index.html`    | Page principale du site (une seule page, ancres de navigation) |
| `admin.html`    | Espace administrateur protégé par mot de passe |
| `styles.css`    | Feuille de style unique (design, animations, responsive) |
| `data.js`       | Contenu par défaut du site + moteur de stockage local + logo intégré |
| `main.js`       | Affichage dynamique du contenu + interactions (menu, réservation, galerie...) |
| `admin.js`      | Logique de l'espace administrateur |
| `assets/logo-icon.png` | Logo officiel en fichier séparé (référence / usage externe) |
| `assets/wtsp_logo.png` | Logo WhatsApp fourni (non utilisé dans le design final — j'ai gardé l'icône vectorielle existante, plus nette à toutes les tailles et déjà cohérente avec le style vectoriel du reste du site ; ce fichier reste disponible si vous préférez l'utiliser ailleurs) |

## Comment ouvrir le site

1. Gardez tous les fichiers dans le **même dossier** (ne renommez rien).
2. Ouvrez `index.html` dans un navigateur, ou déposez le dossier complet chez
   un hébergeur (OVH, Hostinger, Netlify, Vercel, GitHub Pages...).
3. Le site fonctionne sans base de données ni serveur : tout le contenu
   modifiable est stocké dans le **stockage local du navigateur**
   (`localStorage`), propre à chaque visiteur ou administrateur.

> ⚠️ Important — limitation inhérente à ce type de site (non liée aux bugs
> corrigés) : le stockage local est **local au navigateur**. Les
> réservations envoyées depuis `index.html` ne sont visibles dans
> `admin.html` que si les deux pages sont ouvertes **dans le même
> navigateur, sur le même appareil**. Pour que toutes les réservations de
> tous les visiteurs remontent automatiquement vers un admin qui se connecte
> depuis n'importe où, il faudra à terme brancher une vraie base de données
> (Firebase, Supabase...). La structure du code (`data.js`) est conçue pour
> rendre cette évolution simple : il suffira de remplacer les fonctions
> `SesamesStore.load()` / `SesamesStore.save()` par des appels API. Je peux
> vous accompagner sur cette évolution si vous le souhaitez.

## Accès à l'espace administrateur

- URL : `admin.html`
- Mot de passe par défaut : **firas.selmi.692005**
- Vous pouvez changer ce mot de passe directement dans l'onglet
  "Général → Sécurité" une fois connecté.

> Note de sécurité honnête : ce mot de passe est vérifié côté navigateur
> (il n'y a pas de serveur), ce qui convient pour empêcher un visiteur
> ordinaire de modifier le contenu, mais ne constitue pas une sécurité de
> niveau professionnel contre quelqu'un de déterminé et technique. Pour un
> site à fort enjeu, une vraie authentification côté serveur serait
> recommandée à terme.

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
automatiquement le numéro renseigné dans l'admin — il n'est jamais écrit en
dur dans le code.

## Personnalisation rapide

- **Images** : les photos de service/galerie utilisent des liens Unsplash
  d'exemple. Remplacez-les par vos propres photos (upload chez un hébergeur
  d'images, puis collez le lien dans l'admin).
- **Couleurs / police** : tout est centralisé dans les variables CSS en haut
  de `styles.css` (`:root { --teal-deep, --teal, --teal-bright, --cream,
  --sand... }`), calquées sur le teal du logo officiel (#21B6A2).
- **SEO** : les balises `<title>`, `<meta description>` et Open Graph dans
  `index.html` sont orientées vers "massage Sousse" et "hijama Sousse".

## Note sur l'aperçu dans Claude.ai

Si vous prévisualisez `index.html` ou `admin.html` directement dans
l'interface Claude.ai, certaines fonctions de stockage peuvent être limitées
par le bac à sable de prévisualisation. Téléchargez les fichiers et
ouvrez-les dans un vrai navigateur (ou hébergez-les) pour profiter de toutes
les fonctionnalités, notamment la sauvegarde des modifications de l'admin.
