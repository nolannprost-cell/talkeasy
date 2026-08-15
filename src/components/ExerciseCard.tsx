import { useEffect, useRef, useState } from 'react'
import type { Exercise } from '../types'
import SpeakButton from './SpeakButton'
import TappableSentence from './TappableSentence'

interface ExerciseCardProps {
  exercise: Exercise
  onAnswered: (correct: boolean, responseTimeMs: number) => void
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/[.,!?']/g, '')
}

const KIND_LABEL: Record<Exercise['kind'], string> = {
  'recall-en': 'Retrouve le mot',
  'recall-fr': 'Comprends le sens',
  'fill-blank': 'Complète la phrase',
  listening: 'Écoute et comprends',
  production: 'Traduis la phrase',
}

export default function ExerciseCard({ exercise, onAnswered }: ExerciseCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [textAnswer, setTextAnswer] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const [wrongElapsed, setWrongElapsed] = useState(0)
  const startRef = useRef(Date.now())
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    startRef.current = Date.now()
    setSelected(null)
    setTextAnswer('')
    setResult(null)
    if (exercise.kind === 'fill-blank' || exercise.kind === 'production') {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [exercise.id])

  function finish(correct: boolean) {
    setResult(correct ? 'correct' : 'wrong')
    const elapsed = Date.now() - startRef.current
    if (correct) {
      setTimeout(() => onAnswered(true, elapsed), 700)
    } else {
      setWrongElapsed(elapsed)
    }
    // si faux : on n'enchaîne pas tout seul, la personne lit l'explication puis appuie sur "Continuer"
  }

  function handleChoice(option: string) {
    if (result) return
    setSelected(option)
    finish(option === exercise.answer)
  }

  function handleTextSubmit() {
    if (result || !textAnswer.trim()) return
    if (exercise.kind === 'production') {
      // validation souple : on vérifie juste que le mot cible apparaît dans la phrase
      finish(normalize(textAnswer).includes(normalize(exercise.answer)))
    } else {
      finish(normalize(textAnswer) === normalize(exercise.answer))
    }
  }

  const isChoice = Boolean(exercise.options)

  return (
    <div
      className={`ticket-card w-full px-6 py-7 flex flex-col items-center text-center gap-5 ${
        result === 'wrong' ? 'animate-shake' : ''
      }`}
    >
      <span className="text-xs font-mono uppercase tracking-wide text-ink-soft dark:text-cream/60">
        {KIND_LABEL[exercise.kind]}
      </span>

      {exercise.audioText ? (
        <div className="flex flex-col items-center gap-3">
          <SpeakButton text={exercise.audioText} />
          <p className="text-sm text-ink-soft dark:text-cream/70">{exercise.prompt}</p>
        </div>
      ) : exercise.kind === 'fill-blank' ? (
        <TappableSentence
          text={exercise.prompt}
          className="font-display text-2xl font-semibold text-ink dark:text-cream leading-snug"
        />
      ) : (
        <p className="font-display text-2xl font-semibold text-ink dark:text-cream leading-snug">{exercise.prompt}</p>
      )}

      {exercise.promptFr && !exercise.audioText && (
        <p className="text-sm text-ink-soft dark:text-cream/60">{exercise.promptFr}</p>
      )}

      {isChoice ? (
        <div className="w-full flex flex-col gap-3">
          {exercise.options!.map((option) => {
            const isSelected = selected === option
            const isAnswer = option === exercise.answer
            let style = 'bg-paper dark:bg-dusk border-ink/10 dark:border-cream/10 text-ink dark:text-cream'
            if (result && isSelected && isAnswer) style = 'bg-pine/15 border-pine text-pine'
            if (result && isSelected && !isAnswer) style = 'bg-rust/10 border-rust text-rust'
            if (result && !isSelected && isAnswer) style = 'bg-pine/10 border-pine/60 text-pine'
            return (
              <button
                key={option}
                onClick={() => handleChoice(option)}
                disabled={Boolean(result)}
                className={`rounded-2xl border-2 px-4 py-3 text-base font-medium transition-colors ${style} active:scale-[0.98]`}
              >
                {option}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-3">
          <input
            ref={inputRef}
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
            disabled={Boolean(result)}
            placeholder="Écris ta réponse en anglais..."
            className={`w-full rounded-2xl border-2 px-4 py-3 text-base bg-paper dark:bg-dusk text-ink dark:text-cream placeholder:text-ink-soft/50 outline-none ${
              result === 'correct'
                ? 'border-pine'
                : result === 'wrong'
                  ? 'border-rust'
                  : 'border-ink/10 dark:border-cream/10 focus:border-coral'
            }`}
          />
          {!result && (
            <button
              onClick={handleTextSubmit}
              className="rounded-2xl bg-coral text-white font-semibold px-4 py-3 active:scale-[0.98] transition-transform"
            >
              Valider
            </button>
          )}
          {result === 'wrong' && (
            <p className="text-sm text-rust">
              Réponse : <span className="font-semibold">{exercise.answer}</span>
            </p>
          )}
          {exercise.hint && !result && <p className="text-xs text-ink-soft dark:text-cream/50">💡 {exercise.hint}</p>}
        </div>
      )}

      {result && (
        <div
          className={`stamp h-16 w-16 text-3xl border-current animate-stampDown ${
            result === 'correct' ? 'text-pine' : 'text-rust'
          }`}
          aria-hidden
        >
          {result === 'correct' ? '✓' : '✕'}
        </div>
      )}

      {result === 'wrong' && (
        <div className="w-full flex flex-col gap-3">
          {exercise.explanation && (
            <p className="text-sm text-ink-soft dark:text-cream/70 bg-paper dark:bg-dusk rounded-2xl px-4 py-3">
              <TappableSentence text={exercise.explanation} />
            </p>
          )}
          <button
            onClick={() => onAnswered(false, wrongElapsed)}
            className="rounded-2xl bg-ink dark:bg-cream text-cream dark:text-ink font-semibold px-4 py-3 active:scale-[0.98] transition-transform"
          >
            Continuer
          </button>
        </div>
      )}
    </div>
  )
}
