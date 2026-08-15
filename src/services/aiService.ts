import type { ConversationFeedback, ConversationScenario, ConversationTurn } from '../types'
import { getLocalReply, getLocalFeedback } from './localConversation'

// Abstraction volontaire : le reste de l'app ne sait pas si les réponses viennent
// d'un vrai LLM ou du mode local. Pour brancher une vraie API plus tard :
//  1. déployer un petit backend/proxy qui détient la clé API (NE JAMAIS mettre de
//     clé secrète dans le frontend),
//  2. définir VITE_AI_PROXY_URL dans .env (ex: https://mon-backend.example.com/chat),
//  3. ce fichier basculera automatiquement dessus.

const PROXY_URL = import.meta.env.VITE_AI_PROXY_URL as string | undefined

export function isLiveAIEnabled(): boolean {
  return Boolean(PROXY_URL)
}

export async function getConversationReply(
  scenario: ConversationScenario,
  history: ConversationTurn[]
): Promise<string> {
  if (PROXY_URL) {
    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'reply', systemContext: scenario.systemContext, history }),
      })
      if (!res.ok) throw new Error(`AI proxy error ${res.status}`)
      const data = await res.json()
      return data.reply as string
    } catch (err) {
      console.warn('AI proxy unavailable, falling back to local conversation engine.', err)
      return getLocalReply(scenario, history)
    }
  }
  return getLocalReply(scenario, history)
}

export async function getConversationFeedback(
  scenario: ConversationScenario,
  history: ConversationTurn[]
): Promise<ConversationFeedback> {
  if (PROXY_URL) {
    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'feedback', systemContext: scenario.systemContext, history }),
      })
      if (!res.ok) throw new Error(`AI proxy error ${res.status}`)
      return (await res.json()) as ConversationFeedback
    } catch (err) {
      console.warn('AI proxy unavailable, falling back to local feedback engine.', err)
      return getLocalFeedback(history)
    }
  }
  return getLocalFeedback(history)
}
