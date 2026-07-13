/* ============================================================
   SÉSAMES — Données du site
   Toutes les informations modifiables depuis l'espace admin
   sont stockées ici (valeurs par défaut) puis surchargées par
   window.localStorage sous la clé "sesames_data".
   ============================================================ */

const SESAMES_DEFAULT_DATA = {
  centre: {
    nom: "Sésames",
    slogan: "L'art du bien-être, ouvert pour vous",
    logo: "assets/logo-icon.png",
    telephone: "+216 73 000 000",
    whatsapp: "21673000000",
    adresse: "Rue Yasser Arafet, Sahloul, Sousse, Tunisie",
    mapsEmbed: "https://www.google.com/maps?q=Sahloul+Sousse+Tunisie&output=embed",
    horaires: [
      { jour: "Lundi - Vendredi", heures: "9h00 - 20h00" },
      { jour: "Samedi", heures: "9h00 - 18h00" },
      { jour: "Dimanche", heures: "Fermé" }
    ],
    reseaux: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com"
    }
  },

  apropos: {
    titre: "Bienvenue chez Sésames",
    texte: "Niché au cœur de Sahloul, le centre Sésames est né d'une conviction simple : le bien-être véritable prend son temps. Fondé par Firas Selmi, notre centre réunit des praticiens formés aux techniques traditionnelles du massage et de la hijama, dans un cadre pensé pour apaiser le corps et l'esprit. Chaque soin est une parenthèse, chaque geste une attention. Ici, la rigueur professionnelle se met au service de votre détente.",
    fondateur: "Firas Selmi",
    fondateurTitre: "Fondateur & Directeur du centre"
  },

  stats: [
    { valeur: 10, suffixe: "+", label: "Soins & prestations" },
    { valeur: 500, suffixe: "+", label: "Clients satisfaits" },
    { valeur: 5, suffixe: "", label: "Années d'expérience" },
    { valeur: 98, suffixe: "%", label: "Taux de satisfaction" }
  ],

  services: [
    {
      id: "s1",
      categorie: "massage",
      nom: "Massage relaxant",
      description: "Un massage tout en douceur pour relâcher les tensions et apaiser l'esprit, à base de gestes enveloppants et d'un rythme lent.",
      duree: 60,
      prix: 90,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "s2",
      categorie: "massage",
      nom: "Massage thérapeutique",
      description: "Un travail ciblé sur les zones de tension chronique pour restaurer la mobilité et soulager durablement les douleurs.",
      duree: 60,
      prix: 100,
      image: "https://images.unsplash.com/photo-1620733723572-11c53f73a416?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "s3",
      categorie: "massage",
      nom: "Massage sportif",
      description: "Pensé pour les sportifs, ce massage prépare ou répare les muscles avant et après l'effort.",
      duree: 45,
      prix: 85,
      image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "s4",
      categorie: "massage",
      nom: "Massage anti-stress",
      description: "Un moment suspendu pour évacuer la charge mentale du quotidien et retrouver la sérénité.",
      duree: 50,
      prix: 90,
      image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "s5",
      categorie: "massage",
      nom: "Massage du dos",
      description: "Un soin concentré sur le dos et la nuque, idéal contre les douleurs liées à la posture.",
      duree: 30,
      prix: 60,
      image: "https://images.unsplash.com/photo-1591343395902-1c6a9c9f5b71?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "s6",
      categorie: "massage",
      nom: "Massage aux huiles essentielles",
      description: "Une expérience sensorielle complète, où les huiles essentielles subliment les bienfaits du toucher.",
      duree: 60,
      prix: 110,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "s7",
      categorie: "massage",
      nom: "Massage corps complet",
      description: "Le soin signature de Sésames : une prise en charge intégrale, de la tête aux pieds.",
      duree: 90,
      prix: 140,
      image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "s8",
      categorie: "hijama",
      nom: "Hijama traditionnelle",
      description: "Une pratique ancestrale de ventousothérapie visant à stimuler la circulation et à libérer les tensions profondes.",
      duree: 45,
      prix: 80,
      image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "s9",
      categorie: "hijama",
      nom: "Hijama sèche",
      description: "Ventouses posées sans incision, pour un effet drainant et décontractant en douceur.",
      duree: 30,
      prix: 60,
      image: "https://images.unsplash.com/photo-1611072965169-e1d566ce7f0d?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "s10",
      categorie: "hijama",
      nom: "Hijama humide",
      description: "Réalisée dans le respect strict des protocoles d'hygiène, par un praticien formé et expérimenté.",
      duree: 45,
      prix: 90,
      image: "https://images.unsplash.com/photo-1620733723572-11c53f73a416?q=80&w=800&auto=format&fit=crop"
    }
  ],

  bienfaits: [
    { titre: "Réduction du stress", texte: "Les massages abaissent le taux de cortisol et favorisent un état de calme durable." },
    { titre: "Soulagement des douleurs", texte: "Un travail musculaire ciblé qui atténue les tensions chroniques et les douleurs articulaires." },
    { titre: "Meilleure circulation", texte: "La stimulation des tissus favorise une meilleure oxygénation du corps." },
    { titre: "Sommeil apaisé", texte: "Nos soins favorisent la détente nerveuse et un endormissement plus facile." },
    { titre: "Équilibre du corps", texte: "La hijama traditionnelle est reconnue pour rétablir l'équilibre énergétique du corps." },
    { titre: "Bien-être général", texte: "Un moment pour soi, essentiel à l'équilibre physique et mental." }
  ],

  galerie: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591343395902-1c6a9c9f5b71?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620733723572-11c53f73a416?q=80&w=900&auto=format&fit=crop"
  ],

  temoignages: [
    { nom: "Amira B.", texte: "Un accueil chaleureux et un massage d'une grande justesse. Je ressors toujours apaisée.", note: 5 },
    { nom: "Sami T.", texte: "La hijama pratiquée ici est sérieuse et professionnelle. Un vrai savoir-faire.", note: 5 },
    { nom: "Nour K.", texte: "Le cadre est magnifique et le personnel très attentionné. Je recommande vivement.", note: 5 }
  ],

  reservations: []
};

/* ---------- Stockage local ---------- */
const SesamesStore = {
  KEY: "sesames_data",

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Sésames: lecture du stockage impossible, valeurs par défaut utilisées.", e);
    }
    return JSON.parse(JSON.stringify(SESAMES_DEFAULT_DATA));
  },

  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn("Sésames: écriture du stockage impossible.", e);
      return false;
    }
  },

  reset() {
    localStorage.removeItem(this.KEY);
  }
};
