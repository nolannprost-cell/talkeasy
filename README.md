# Stopover — pauses d'anglais de 2 à 5 minutes

PWA mobile-first pour apprendre l'anglais par petites sessions courtes, sans
tableau de bord culpabilisant ni streak. Fonctionne 100% hors-ligne avec du
contenu local.

**Version actuelle : deux briques, "Les bases" + "3 minutes"** — Listen, Talk,
Review et Music ont été mis de côté pour se concentrer sur ce qui apporte une
vraie valeur : "Les bases" (5 courtes leçons de grammaire qui expliquent la
règle avant de faire pratiquer — pronoms, verbe "to be", ordre des mots,
présent simple, questions) pour une personne qui démarre de zéro, et
"3 minutes" (mini-exercices de vocabulaire avec répétition espacée) pour
ancrer du vocabulaire une fois les bases posées. Le code des autres activités
reste dans `src/pages/` si on veut les reprendre plus tard, mais elles ne
sont plus reliées dans `App.tsx`.

## Installation (première fois)

Ce projet a été écrit sans accès réseau ; il n'a donc **jamais encore été
installé ni buildé**. Sur votre machine (avec Node.js 18+ installé) :

```bash
npm install
npm run dev
```

Ouvrez l'URL affichée (en général `http://localhost:5173`) sur votre
ordinateur, ou sur votre iPhone en étant sur le même réseau Wi-Fi
(`http://<votre-ip-locale>:5173`, avec `npm run dev -- --host`).

Comme je n'ai pas pu exécuter `npm install` moi-même (pas d'accès réseau dans
mon environnement), il est possible qu'une petite erreur de build apparaisse
à la première tentative (import manquant, faute de frappe...). J'ai vérifié
la syntaxe de chaque fichier, mais pas le comportement réel dans un
navigateur — dites-moi ce que vous voyez et je corrige immédiatement.

## Installer sur iPhone (PWA)

1. `npm run build` puis déployez le dossier `dist/` (Vercel, Netlify, ou tout
   hébergement statique), ou utilisez `npm run preview` en local pour tester.
2. Ouvrez l'URL avec **Safari** sur iPhone.
3. Bouton Partager → **"Sur l'écran d'accueil"**.

## Où sont stockées les données

Tout est stocké en local, dans le navigateur (`localStorage`), propre à
**chaque appareil**. Il n'y a ni compte ni serveur : si ton amie installe
l'app sur son iPhone, elle aura son propre profil, sa propre progression,
totalement séparés des tiens — rien n'est partagé ni synchronisé entre vous.
Si elle désinstalle la PWA ou vide les données Safari, sa progression est perdue
(pas de sauvegarde cloud pour l'instant).

```
src/
  components/   UI réutilisable (cartes, exercice, boutons...)
  pages/        Un fichier par écran (Home, ThreeMinutes, Listen, Talk, Music, Review, Profile)
  data/         Contenu pédagogique local (mots, scénarios d'écoute, conversations)
  services/     Logique pure, sans UI :
                  storage.ts        -> localStorage (profil, progression, chansons)
                  srs.ts            -> répétition espacée + score de maîtrise
                  activityGenerator.ts -> construit les sessions d'exercices
                  aiService.ts      -> abstraction IA (proxy externe ou repli local)
                  localConversation.ts -> conversations + corrections sans API
                  tts.ts            -> lecture audio (Web Speech API)
  hooks/        useProfile (lecture/écriture du profil)
  types/        Types TypeScript partagés
```

## Contenu inclus (MVP)

- 55 mots/expressions d'anglais courant, chacun avec une phrase naturelle
- 6 scénarios d'écoute (hôtel, café, itinéraire, collègue, retard, retour en magasin)
- 8 scénarios de conversation (restaurant, hôtel, rencontre, itinéraire,
  journée, réservation, collègue, client)

## Brancher une vraie IA plus tard

`services/aiService.ts` regarde la variable d'environnement
`VITE_AI_PROXY_URL`. Tant qu'elle n'est pas définie, l'app utilise le moteur
local (`localConversation.ts`) — scripts + détection de quelques erreurs
fréquentes. Pour brancher un vrai modèle :

1. Créez un petit backend qui détient la clé API et expose une route
   `POST /chat` (payload : `{ mode: 'reply' | 'feedback', systemContext, history }`).
2. Copiez `.env.example` en `.env.local` et renseignez `VITE_AI_PROXY_URL`.
3. Rien d'autre à changer dans le code.

## Ce qui manque volontairement (hors scope MVP)

- Téléchargement/streaming de musique protégée (l'activité Music travaille du
  vocabulaire thématique local, pas de vraies paroles)
- Vrais fichiers audio enregistrés (TTS navigateur pour l'instant — architecture
  prête pour brancher des fichiers `.mp3` plus tard)
- Synchronisation cloud (tout est en localStorage, propre à l'appareil)
