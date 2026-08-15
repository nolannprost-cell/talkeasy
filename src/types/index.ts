// Types partagés de l'application. Regroupés ici pour que la logique
// pédagogique (services/) et l'UI (components/, pages/) parlent le même langage.

export type Level = 'beginner' | 'elementary' | 'intermediate'

export type WordCategory =
  | 'daily'
  | 'travel'
  | 'work'
  | 'social'
  | 'shopping'
  | 'usa'

/** Une entrée de vocabulaire (mot ou expression) suivie par le système de révision. */
export interface WordEntry {
  id: string
  en: string
  fr: string
  /** Phrase d'exemple naturelle, utilisée dans les exercices en contexte. */
  example: string
  exampleFr: string
  /** Deuxième phrase, différente, utilisée pour varier (ex: session de renfort). */
  example2?: string
  example2Fr?: string
  category: WordCategory
  level: Level
  tags?: string[]
  /** true = mot mis de côté pour l'instant (ex: "used to" n'existe qu'au passé). */
  excludeForNow?: boolean
}

/** Statistiques de progression pour un mot précis, propres à l'utilisatrice. */
export interface WordProgress {
  wordId: string
  seenCount: number
  correctCount: number
  wrongCount: number
  /** Temps de réponse moyen en ms, indicatif — sert juste à repérer les hésitations. */
  avgResponseTimeMs: number
  lastSeen: string | null // ISO date
  /** Score de maîtrise 0–100. Voir services/srs.ts pour la logique. */
  masteryScore: number
  /** Types de contextes déjà réussis (recall, fill-blank, listening, production...). */
  contextsUsed: ExerciseKind[]
  /** Date ISO à partir de laquelle ce mot doit revenir en révision. */
  dueDate: string
}

export type ExerciseKind =
  | 'recall-en' // mot FR -> retrouver l'anglais
  | 'recall-fr' // mot EN -> retrouver le français
  | 'fill-blank' // compléter une phrase
  | 'listening' // comprendre une phrase orale
  | 'production' // produire une phrase avec le mot

export interface Exercise {
  id: string
  kind: ExerciseKind
  wordId: string
  prompt: string
  promptFr?: string
  /** Pour les QCM : les choix proposés (dont la bonne réponse). */
  options?: string[]
  answer: string
  hint?: string
  /** Explication affichée quand la réponse est fausse : pourquoi, avec un exemple. */
  explanation?: string
  audioText?: string // texte à envoyer au TTS / lecteur audio
}

export type ActivityId = 'three-minutes' | 'listen' | 'talk' | 'music' | 'review'

export interface ListenScenario {
  id: string
  level: Level
  title: string
  titleFr: string
  setup: string // contexte en français, ex: "Vous venez d'arriver à l'hôtel."
  lines: { speaker: string; text: string }[]
  comprehensionQuestion: { prompt: string; options: string[]; answer: string }
  targetExpression: { en: string; fr: string }
  reuseSentenceStarter?: string
}

export interface ConversationScenario {
  id: string
  level: Level
  title: string
  titleFr: string
  icon: string
  systemContext: string // décrit le rôle du personnage IA pour le service IA
  openingLine: string
  /** Mots-clés que l'on espère voir réutilisés, pour le feedback final. */
  targetWords: string[]
}

export interface ConversationTurn {
  role: 'user' | 'assistant'
  text: string
}

export interface ConversationFeedback {
  corrections: { original: string; corrected: string; explanation?: string }[]
  encouragement: string
}

export interface UserProfile {
  name: string
  level: Level
  interests: string[]
  goals: string[]
  createdAt: string
  lastOpenedAt: string
  totalSessions: number
  totalMinutesApprox: number
  /** Photo de profil, stockée en base64 (redimensionnée côté client). */
  photoDataUrl?: string
  /** Historique léger des activités faites, pour personnaliser sans culpabiliser. */
  activityLog: { activityId: ActivityId; date: string }[]
}

export interface GrammarExercise {
  id: string
  prompt: string
  promptFr?: string
  options?: string[]
  answer: string
  explanation: string
}

export interface GrammarLesson {
  id: string
  icon: string
  title: string
  subtitle: string
  explanationBody: string[]
  table?: { headers: [string, string]; rows: { en: string; fr: string }[] }
  examples: { en: string; fr: string }[]
  exercises: GrammarExercise[]
}

export interface SongTopic {
  id: string
  songQuery: string
  createdAt: string
}
