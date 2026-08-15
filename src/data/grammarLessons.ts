import type { GrammarLesson } from '../types'

// Brique "Bases" : contrairement aux mots/expressions de data/words.ts, ces
// leçons EXPLIQUENT la règle avant de faire pratiquer, pour une personne qui
// démarre à zéro. Chaque leçon a : une explication courte, un tableau propre
// pour les listes (formes, pronoms...), des exemples audio, et 5 exercices.
export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: 'g001',
    icon: '🙋',
    title: 'Les pronoms',
    subtitle: 'I, you, he, she...',
    explanationBody: [
      "En anglais, on ne peut jamais enlever le sujet d'une phrase, même quand c'est évident. Contrairement au français où la terminaison du verbe donne parfois l'info, les verbes anglais changent très peu — il faut donc toujours dire qui fait l'action.",
      '"You" sert à la fois pour "tu" et "vous" — il n\'y a pas de distinction en anglais. Et "I" (je) s\'écrit toujours avec une majuscule, même au milieu d\'une phrase.',
    ],
    table: {
      headers: ['Anglais', 'Français'],
      rows: [
        { en: 'I', fr: 'je' },
        { en: 'you', fr: 'tu / vous' },
        { en: 'he', fr: 'il' },
        { en: 'she', fr: 'elle' },
        { en: 'it', fr: 'il / elle (objet, animal)' },
        { en: 'we', fr: 'nous' },
        { en: 'they', fr: 'ils / elles' },
      ],
    },
    examples: [
      { en: 'I am happy.', fr: 'Je suis content(e).' },
      { en: 'She is my sister.', fr: "C'est ma sœur." },
      { en: 'They live in Boston.', fr: 'Ils vivent à Boston.' },
    ],
    exercises: [
      { id: 'g001e1', prompt: 'Comment dit-on "elle" en anglais ?', options: ['he', 'she', 'it'], answer: 'she', explanation: '"she" est réservé aux personnes de sexe féminin.' },
      { id: 'g001e2', prompt: '___ am from France.', promptFr: 'Complète avec le pronom "je"', options: ['I', 'You', 'It'], answer: 'I', explanation: '"I" (je) s\'écrit toujours avec une majuscule en anglais.' },
      { id: 'g001e3', prompt: 'Comment dit-on "ils" ou "elles" en anglais ?', options: ['we', 'they', 'you'], answer: 'they', explanation: '"they" s\'utilise pour plusieurs personnes ou choses, sans distinction de genre.' },
      { id: 'g001e4', prompt: 'Comment dit-on "nous" en anglais ?', options: ['we', 'they', 'you'], answer: 'we', explanation: '"we" = nous, pour parler d\'un groupe qui inclut la personne qui parle.' },
      { id: 'g001e5', prompt: 'Quel pronom utiliser pour un objet ou un animal ?', options: ['it', 'he', 'they'], answer: 'it', explanation: '"it" s\'utilise pour les choses et les animaux (sauf animaux de compagnie qu\'on personnifie parfois).' },
    ],
  },
  {
    id: 'g002',
    icon: '🌟',
    title: 'Le verbe "to be"',
    subtitle: 'am / is / are',
    explanationBody: [
      '"To be" veut dire "être". C\'est le verbe le plus utilisé en anglais, pour décrire un état, une identité, une caractéristique — et c\'est le seul verbe anglais qui change autant de forme selon le pronom.',
    ],
    table: {
      headers: ['Pronom', 'Forme de "to be"'],
      rows: [
        { en: 'I', fr: "am (I'm)" },
        { en: 'you', fr: "are (you're)" },
        { en: 'he / she / it', fr: "is (he's / she's / it's)" },
        { en: 'we', fr: "are (we're)" },
        { en: 'they', fr: "are (they're)" },
      ],
    },
    examples: [
      { en: 'I am a student.', fr: 'Je suis étudiant(e).' },
      { en: 'He is tired.', fr: 'Il est fatigué.' },
      { en: 'We are ready.', fr: 'On est prêts.' },
    ],
    exercises: [
      { id: 'g002e1', prompt: 'I ___ happy.', options: ['am', 'is', 'are'], answer: 'am', explanation: 'Avec "I", on utilise toujours "am".' },
      { id: 'g002e2', prompt: 'She ___ nice.', options: ['am', 'is', 'are'], answer: 'is', explanation: 'Avec he/she/it, on utilise "is".' },
      { id: 'g002e3', prompt: 'They ___ hungry.', options: ['am', 'is', 'are'], answer: 'are', explanation: 'Avec we/you/they, on utilise "are".' },
      { id: 'g002e4', prompt: 'We ___ ready.', options: ['am', 'is', 'are'], answer: 'are', explanation: 'Avec "we", on utilise "are".' },
      { id: 'g002e5', prompt: 'It ___ cold today.', options: ['am', 'is', 'are'], answer: 'is', explanation: 'Avec "it", on utilise "is".' },
    ],
  },
  {
    id: 'g003',
    icon: '🧩',
    title: "L'ordre des mots",
    subtitle: 'Sujet + verbe + reste',
    explanationBody: [
      "En anglais, l'ordre des mots est presque toujours le même : Sujet, puis Verbe, puis le reste (complément). Contrairement au français, on ne peut presque jamais changer cet ordre.",
      "Autre règle importante : l'adjectif se place AVANT le nom, jamais après. \"a red car\" (une voiture rouge), pas \"a car red\".",
    ],
    examples: [
      { en: 'I eat an apple.', fr: 'Je mange une pomme.' },
      { en: 'She has a big house.', fr: 'Elle a une grande maison.' },
      { en: 'He wants a coffee.', fr: 'Il veut un café.' },
    ],
    exercises: [
      { id: 'g003e1', prompt: 'Quel ordre est correct ?', options: ['I an apple eat', 'I eat an apple', 'Eat I an apple'], answer: 'I eat an apple', explanation: "L'ordre est toujours Sujet + Verbe + le reste." },
      { id: 'g003e2', prompt: 'Comment dit-on "une voiture rouge" ?', options: ['a car red', 'a red car', 'red a car'], answer: 'a red car', explanation: "L'adjectif (red) se place avant le nom (car), toujours." },
      { id: 'g003e3', prompt: 'Quel ordre est correct ?', options: ['He a coffee wants', 'Wants he a coffee', 'He wants a coffee'], answer: 'He wants a coffee', explanation: "Sujet (he) + verbe (wants) + complément (a coffee)." },
      { id: 'g003e4', prompt: 'Quel ordre est correct ?', options: ['She has a big house', 'She has a house big', 'Has she a big house'], answer: 'She has a big house', explanation: "L'adjectif (big) reste avant le nom (house), et le sujet vient toujours en premier." },
      { id: 'g003e5', prompt: 'Comment dit-on "un petit chat" ?', options: ['a cat small', 'a small cat'], answer: 'a small cat', explanation: "L'adjectif (small) se place avant le nom (cat)." },
    ],
  },
  {
    id: 'g004',
    icon: '🔁',
    title: 'Le présent simple',
    subtitle: 'Le "s" avec he / she / it',
    explanationBody: [
      "Le présent simple sert à parler d'habitudes ou de faits. La conjugaison est presque toujours la même, SAUF avec he/she/it, où on ajoute un \"s\" au verbe.",
      'Ce petit "s" est une des erreurs les plus fréquentes à l\'oral chez les francophones : facile à oublier, mais ça se remarque tout de suite.',
    ],
    table: {
      headers: ['Sujet', 'Forme du verbe'],
      rows: [
        { en: 'I / you / we / they', fr: 'forme de base (like, work, want...)' },
        { en: 'he / she / it', fr: 'forme + s (likes, works, wants...)' },
      ],
    },
    examples: [
      { en: 'I like tea.', fr: "J'aime le thé." },
      { en: 'She likes tea.', fr: 'Elle aime le thé.' },
      { en: 'He works in Paris.', fr: 'Il travaille à Paris.' },
    ],
    exercises: [
      { id: 'g004e1', prompt: 'She ___ (like) music.', options: ['like', 'likes', 'liking'], answer: 'likes', explanation: 'Avec "she", on ajoute un "s" au verbe.' },
      { id: 'g004e2', prompt: 'I ___ (want) a coffee.', options: ['want', 'wants', 'wanting'], answer: 'want', explanation: 'Avec "I", pas de "s" — c\'est la forme de base.' },
      { id: 'g004e3', prompt: 'He ___ (work) in Paris.', options: ['work', 'works', 'working'], answer: 'works', explanation: 'Avec "he", on ajoute un "s" au verbe.' },
      { id: 'g004e4', prompt: 'We ___ (want) pizza.', options: ['want', 'wants', 'wanting'], answer: 'want', explanation: 'Avec "we", pas de "s" — c\'est la forme de base.' },
      { id: 'g004e5', prompt: 'It ___ (work) well.', options: ['work', 'works', 'working'], answer: 'works', explanation: 'Avec "it", on ajoute un "s" au verbe.' },
    ],
  },
  {
    id: 'g005',
    icon: '❓',
    title: 'Poser une question',
    subtitle: 'Do / Does',
    explanationBody: [
      "Pour poser une question au présent simple, on ajoute \"Do\" ou \"Does\" AVANT le sujet, et le verbe reste à sa forme de base — sans le \"s\", même avec he/she/it, puisque le \"s\" est déjà porté par \"Does\".",
    ],
    table: {
      headers: ['Sujet', 'Mot à ajouter'],
      rows: [
        { en: 'I / you / we / they', fr: 'Do' },
        { en: 'he / she / it', fr: 'Does' },
      ],
    },
    examples: [
      { en: 'Do you speak English?', fr: 'Tu parles anglais ?' },
      { en: 'Does she live here?', fr: 'Elle habite ici ?' },
      { en: 'Do they know?', fr: 'Ils savent ?' },
    ],
    exercises: [
      { id: 'g005e1', prompt: '___ you like coffee?', options: ['Do', 'Does', 'Are'], answer: 'Do', explanation: 'Avec "you", on utilise "Do".' },
      { id: 'g005e2', prompt: '___ she speak English?', options: ['Do', 'Does', 'Is'], answer: 'Does', explanation: 'Avec "she", on utilise "Does".' },
      { id: 'g005e3', prompt: 'Does he ___ (like) pizza?', options: ['like', 'likes', 'liking'], answer: 'like', explanation: 'Après "Does", le verbe reste à sa forme de base, sans "s".' },
      { id: 'g005e4', prompt: '___ they live here?', options: ['Do', 'Does', 'Is'], answer: 'Do', explanation: 'Avec "they", on utilise "Do".' },
      { id: 'g005e5', prompt: '___ it work well?', options: ['Do', 'Does', 'Are'], answer: 'Does', explanation: 'Avec "it", on utilise "Does".' },
    ],
  },
  {
    id: 'g006',
    icon: '🚫',
    title: 'La négation',
    subtitle: "don't / doesn't",
    explanationBody: [
      "Pour dire qu'on ne fait pas quelque chose au présent, on utilise \"don't\" ou \"doesn't\" + le verbe à sa forme de base — comme pour les questions, le verbe ne prend jamais de \"s\" après \"doesn't\".",
      "\"don't\" est la version courte de \"do not\", et \"doesn't\" de \"does not\". À l'oral, on utilise presque toujours la version courte.",
    ],
    table: {
      headers: ['Sujet', 'Négation'],
      rows: [
        { en: 'I / you / we / they', fr: "don't" },
        { en: 'he / she / it', fr: "doesn't" },
      ],
    },
    examples: [
      { en: "I don't like coffee.", fr: "Je n'aime pas le café." },
      { en: "She doesn't work on Sundays.", fr: 'Elle ne travaille pas le dimanche.' },
      { en: "They don't live here.", fr: "Ils n'habitent pas ici." },
    ],
    exercises: [
      { id: 'g006e1', prompt: "I ___ like tea.", options: ["don't", "doesn't", 'not'], answer: "don't", explanation: 'Avec "I", on utilise "don\'t".' },
      { id: 'g006e2', prompt: "He ___ speak French.", options: ["don't", "doesn't", 'not'], answer: "doesn't", explanation: 'Avec "he", on utilise "doesn\'t".' },
      { id: 'g006e3', prompt: "She doesn't ___ (like) spicy food.", options: ['like', 'likes', 'liking'], answer: 'like', explanation: 'Après "doesn\'t", le verbe reste à sa forme de base, sans "s".' },
      { id: 'g006e4', prompt: "We ___ know him.", options: ["don't", "doesn't", 'not'], answer: "don't", explanation: 'Avec "we", on utilise "don\'t".' },
      { id: 'g006e5', prompt: "It ___ work.", options: ["don't", "doesn't", 'not'], answer: "doesn't", explanation: 'Avec "it", on utilise "doesn\'t".' },
    ],
  },
  {
    id: 'g007',
    icon: '👜',
    title: 'Les possessifs',
    subtitle: "my, your, his, her... + 's",
    explanationBody: [
      "Pour dire à qui appartient quelque chose, on utilise un adjectif possessif AVANT le nom.",
      "Attention : contrairement au français, le possessif anglais s'accorde avec la PERSONNE qui possède, pas avec l'objet possédé. \"his car\" ou \"her car\" — la voiture reste \"car\", seul le possessif change selon qui la possède.",
      "Pour dire que quelque chose appartient à quelqu'un dont on connaît le nom, on ajoute 's après le nom : \"Sarah's phone\" (le téléphone de Sarah).",
    ],
    table: {
      headers: ['Pronom', 'Possessif'],
      rows: [
        { en: 'I', fr: 'my (mon/ma/mes)' },
        { en: 'you', fr: 'your (ton/ta/tes, votre/vos)' },
        { en: 'he', fr: 'his (son/sa/ses, à lui)' },
        { en: 'she', fr: 'her (son/sa/ses, à elle)' },
        { en: 'we', fr: 'our (notre/nos)' },
        { en: 'they', fr: 'their (leur/leurs)' },
      ],
    },
    examples: [
      { en: 'This is my phone.', fr: 'Voici mon téléphone.' },
      { en: 'He loves his job.', fr: 'Il adore son travail.' },
      { en: "That's Sarah's car.", fr: "C'est la voiture de Sarah." },
    ],
    exercises: [
      { id: 'g007e1', prompt: 'Comment dit-on "son travail" (à elle) ?', options: ['his job', 'her job', 'its job'], answer: 'her job', explanation: '"her" s\'utilise quand la possession est à une femme.' },
      { id: 'g007e2', prompt: 'This is ___ (à moi) car.', options: ['my', 'your', 'his'], answer: 'my', explanation: '"my" = mon/ma/mes, pour parler de ce qui est à soi.' },
      { id: 'g007e3', prompt: 'Comment dit-on "le sac de Tom" ?', options: ["Tom's bag", 'Tom bag', 'The bag Tom'], answer: "Tom's bag", explanation: "On ajoute 's après le nom de la personne qui possède." },
      { id: 'g007e4', prompt: 'This is ___ (à eux) house.', options: ['their', 'his', 'her'], answer: 'their', explanation: '"their" = leur/leurs, pour parler de ce qui appartient à plusieurs personnes.' },
      { id: 'g007e5', prompt: 'We love ___ (à nous) city.', options: ['our', 'your', 'its'], answer: 'our', explanation: '"our" = notre/nos, pour parler de ce qui est à "nous".' },
    ],
  },
  {
    id: 'g008',
    icon: '🔢',
    title: 'Le pluriel',
    subtitle: '-s, -es, et les irréguliers',
    explanationBody: [
      "En général, on forme le pluriel en ajoutant un \"s\" : a book -> books, a car -> cars.",
      "Quand le mot se termine par -s, -x, -ch, -sh, on ajoute \"-es\" à la place : a box -> boxes, a sandwich -> sandwiches.",
      "Quelques pluriels sont irréguliers et à connaître par cœur.",
    ],
    table: {
      headers: ['Singulier', 'Pluriel'],
      rows: [
        { en: 'a car', fr: 'cars' },
        { en: 'a box', fr: 'boxes' },
        { en: 'a child', fr: 'children' },
        { en: 'a person', fr: 'people' },
        { en: 'a man', fr: 'men' },
        { en: 'a woman', fr: 'women' },
      ],
    },
    examples: [
      { en: 'I have two books.', fr: "J'ai deux livres." },
      { en: 'She has three boxes.', fr: 'Elle a trois boîtes.' },
      { en: 'There are five people here.', fr: 'Il y a cinq personnes ici.' },
    ],
    exercises: [
      { id: 'g008e1', prompt: 'Comment dit-on "des voitures" ?', options: ['cars', 'cares', 'carss'], answer: 'cars', explanation: 'Pluriel régulier : on ajoute simplement "s".' },
      { id: 'g008e2', prompt: 'Comment dit-on "des boîtes" ?', options: ['boxs', 'boxes', 'box'], answer: 'boxes', explanation: 'Les mots en "-x" prennent "-es" au pluriel.' },
      { id: 'g008e3', prompt: 'Comment dit-on "des enfants" ?', options: ['childs', 'childrens', 'children'], answer: 'children', explanation: '"child" a un pluriel irrégulier : "children", à apprendre par cœur.' },
      { id: 'g008e4', prompt: 'Comment dit-on "des personnes" ?', options: ['persons', 'people', 'peoples'], answer: 'people', explanation: '"person" a un pluriel irrégulier : "people".' },
      { id: 'g008e5', prompt: 'Comment dit-on "des hommes" ?', options: ['mans', 'men', 'mens'], answer: 'men', explanation: '"man" a un pluriel irrégulier : "men".' },
    ],
  },
  {
    id: 'g009',
    icon: '❔',
    title: 'Les mots interrogatifs',
    subtitle: 'what, where, when, who...',
    explanationBody: [
      "Pour poser une question ouverte (pas juste oui/non), on commence par un mot interrogatif.",
      "Ce mot se place TOUJOURS en premier dans la phrase, suivi de la structure question (do/does + sujet + verbe, ou is/are + sujet).",
    ],
    table: {
      headers: ['Mot', 'Sens'],
      rows: [
        { en: 'what', fr: 'quoi / quel' },
        { en: 'where', fr: 'où' },
        { en: 'when', fr: 'quand' },
        { en: 'who', fr: 'qui' },
        { en: 'why', fr: 'pourquoi' },
        { en: 'how', fr: 'comment' },
      ],
    },
    examples: [
      { en: 'What is your name?', fr: "Comment tu t'appelles ?" },
      { en: 'Where do you live?', fr: 'Où habites-tu ?' },
      { en: 'Why are you late?', fr: 'Pourquoi es-tu en retard ?' },
    ],
    exercises: [
      { id: 'g009e1', prompt: '___ is your name?', options: ['What', 'Where', 'Who'], answer: 'What', explanation: '"What" s\'utilise pour demander une information (ici, le nom).' },
      { id: 'g009e2', prompt: '___ do you live?', promptFr: 'Tu veux demander "où" quelqu\'un habite', options: ['When', 'Where', 'Why'], answer: 'Where', explanation: '"Where" sert à demander un lieu.' },
      { id: 'g009e3', prompt: '___ are you late?', promptFr: 'Tu veux demander "pourquoi"', options: ['How', 'Who', 'Why'], answer: 'Why', explanation: '"Why" sert à demander une raison.' },
      { id: 'g009e4', prompt: '___ is she?', promptFr: 'Tu veux demander "qui" c\'est', options: ['Who', 'What', 'Where'], answer: 'Who', explanation: '"Who" sert à demander une identité, une personne.' },
      { id: 'g009e5', prompt: '___ do you do it?', promptFr: 'Tu veux demander "comment"', options: ['How', 'When', 'Why'], answer: 'How', explanation: '"How" sert à demander la manière de faire quelque chose.' },
    ],
  },
]

export function getLessonById(id: string): GrammarLesson | undefined {
  return GRAMMAR_LESSONS.find((l) => l.id === id)
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Rappel mélangé : reprend TOUS les exercices des leçons déjà terminées
 * (pas juste un petit échantillon), mélangés dans le désordre, pour que
 * chaque règle apprise repasse vraiment en revue.
 */
export function generateGrammarRecap(completedLessonIds: string[]) {
  const pool = GRAMMAR_LESSONS.filter((l) => completedLessonIds.includes(l.id)).flatMap((l) => l.exercises)
  return shuffle(pool)
}
