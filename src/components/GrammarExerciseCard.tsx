import { useEffect, useState } from 'react'
import type { GrammarExercise } from '../types'
import TappableSentence from './TappableSentence'

interface GrammarExerciseCardProps {
  exercise: GrammarExercise
  onAnswered: (correct: boolean) => void
}

export default function GrammarExerciseCard({ exercise, onAnswered }: GrammarExerciseCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)

  useEffect(() => {
    setSelected(null)
    setResult(null)
  }, [exercise.id])

  function handleChoice(option: string) {
    if (result) return
    setSelected(option)
    setResult(option === exercise.answer ? 'correct' : 'wrong')
    if (option === exercise.answer) {
      setTimeout(() => onAnswered(true), 700)
    }
  }

  return (
    <div className={`ticket-card w-full px-6 py-7 flex flex-col items-center text-center gap-5 ${result === 'wrong' ? 'animate-shake' : ''}`}>
      {exercise.promptFr && <p className="text-sm text-ink-soft">{exercise.promptFr}</p>}
      <TappableSentence text={exercise.prompt} className="font-display text-2xl font-semibold text-ink leading-snug" />

      <div className="w-full flex flex-col gap-3">
        {exercise.options!.map((option) => {
          const isSelected = selected === option
          const isAnswer = option === exercise.answer
          let style = 'bg-paper border-ink/10 text-ink'
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

      {result && (
        <div
          className={`stamp h-16 w-16 text-3xl border-current animate-stampDown ${result === 'correct' ? 'text-pine' : 'text-rust'}`}
          aria-hidden
        >
          {result === 'correct' ? '✓' : '✕'}
        </div>
      )}

      {result === 'wrong' && (
        <div className="w-full flex flex-col gap-3">
          <p className="text-sm text-ink-soft bg-paper rounded-2xl px-4 py-3">{exercise.explanation}</p>
          <button
            onClick={() => onAnswered(false)}
            className="rounded-2xl bg-ink text-cream font-semibold px-4 py-3 active:scale-[0.98] transition-transform"
          >
            Continuer
          </button>
        </div>
      )}
    </div>
  )
}
