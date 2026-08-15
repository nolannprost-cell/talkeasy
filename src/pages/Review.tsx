import { useMemo, useRef, useState } from 'react'
import TopBar from '../components/TopBar'
import ExerciseCard from '../components/ExerciseCard'
import ProgressDots from '../components/ProgressDots'
import SessionComplete from '../components/SessionComplete'
import { generateReviewSession } from '../services/activityGenerator'
import { recordAnswer, isMastered } from '../services/srs'
import { loadAllProgress, logActivity } from '../services/storage'
import { getWordById } from '../data/words'
import type { WordProgress } from '../types'

type ViewMode = 'list' | 'session'

interface WordRow {
  progress: WordProgress
  en: string
  fr: string
}

export default function Review() {
  const [mode, setMode] = useState<ViewMode>('list')
  const [exercises, setExercises] = useState(() => generateReviewSession())
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const loggedRef = useRef(false)

  const rows = useMemo<WordRow[]>(() => {
    const all = loadAllProgress()
    return Object.values(all)
      .map((progress) => {
        const word = getWordById(progress.wordId)
        if (!word) return null
        return { progress, en: word.en, fr: word.fr }
      })
      .filter((r): r is WordRow => r !== null)
      .sort((a, b) => a.progress.masteryScore - b.progress.masteryScore)
  }, [mode]) // recalculé à chaque retour sur la liste

  const missed = rows.filter((r) => r.progress.wrongCount > r.progress.correctCount)
  const inProgress = rows.filter((r) => !isMastered(r.progress) && r.progress.wrongCount <= r.progress.correctCount)
  const mastered = rows.filter((r) => isMastered(r.progress))

  function startSession() {
    setExercises(generateReviewSession())
    setIndex(0)
    setCorrectCount(0)
    loggedRef.current = false
    setMode('session')
  }

  const current = exercises[index]
  const done = index >= exercises.length

  function handleAnswered(correct: boolean, responseTimeMs: number) {
    recordAnswer(current.wordId, current.kind, correct, responseTimeMs)
    if (correct) setCorrectCount((c) => c + 1)
    setIndex((i) => i + 1)
  }

  if (done && !loggedRef.current) {
    loggedRef.current = true
    logActivity('review', 2)
  }

  if (mode === 'session') {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col">
        <TopBar title="Review" onBack={() => setMode('list')} />
        {!done && <ProgressDots total={exercises.length} current={index} />}
        <div className="flex-1 flex flex-col justify-center px-5 pb-8">
          {done ? (
            <SessionComplete correctCount={correctCount} totalCount={exercises.length} />
          ) : (
            <ExerciseCard key={current.id} exercise={current} onAnswered={handleAnswered} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col pb-10">
      <TopBar title="Review" />
      <div className="px-5 flex flex-col gap-5">
        {exercises.length > 0 ? (
          <button
            onClick={startSession}
            className="ticket-card px-5 py-4 flex items-center justify-between gap-3 active:scale-[0.98] transition-transform"
          >
            <div className="text-left">
              <div className="font-display font-semibold text-ink dark:text-cream">Commencer la révision</div>
              <div className="text-sm text-ink-soft dark:text-cream/70">{exercises.length} mots à retrouver</div>
            </div>
            <span className="text-2xl">🧠</span>
          </button>
        ) : (
          <div className="ticket-card px-5 py-6 flex flex-col items-center gap-2 text-center">
            <span className="text-3xl">🌤️</span>
            <p className="text-ink dark:text-cream font-display">Rien à revoir pour l'instant</p>
            <p className="text-sm text-ink-soft dark:text-cream/60">Fais un peu de "3 minutes" pour découvrir de nouveaux mots.</p>
          </div>
        )}

        {rows.length === 0 ? null : (
          <>
            {missed.length > 0 && (
              <WordSection title="Mots ratés" hint="Réponses fausses plus fréquentes que les bonnes" rows={missed} tone="rust" />
            )}
            {inProgress.length > 0 && (
              <WordSection title="Déjà vus, en cours" hint="Pas encore maîtrisés" rows={inProgress} tone="mustard" />
            )}
            {mastered.length > 0 && (
              <WordSection title="Maîtrisés" hint="Réussis dans plusieurs contextes différents" rows={mastered} tone="pine" />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function WordSection({
  title,
  hint,
  rows,
  tone,
}: {
  title: string
  hint: string
  rows: WordRow[]
  tone: 'rust' | 'mustard' | 'pine'
}) {
  const toneClass = { rust: 'text-rust', mustard: 'text-[#8a5f00] dark:text-mustard', pine: 'text-pine' }[tone]
  const dotClass = { rust: 'bg-rust', mustard: 'bg-mustard', pine: 'bg-pine' }[tone]

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <p className={`text-xs font-mono uppercase tracking-wide ${toneClass}`}>{title}</p>
        <span className="text-xs text-ink-soft dark:text-cream/50">{rows.length}</span>
      </div>
      <p className="text-xs text-ink-soft dark:text-cream/50 mb-2 -mt-1">{hint}</p>
      <div className="ticket-card divide-y divide-ink/5 dark:divide-cream/10">
        {rows.map((r) => (
          <div key={r.progress.wordId} className="flex items-center gap-3 px-4 py-3">
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotClass}`} />
            <div className="min-w-0 flex-1">
              <div className="text-ink dark:text-cream font-medium">{r.en}</div>
              <div className="text-xs text-ink-soft dark:text-cream/60">{r.fr}</div>
            </div>
            <span className="text-xs font-mono text-ink-soft dark:text-cream/50 shrink-0">
              {r.progress.masteryScore}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
