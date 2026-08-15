import type { ListenScenario } from '../types'

// Chaque scénario simule une situation orale courte. `lines` sert de script :
// pour le MVP il est lu par la synthèse vocale du navigateur (services/tts.ts),
// mais la structure permet de brancher plus tard de vrais fichiers audio ou une API TTS.
export const LISTEN_SCENARIOS: ListenScenario[] = [
  {
    id: 'l001',
    level: 'beginner',
    title: 'At the hotel',
    titleFr: "À l'hôtel",
    setup: "Vous venez d'arriver à la réception de votre hôtel à New York.",
    lines: [
      { speaker: 'Receptionist', text: 'Hi! Do you have a reservation?' },
      { speaker: 'You (imagine)', text: "Yes, it's under the name Dubois." },
      { speaker: 'Receptionist', text: 'Perfect, here is your key. Breakfast is downstairs.' },
    ],
    comprehensionQuestion: {
      prompt: 'What does the receptionist ask first?',
      options: ['If you have a reservation', 'If you want breakfast', 'How long you are staying'],
      answer: 'If you have a reservation',
    },
    targetExpression: { en: 'Do you have a reservation?', fr: 'Avez-vous une réservation ?' },
    reuseSentenceStarter: 'Imagine you arrive at a restaurant. Ask the same type of question:',
  },
  {
    id: 'l002',
    level: 'beginner',
    title: 'Ordering coffee',
    titleFr: 'Commander un café',
    setup: "Vous entrez dans un café à San Francisco.",
    lines: [
      { speaker: 'Barista', text: "Hi, what can I get you?" },
      { speaker: 'You (imagine)', text: "A medium latte, please." },
      { speaker: 'Barista', text: 'For here or to go?' },
    ],
    comprehensionQuestion: {
      prompt: 'What is the barista asking at the end?',
      options: ['If you want it here or to take away', 'If you want sugar', 'What size you want'],
      answer: 'If you want it here or to take away',
    },
    targetExpression: { en: 'For here or to go?', fr: 'Sur place ou à emporter ?' },
  },
  {
    id: 'l003',
    level: 'elementary',
    title: 'Asking for directions',
    titleFr: 'Demander son chemin',
    setup: 'Vous êtes perdue près de Union Square.',
    lines: [
      { speaker: 'You (imagine)', text: 'Excuse me, how do I get to the subway station?' },
      { speaker: 'Stranger', text: "Go straight ahead, then turn left at the pharmacy." },
      { speaker: 'You (imagine)', text: 'Thank you so much!' },
    ],
    comprehensionQuestion: {
      prompt: 'Where should you turn left?',
      options: ['At the pharmacy', 'At the hotel', 'At the station'],
      answer: 'At the pharmacy',
    },
    targetExpression: { en: 'Go straight ahead', fr: 'Allez tout droit' },
    reuseSentenceStarter: 'Give directions to your place using "go straight ahead":',
  },
  {
    id: 'l004',
    level: 'elementary',
    title: 'Small talk with a coworker',
    titleFr: 'Discuter avec un collègue',
    setup: "Vous croisez un collègue américain dans le couloir.",
    lines: [
      { speaker: 'Coworker', text: "Hey! How was your weekend?" },
      { speaker: 'You (imagine)', text: "Pretty good, I just hung out at home." },
      { speaker: 'Coworker', text: "Nice, sounds relaxing." },
    ],
    comprehensionQuestion: {
      prompt: 'What does "hung out at home" mean?',
      options: ['Passer du temps à la maison', 'Faire le ménage', 'Travailler tard'],
      answer: 'Passer du temps à la maison',
    },
    targetExpression: { en: 'How was your weekend?', fr: 'Comment était ton week-end ?' },
  },
  {
    id: 'l005',
    level: 'intermediate',
    title: 'A delayed meeting',
    titleFr: 'Une réunion retardée',
    setup: 'Un collègue vous prévient par téléphone qu\'il sera en retard.',
    lines: [
      { speaker: 'Colleague', text: "Sorry, I'm running late, traffic is crazy." },
      { speaker: 'You (imagine)', text: "No worries, take your time." },
      { speaker: 'Colleague', text: "I'll be there in ten minutes." },
    ],
    comprehensionQuestion: {
      prompt: 'Why is the colleague late?',
      options: ['Traffic', 'They overslept', 'The meeting moved'],
      answer: 'Traffic',
    },
    targetExpression: { en: "I'm running late", fr: 'Je suis en retard' },
    reuseSentenceStarter: 'Text a friend to say you are running late:',
  },
  {
    id: 'l006',
    level: 'intermediate',
    title: 'Returning an item',
    titleFr: 'Rapporter un article au magasin',
    setup: 'Vous rapportez un pull acheté la veille.',
    lines: [
      { speaker: 'You (imagine)', text: "Hi, I'd like to return this sweater." },
      { speaker: 'Clerk', text: "No problem, do you have the receipt?" },
      { speaker: 'You (imagine)', text: "Yes, here it is." },
    ],
    comprehensionQuestion: {
      prompt: 'What does the clerk ask for?',
      options: ['The receipt', 'A different size', 'Your ID'],
      answer: 'The receipt',
    },
    targetExpression: { en: "I'd like to return this", fr: 'Je voudrais rapporter ceci' },
  },
]
