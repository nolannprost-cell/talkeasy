// Mini-dictionnaire anglais -> français pour la traduction au tap sur un mot
// (voir components/TappableSentence.tsx). Couvre les mots courants utilisés
// dans les phrases de l'appli (pronoms, verbes fréquents, mots outils...).
// Ce n'est pas un dictionnaire complet — un mot absent affiche simplement
// "traduction non disponible" plutôt que de planter.
export const MINI_DICTIONARY: Record<string, string> = {
  // pronoms & mots de base
  i: 'je', "i'm": 'je suis', me: 'moi/me', my: 'mon/ma/mes', you: 'tu/vous', your: 'ton/ta/tes',
  he: 'il', "he's": 'il est', his: 'son/sa/ses (à lui)', him: 'lui',
  she: 'elle', "she's": 'elle est', her: 'son/sa/ses (à elle) / la',
  it: 'il/elle (chose)', "it's": "c'est", we: 'nous', they: 'ils/elles', them: 'eux/elles',
  this: 'ce/cette', "that's": "c'est", that: 'ce/cette/que', these: 'ces', there: 'là', "there's": 'il y a',

  // verbe être / auxiliaires
  am: 'suis', is: 'est', are: 'es/sommes/êtes/sont', was: 'était', have: 'avoir/ai', has: 'a',

  // verbes courants
  like: 'aimer', likes: 'aime', love: 'adorer', loves: 'adore', want: 'vouloir', wants: 'veut',
  need: 'avoir besoin', know: 'savoir/connaître', go: 'aller', going: 'en train d\'aller', live: 'habiter',
  work: 'travailler', works: 'travaille', speak: 'parler', see: 'voir', take: 'prendre', takes: 'prend',
  make: 'faire', let: "laisser / let's = allons", "let's": 'allons', get: 'obtenir/devenir', eat: 'manger',
  can: 'pouvoir', "can't": 'ne peux pas', should: 'devrait', do: 'faire (auxiliaire)', does: 'fait (auxiliaire)',
  "don't": 'ne...pas', "doesn't": 'ne...pas (il/elle)', check: 'vérifier', try: 'essayer', buying: 'acheter (en train de)',
  return: 'rendre/rapporter', book: 'réserver', pay: 'payer', leave: 'laisser/partir', lock: 'fermer à clé',
  turn: 'tourner', follow: 'suivre', reach: 'contacter/atteindre', point: 'signaler/pointer', run: 'courir',
  show: 'montrer/se pointer', catch: 'attraper', hang: 'traîner (hang out)', deal: 'gérer (deal with)',
  figure: 'comprendre (figure out)', find: 'trouver', pick: 'récupérer/choisir', drop: 'déposer/laisser tomber',
  used: "utilisé / used to = avoir l'habitude", avoid: 'éviter', avoids: 'évite', tired: 'fatigué(e)',
  ready: 'prêt(e)', happy: 'content(e)/heureux', hungry: 'affamé(e)', worth: 'qui vaut la peine',
  worries: 'soucis / no worries = pas de souci', sorry: 'désolé(e)', sounds: 'ça sonne / sounds good = ça marche',
  meet: 'rencontrer', reading: 'en train de lire', still: 'encore/toujours', quickly: 'rapidement',
  usually: "d'habitude", always: 'toujours', often: 'souvent', sometimes: 'parfois', never: 'jamais',
  fast: 'vite/rapide', slowly: 'lentement', right: 'correct / à droite', close: 'proche / fermer',
  correct: 'correct(e)', starts: 'commence', comes: 'vient', coming: 'en train de venir',
  going: 'en train d\'aller', wants: 'veut', talk: 'parler',

  // mots outils / grammaire
  a: 'un/une', an: 'un/une (devant voyelle)', the: 'le/la/les', and: 'et', or: 'ou', but: 'mais',
  so: 'donc/alors', not: 'ne...pas', no: 'non', of: 'de', to: 'à/vers', for: 'pour', with: 'avec',
  without: 'sans', in: 'dans/en', on: 'sur', at: 'à/chez', by: 'par', from: 'de/depuis', up: 'en haut/vers le haut',
  out: 'dehors/vers l\'extérieur', off: 'éteint/parti/hors de', over: 'par-dessus/fini', all: 'tout(e)/tous',
  very: 'très', too: 'aussi/trop', how: 'comment', what: 'quoi/quel', where: 'où', when: 'quand',
  who: 'qui', why: 'pourquoi', while: 'pendant que', then: 'alors/ensuite', now: 'maintenant',
  before: 'avant', after: 'après', already: 'déjà', instead: 'à la place', anytime: "n'importe quand",
  every: 'chaque', each: 'chaque', much: 'beaucoup (indénombrable)', some: 'quelques/du', any: 'aucun/quelconque',
  probably: 'probablement', actually: 'en fait', please: "s'il te/vous plaît", thank: 'remercier',
  soon: 'bientôt', together: 'ensemble', around: 'autour/environ', across: 'à travers', along: 'le long de',
  ahead: 'devant / straight ahead = tout droit', straight: 'droit', back: 'en arrière/de retour',
  down: 'en bas', into: 'dans (mouvement)', through: 'à travers',

  // quantités / temps
  one: 'un', two: 'deux', three: 'trois', four: 'quatre', five: 'cinq', ten: 'dix', eleven: 'onze',
  year: 'année', years: 'années', month: 'mois', week: 'semaine', day: 'jour', morning: 'matin',
  noon: 'midi', tonight: 'ce soir', tomorrow: 'demain', weekend: 'week-end', friday: 'vendredi',
  fridays: 'les vendredis', sundays: 'les dimanches', summer: 'été', holidays: 'vacances/fêtes',
  time: 'temps/heure', schedule: 'horaire', deadline: 'date limite',

  // lieux / voyage
  airport: 'aéroport', hotel: 'hôtel', station: "gare/station", downtown: 'centre-ville',
  neighborhood: 'quartier', bridge: 'pont', school: 'école', home: 'maison/chez soi', house: 'maison',
  bus: 'bus', taxi: 'taxi', car: 'voiture', flight: 'vol', trip: 'voyage', trips: 'voyages',
  road: 'route', reservation: 'réservation', online: 'en ligne',

  // nourriture / achats
  coffee: 'café', coffees: 'cafés', tea: 'thé', milk: 'lait', food: 'nourriture', spicy: 'épicé(e)',
  pizza: 'pizza', apple: 'pomme', dinner: 'dîner', shoes: 'chaussures', shirt: 'chemise', jacket: 'veste',
  clothes: 'vêtements', receipt: 'ticket de caisse', sale: 'solde/promo', groceries: 'courses',
  table: 'table', tip: 'pourboire', expensive: 'cher/chère', cheap: 'pas cher', generous: 'généreux(se)',

  // travail / social
  job: 'travail/poste', project: 'projet', client: 'client', clients: 'clients', customer: 'client',
  complaints: 'réclamations', budget: 'budget', email: 'email', contract: 'contrat', details: 'détails',
  mistakes: 'erreurs', useful: 'utile', friend: 'ami(e)', coworkers: 'collègues', neighbors: 'voisins',
  party: 'fête', parties: 'fêtes', people: 'personnes/gens', name: 'nom/prénom', student: 'étudiant(e)',
  english: 'anglais', french: 'français', music: 'musique', phone: 'téléphone', kids: 'enfants',
  children: 'enfants', sister: 'sœur', driver: 'chauffeur/euse', person: 'personne',

  // mots restants
  new: 'nouveau/nouvelle', small: 'petit(e)', big: 'grand(e)', good: 'bon(ne)', nice: 'sympa/gentil(le)',
  awesome: 'génial(e)', great: 'super', free: 'gratuit / libre', feel: 'ressentir', know: 'savoir',
  place: 'endroit', places: 'endroits', rush: 'précipitation / no rush = pas de panique',
  happens: 'arrive (se produit)', everyone: 'tout le monde', everything: 'tout',
  hurry: 'précipitation / in a hurry = pressé', late: 'en retard', lost: 'perdu(e)',
  grab: 'attraper/prendre vite', meantime: 'entre-temps', nearest: 'le/la plus proche',
  pharmacy: 'pharmacie', routines: 'habitudes', question: 'question', answer: 'réponse',
  easy: 'facile', have: 'avoir',
}
