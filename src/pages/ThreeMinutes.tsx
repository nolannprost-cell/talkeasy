import { useRef, useState } from 'react'
import TopBar from '../components/TopBar'
import ExerciseCard from '../components/ExerciseCard'
import ProgressDots from '../components/ProgressDots'
import SessionComplete from '../components/SessionComplete'
import { generateThreeMinuteSession, generateFocusSession } from '../services/activityGenerator'
import { recordAnswer } from '../services/srs'
import { logActivity } from '../services/storage'
import { getWordById } from '../data/words'
import type { Exercise } from '../types'

type Phase = 'intro' | 'session' | 'offer-focus' | 'focus' | 'complete'

export default function ThreeMinutes() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongWordIds, setWrongWordIds] = useState<string[]>([])
  const [focusExercises, setFocusExercises] = useState<Exercise[]>([])
  const [focusIndex, setFocusIndex] = useState(0)
  const loggedRef = useRef(false)

  function start() {
    setExercises(generateThreeMinuteSession())
    setIndex(0)
    setCorrectCount(0)
    setWrongWordIds([])
    loggedRef.current = false
    setPhase('session')
  }

  const current = exercises[index]

  function handleAnswered(correct: boolean, responseTimeMs: number) {
    recordAnswer(current.wordId, current.kind, correct, responseTimeMs)
    let updatedWrong = wrongWordIds
    if (correct) {
      setCorrectCount((c) => c + 1)
    } else if (!wrongWordIds.includes(current.wordId)) {
      updatedWrong = [...wrongWordIds, current.wordId]
      setWrongWordIds(updatedWrong)
    }
    const nextIndex = index + 1
    setIndex(nextIndex)

    if (nextIndex >= exercises.length) {
      if (!loggedRef.current) {
        loggedRef.current = true
        logActivity('three-minutes', 3)
      }
      setPhase(updatedWrong.length > 0 ? 'offer-focus' : 'complete')
    }
  }

  function startFocus() {
    setFocusExercises(generateFocusSession(wrongWordIds))
    setFocusIndex(0)
    setPhase('focus')
  }

  const focusCurrent = focusExercises[focusIndex]

  function handleFocusAnswered(correct: boolean, responseTimeMs: number) {
    recordAnswer(focusCurrent.wordId, focusCurrent.kind, correct, responseTimeMs)
    const nextIndex = focusIndex + 1
    setFocusIndex(nextIndex)
    if (nextIndex >= focusExercises.length) setPhase('complete')
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col">
        <TopBar title="3 minutes" />
        <div className="flex-1 flex flex-col justify-center px-5 pb-10">
          <div className="ticket-card px-6 py-8 flex flex-col items-center gap-4 text-center animate-popIn">
            <span className="text-4xl">⚡</span>
            <h2 className="font-display text-xl font-semibold text-ink">Le principe</h2>
            <p className="text-sm text-ink-soft leading-relaxed">
              6 petits exercices différents à la suite : retrouver un mot, compléter une phrase, comprendre une
              phrase à l'oral, produire une phrase toi-même... Ça mélange des mots déjà vus (pour ne pas les
              oublier) et un ou deux nouveaux.
            </p>
            <p className="text-xs text-ink-soft/70">
              Si un mot te pose problème, on le retravaille juste après avec 3 exercices dessus, pour qu'il reste.
            </p>
            <button
              onClick={start}
              className="mt-2 rounded-full bg-coral text-white font-semibold px-8 py-3 active:scale-95 transition-transform"
            >
              C'est parti →
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'session') {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col">
        <TopBar title="3 minutes" onBack={() => setPhase('intro')} />
        <ProgressDots total={exercises.length} current={index} />
        <p className="text-center text-xs text-ink-soft/70 -mt-1 mb-2">
          Exercice {Math.min(index + 1, exercises.length)} sur {exercises.length}
        </p>
        <div className="flex-1 flex flex-col justify-center px-5 pb-8">
          <ExerciseCard key={current.id} exercise={current} onAnswered={handleAnswered} />
        </div>
      </div>
    )
  }

  if (phase === 'offer-focus') {
    const words = wrongWordIds.map((id) => getWordById(id)).filter(Boolean)
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col">
        <TopBar title="3 minutes" />
        <div className="flex-1 flex flex-col justify-center px-5 pb-10">
          <div className="ticket-card px-6 py-8 flex flex-col items-center gap-4 text-center animate-popIn">
            <span className="text-4xl">🔎</span>
            <h2 className="font-display text-xl font-semibold text-ink">
              {words.length > 1 ? "Ces mots n'étaient pas clairs" : "Ce mot n'était pas clair"}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {words.map((w) => (
                <span key={w!.id} className="rounded-full bg-rust/10 text-rust px-3 py-1 text-sm font-medium">
                  {w!.en} <span className="text-rust/70">— {w!.fr}</span>
                </span>
              ))}
            </div>
            <p className="text-sm text-ink-soft leading-relaxed">
              On le retravaille tout de suite avec {words.length * 3} petits exercices ciblés (le retrouver, le
              placer dans une phrase, puis l'utiliser toi-même) pour qu'il te reste vraiment.
            </p>
            <button
              onClick={startFocus}
              className="mt-1 rounded-full bg-coral text-white font-semibold px-8 py-3 active:scale-95 transition-transform"
            >
              Travailler ce{words.length > 1 ? 's' : ''} mot{words.length > 1 ? 's' : ''} →
            </button>
            <button onClick={() => setPhase('complete')} className="text-xs text-ink-soft/70 underline underline-offset-2">
              Plus tard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'focus') {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col">
        <TopBar title="On retravaille" onBack={() => setPhase('complete')} />
        <ProgressDots total={focusExercises.length} current={focusIndex} />
        <p className="text-center text-xs text-ink-soft/70 -mt-1 mb-2">
          {Math.min(focusIndex + 1, focusExercises.length)} sur {focusExercises.length}
        </p>
        <div className="flex-1 flex flex-col justify-center px-5 pb-8">
          <ExerciseCard key={focusCurrent.id} exercise={focusCurrent} onAnswered={handleFocusAnswered} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col">
      <TopBar title="3 minutes" />
      <div className="flex-1 flex flex-col justify-center px-5 pb-8">
        <SessionComplete correctCount={correctCount} totalCount={exercises.length} />
      </div>
    </div>
  )
}
