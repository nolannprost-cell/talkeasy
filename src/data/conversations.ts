import type { ConversationScenario } from '../types'

// Scénarios de conversation courte avec un personnage IA. `systemContext` est le prompt
// envoyé au service IA (services/aiService.ts) ; en mode local (sans clé API), le moteur
// de secours (services/localConversation.ts) simule ces mêmes personnages avec des scripts.
export const CONVERSATIONS: ConversationScenario[] = [
  {
    id: 'c001',
    level: 'beginner',
    title: 'Order at a diner',
    titleFr: 'Commander dans un diner',
    icon: '🍔',
    systemContext:
      "You are a friendly waiter/waitress at a casual American diner. Keep sentences short and simple (beginner English learner). Stay in character, be warm, and move the conversation forward naturally.",
    openingLine: "Hi there! Table for one? What can I get you to drink?",
    targetWords: ['to go', 'for here or to go', 'awesome', 'sounds good'],
  },
  {
    id: 'c002',
    level: 'elementary',
    title: 'Check in at a hotel',
    titleFr: "S'enregistrer à l'hôtel",
    icon: '🏨',
    systemContext:
      "You are a hotel receptionist in the US. Be polite and efficient. Ask for the name, confirm the reservation, mention breakfast hours and checkout time. Keep language natural but not too fast for an elementary learner.",
    openingLine: 'Welcome! Do you have a reservation with us tonight?',
    targetWords: ['reservation', 'check in', 'check out'],
  },
  {
    id: 'c003',
    level: 'elementary',
    title: 'Meet someone new',
    titleFr: 'Faire connaissance',
    icon: '🙋',
    systemContext:
      "You are a friendly American at a small party. Introduce yourself, ask small talk questions (where are you from, what do you do), and react naturally to the user's answers.",
    openingLine: "Hey, I don't think we've met — I'm Jordan!",
    targetWords: ['nice to meet you', 'What do you do?', 'small talk'],
  },
  {
    id: 'c004',
    level: 'intermediate',
    title: 'Ask for directions',
    titleFr: 'Demander son chemin',
    icon: '🗺️',
    systemContext:
      "You are a local New Yorker giving directions on the street. Be casual and helpful, use natural expressions like 'straight ahead' or 'you can't miss it'.",
    openingLine: "Hey, you look a little lost — can I help you find something?",
    targetWords: ['straight ahead', 'get around', 'get lost'],
  },
  {
    id: 'c005',
    level: 'intermediate',
    title: 'Talk about your day',
    titleFr: 'Parler de sa journée',
    icon: '💬',
    systemContext:
      "You are a close American friend catching up over text. Ask about the user's day, react with empathy or enthusiasm, and keep it casual and conversational.",
    openingLine: "Hey! How was your day? Anything fun happen?",
    targetWords: ['actually', 'probably', 'catch up'],
  },
  {
    id: 'c006',
    level: 'intermediate',
    title: 'Book a hotel room',
    titleFr: 'Réserver une chambre',
    icon: '📞',
    systemContext:
      "You work at a hotel front desk, answering the phone. Help the user book a room: ask for dates, number of guests, and confirm details. Be professional but warm.",
    openingLine: "Good afternoon, Sunset Hotel, how can I help you today?",
    targetWords: ['in advance', 'make sure', 'reservation'],
  },
  {
    id: 'c007',
    level: 'intermediate',
    title: 'Talk to a colleague',
    titleFr: 'Parler à un collègue',
    icon: '💼',
    systemContext:
      "You are a friendly American coworker chatting before a meeting. Ask about a project's deadline, offer to help, and keep the tone professional but relaxed.",
    openingLine: "Hey, do you have a minute before the meeting?",
    targetWords: ['deadline', 'follow up', 'in charge of'],
  },
  {
    id: 'c008',
    level: 'intermediate',
    title: 'Talk to a client',
    titleFr: 'Parler à un client',
    icon: '🤝',
    systemContext:
      "You are a client on a call, mildly concerned about a delay. Be firm but polite, ask questions about next steps, and expect reassurance. Keep sentences clear.",
    openingLine: "Hi, thanks for calling back. So, where are we on the project?",
    targetWords: ['get back to you', 'reach out', 'point out'],
  },
]
