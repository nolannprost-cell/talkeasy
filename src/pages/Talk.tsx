import { useEffect, useRef, useState } from 'react'
import TopBar from '../components/TopBar'
import SpeakButton from '../components/SpeakButton'
import { CONVERSATIONS } from '../data/conversations'
import type { ConversationFeedback, ConversationScenario, ConversationTurn } from '../types'
import { getConversationFeedback, getConversationReply } from '../services/aiService'
import { logActivity } from '../services/storage'

const LEVEL_LABEL: Record<ConversationScenario['level'], string> = {
  beginner: 'Débutant',
  elementary: 'Facile',
  intermediate: 'Intermédiaire',
}

export default function Talk() {
  const [scenario, setScenario] = useState<ConversationScenario | null>(null)
  const [turns, setTurns] = useState<ConversationTurn[]>([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [feedback, setFeedback] = useState<ConversationFeedback | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [turns, thinking])

  function startScenario(s: ConversationScenario) {
    setScenario(s)
    setFeedback(null)
    setTurns([{ role: 'assistant', text: s.openingLine }])
  }

  async function sendMessage() {
    if (!scenario || !input.trim() || thinking) return
    const userTurn: ConversationTurn = { role: 'user', text: input.trim() }
    const nextTurns = [...turns, userTurn]
    setTurns(nextTurns)
    setInput('')
    setThinking(true)
    const reply = await getConversationReply(scenario, nextTurns)
    setTurns((t) => [...t, { role: 'assistant', text: reply }])
    setThinking(false)
  }

  async function endConversation() {
    if (!scenario) return
    setThinking(true)
    const fb = await getConversationFeedback(scenario, turns)
    setFeedback(fb)
    setThinking(false)
    logActivity('talk', 4)
  }

  const userTurnCount = turns.filter((t) => t.role === 'user').length

  if (!scenario) {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col pb-8">
        <TopBar title="Talk" />
        <div className="px-5 flex flex-col gap-3">
          <p className="text-sm text-ink-soft dark:text-cream/70 -mt-2 mb-1">Choisis une situation :</p>
          {CONVERSATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => startScenario(c)}
              className="ticket-card text-left px-5 py-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <span className="text-2xl">{c.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="font-display font-semibold text-ink dark:text-cream">{c.titleFr}</div>
                <div className="text-sm text-ink-soft dark:text-cream/70">{c.title}</div>
              </div>
              <span className="shrink-0 rounded-full bg-paper dark:bg-dusk px-2.5 py-1 text-xs font-mono text-ink-soft dark:text-cream/60">
                {LEVEL_LABEL[c.level]}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (feedback) {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col">
        <TopBar title="Talk" onBack={() => setScenario(null)} />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center animate-popIn">
          <div className="stamp h-20 w-20 text-4xl border-mustard text-mustard bg-mustard/10 animate-stampDown">💬</div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink dark:text-cream">
              {feedback.corrections.length > 0 ? '2 things to improve' : 'Great conversation!'}
            </h2>
            <p className="mt-1 text-sm text-ink-soft dark:text-cream/70">{feedback.encouragement}</p>
          </div>

          {feedback.corrections.length > 0 && (
            <div className="w-full flex flex-col gap-3 text-left">
              {feedback.corrections.map((c, i) => (
                <div key={i} className="ticket-card px-4 py-3">
                  <p className="text-sm text-rust line-through decoration-2">{c.original}</p>
                  <p className="text-sm font-semibold text-pine">{c.corrected}</p>
                  {c.explanation && <p className="mt-1 text-xs text-ink-soft dark:text-cream/60">{c.explanation}</p>}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setScenario(null)}
            className="rounded-full bg-ink dark:bg-cream text-cream dark:text-ink font-semibold px-8 py-3 active:scale-95 transition-transform"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col">
      <TopBar title={scenario.titleFr} onBack={() => setScenario(null)} />
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 flex flex-col gap-3 pb-3">
        {turns.map((turn, i) => (
          <div key={i} className={`flex ${turn.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 flex items-center gap-2 ${
                turn.role === 'user'
                  ? 'bg-coral text-white rounded-br-sm'
                  : 'bg-card dark:bg-dusk-card text-ink dark:text-cream rounded-bl-sm shadow-sm'
              }`}
            >
              <span className="text-sm">{turn.text}</span>
              {turn.role === 'assistant' && <SpeakButton text={turn.text} size="sm" />}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-card dark:bg-dusk-card px-4 py-2.5 text-ink-soft dark:text-cream/60 text-sm shadow-sm">
              ...
            </div>
          </div>
        )}
      </div>

      <div className="safe-bottom px-5 pt-3 flex flex-col gap-2">
        {userTurnCount >= 2 && (
          <button
            onClick={endConversation}
            disabled={thinking}
            className="self-center text-xs font-mono text-ink-soft dark:text-cream/50 underline underline-offset-2"
          >
            Terminer la conversation
          </button>
        )}
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Réponds en anglais..."
            disabled={thinking}
            className="flex-1 rounded-full border-2 border-ink/10 dark:border-cream/10 bg-paper dark:bg-dusk px-4 py-2.5 text-ink dark:text-cream outline-none focus:border-coral"
          />
          <button
            onClick={sendMessage}
            disabled={thinking || !input.trim()}
            aria-label="Envoyer"
            className="stamp h-11 w-11 shrink-0 border-coral bg-coral text-white disabled:opacity-40 active:scale-90 transition-transform"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
