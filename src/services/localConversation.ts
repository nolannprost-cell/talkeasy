import type { ConversationFeedback, ConversationScenario, ConversationTurn } from '../types'

// Mode "sans API" : le personnage réagit vraiment à ce que la personne écrit
// (pas juste une liste de phrases qui défilent dans l'ordre). Pour chaque
// scénario, on définit quelques "beats" : des mots-clés attendus à ce
// stade de la conversation, et la réplique qui va avec. Si rien ne
// correspond, le personnage le dit clairement et redemande, au lieu
// d'ignorer complètement ce qui a été écrit.

interface Beat {
  triggers: RegExp[]
  reply: string
}

const SCENARIO_BEATS: Record<string, Beat[]> = {
  c001: [
    { triggers: [/coffee|tea|water|soda|coke|juice|lemonade/i], reply: 'Got it! And are you eating in or taking it to go?' },
    { triggers: [/burger|fries|salad|sandwich|pizza|pancake/i], reply: 'Good choice. For here or to go?' },
    { triggers: [/to go|takeaway|take away/i], reply: "Sure, to go it is! That'll be ready in five minutes." },
    { triggers: [/here|stay|sit|eat here|for here/i], reply: 'Perfect, I\'ll bring it to your table.' },
    { triggers: [/no|nothing else|that'?s (it|all)/i], reply: 'Alright, coming right up!' },
  ],
  c002: [
    { triggers: [/reservation|book(ed|ing)?|dubois|smith|name is/i], reply: 'Let me check... found it! How many nights will you be staying?' },
    { triggers: [/one|two|three|\d+\s*night/i], reply: "Perfect, that's confirmed. Is this your first time in the city?" },
    { triggers: [/yes|first time|no|been here before/i], reply: 'Nice! Breakfast is from 7 to 10, and checkout is at 11am.' },
  ],
  c003: [
    { triggers: [/year|month|week|day|just arrived|new here|since|long time/i], reply: 'Oh nice! And what do you do for work?' },
    { triggers: [/work|job|engineer|teacher|student|nurse|manager|i am a|i'?m a/i], reply: "That's cool! Do you come here often?" },
    { triggers: [/yes|sometimes|often|no|never|first time/i], reply: 'Ha, small world. We should hang out sometime!' },
  ],
  c004: [
    { triggers: [/museum|station|subway|park|hotel|restaurant|street/i], reply: "Oh, that's easy — go straight ahead, then turn left. You can't miss it." },
    { triggers: [/thank|thanks/i], reply: 'No worries, take your time!' },
    { triggers: [/how (long|far)|minutes|walk/i], reply: "It's about ten minutes on foot, or a quick bus ride." },
  ],
  c005: [
    { triggers: [/work|busy|tired|meeting|deadline/i], reply: 'Ugh, that sounds exhausting. You need a break!' },
    { triggers: [/good|great|nice|fun|awesome|relax/i], reply: "Oh nice, sounds like a good day! What did you do exactly?" },
    { triggers: [/nothing|not much|same as usual/i], reply: 'Ha, sounds like me every day honestly.' },
  ],
  c006: [
    { triggers: [/\d{1,2}(st|nd|rd|th)?\s*(of\s*)?(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|next week|this weekend|tonight/i], reply: 'Perfect, and how many guests will it be?' },
    { triggers: [/one|two|three|four|\d+\s*(guest|people|person)/i], reply: "Great, I'll send you a confirmation email right away." },
  ],
  c007: [
    { triggers: [/deadline|friday|monday|next week/i], reply: "Yeah, I'm on it — I'll follow up with the team today." },
    { triggers: [/help|need|can you/i], reply: "Sure, happy to help. What do you need exactly?" },
  ],
  c008: [
    { triggers: [/delay|late|when|status|update/i], reply: "I understand — let me check and get back to you by end of day." },
    { triggers: [/thank|thanks|ok|okay|great/i], reply: "Of course. We'll keep you posted." },
  ],
}

const CONFUSION_TRIGGERS = /what do you mean|i don'?t understand|you'?re not answering|can you repeat|what\?|huh\?|say again|not answering/i

const ACK_POOL = ['Oh nice!', 'Got it!', 'I see!', 'Ah, interesting!', 'Cool!']
let ackIndex = 0

function lastAssistantMessage(history: ConversationTurn[]): string | null {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === 'assistant') return history[i].text
  }
  return null
}

export function getLocalReply(scenario: ConversationScenario, history: ConversationTurn[]): string {
  const lastUser = [...history].reverse().find((t) => t.role === 'user')
  if (!lastUser) return scenario.openingLine

  // La personne signale qu'elle n'a pas compris ou que le personnage ignore sa réponse :
  // on s'excuse et on reformule la dernière question au lieu d'enchaîner à l'aveugle.
  if (CONFUSION_TRIGGERS.test(lastUser.text)) {
    const previous = lastAssistantMessage(history.slice(0, -1))
    return previous ? `Sorry, let me rephrase: ${previous}` : "Sorry, could you say that again?"
  }

  const beats = SCENARIO_BEATS[scenario.id] ?? []
  const userTurnIndex = history.filter((t) => t.role === 'user').length - 1
  const beat = beats[userTurnIndex] ?? beats[beats.length - 1]

  if (beat && beat.triggers.some((t) => t.test(lastUser.text))) {
    return beat.reply
  }

  // Rien de reconnu : on le dit franchement plutôt que d'ignorer, et on redemande.
  const ack = ACK_POOL[ackIndex % ACK_POOL.length]
  ackIndex += 1
  const fallbackQuestion = beat?.reply ?? "Tell me more about that?"
  return `${ack} I'm not sure I got that — ${fallbackQuestion.charAt(0).toLowerCase()}${fallbackQuestion.slice(1)}`
}

interface Pattern {
  test: RegExp
  corrected: (match: RegExpMatchArray, original: string) => string
  explanation: string
}

// Quelques erreurs très fréquentes chez les francophones débutants/intermédiaires.
// Volontairement limité (le brief demande de ne pas surcharger de corrections).
const COMMON_PATTERNS: Pattern[] = [
  {
    test: /\byesterday i (go|eat|see|have|do|make|take)\b/i,
    corrected: (m) => `Yesterday I ${pastForm(m[1])}...`,
    explanation: 'Au passé, on utilise le prétérit (went, ate, saw...), pas le présent.',
  },
  {
    test: /\bi am agree\b/i,
    corrected: () => 'I agree',
    explanation: '"agree" est déjà un verbe en anglais, pas besoin de "am".',
  },
  {
    test: /\bi have (\d{1,2}) years?\b/i,
    corrected: (m) => `I am ${m[1]} years old`,
    explanation: 'Pour l\'âge en anglais, on utilise "to be", pas "to have".',
  },
  {
    test: /\bi am boring\b/i,
    corrected: () => 'I am bored',
    explanation: '"boring" décrit ce qui ennuie ; pour dire qu\'on s\'ennuie, on dit "bored".',
  },
]

function pastForm(verb: string): string {
  const map: Record<string, string> = { go: 'went', eat: 'ate', see: 'saw', have: 'had', do: 'did', make: 'made', take: 'took' }
  return map[verb.toLowerCase()] ?? verb
}

/** Analyse légère : on ne corrige jamais tout, seulement 1 à 3 points importants. */
export function getLocalFeedback(history: ConversationTurn[]): ConversationFeedback {
  const userLines = history.filter((t) => t.role === 'user').map((t) => t.text)
  const corrections: ConversationFeedback['corrections'] = []

  for (const line of userLines) {
    for (const pattern of COMMON_PATTERNS) {
      const match = line.match(pattern.test)
      if (match && pattern.explanation) {
        corrections.push({
          original: line,
          corrected: pattern.corrected(match, line),
          explanation: pattern.explanation,
        })
      }
      if (corrections.length >= 2) break
    }
    if (corrections.length >= 2) break
  }

  const encouragement =
    corrections.length === 0
      ? "Nice flow — you kept the conversation going naturally! Keep talking, that's how it clicks."
      : 'Good conversation overall! Just two small things to remember for next time.'

  return { corrections: corrections.slice(0, 3), encouragement }
}
