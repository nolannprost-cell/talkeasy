import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import ProgressDots from '../components/ProgressDots'
import GrammarExerciseCard from '../components/GrammarExerciseCard'
import SpeakButton from '../components/SpeakButton'
import TappableSentence from '../components/TappableSentence'
import GrammarTable from '../components/GrammarTable'
import { GRAMMAR_LESSONS, generateGrammarRecap } from '../data/grammarLessons'
import { loadCompletedLessons, markLessonComplete } from '../services/storage'
import type { GrammarExercise, GrammarLesson } from '../types'

type Phase = 'list' | 'explain' | 'practice' | 'done' | 'recap' | 'recap-done'

export default function Bases() {
  const navigate = useNavigate()
  const [completed, setCompleted] = useState(() => loadCompletedLessons())
  const [lesson, setLesson] = useState<GrammarLesson | null>(null)
  const [phase, setPhase] = useState<Phase>('list')
  const [exIndex, setExIndex] = useState(0)
  const [recap, setRecap] = useState<GrammarExercise[]>([])
  const [recapScore, setRecapScore] = useState(0)

  function openLesson(l: GrammarLesson) {
    setLesson(l)
    setExIndex(0)
    setPhase('explain')
  }

  function startRecap() {
    setRecap(generateGrammarRecap(completed))
    setExIndex(0)
    setRecapScore(0)
    setPhase('recap')
  }

  function handleExerciseAnswered(correct: boolean) {
    // avant : on ne faisait rien sur une mauvaise réponse, ce qui bloquait le
    // bouton "Continuer" — maintenant on avance dans tous les cas.
    advance()
  }

  function advance() {
    if (!lesson) return
    const next = exIndex + 1
    if (next >= lesson.exercises.length) {
      markLessonComplete(lesson.id)
      setCompleted((c) => (c.includes(lesson.id) ? c : [...c, lesson.id]))
      setPhase('done')
    } else {
      setExIndex(next)
    }
  }

  function handleRecapAnswered(correct: boolean) {
    if (correct) setRecapScore((s) => s + 1)
    const next = exIndex + 1
    if (next >= recap.length) {
      setPhase('recap-done')
    } else {
      setExIndex(next)
    }
  }

  if (phase === 'list' || (!lesson && phase !== 'recap' && phase !== 'recap-done')) {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col pb-10">
        <TopBar title="Les bases" />
        <div className="px-5 flex flex-col gap-3">
          <p className="text-sm text-ink-soft -mt-2 mb-1">
            9 courtes leçons pour comprendre comment se construit une phrase anglaise — la base sur laquelle
            s'appuie tout le reste.
          </p>

          {completed.length > 0 && (
            <button
              onClick={startRecap}
              className="ticket-card text-left px-5 py-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <span className="text-2xl">🔁</span>
              <div className="min-w-0 flex-1">
                <div className="font-display font-semibold text-ink">Petit rappel</div>
                <div className="text-sm text-ink-soft">Mélange de tout ce que tu as déjà appris</div>
              </div>
            </button>
          )}

          {GRAMMAR_LESSONS.map((l) => {
            const isDone = completed.includes(l.id)
            return (
              <button
                key={l.id}
                onClick={() => openLesson(l)}
                className="ticket-card text-left px-5 py-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <span className="text-2xl">{l.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-display font-semibold text-ink">{l.title}</div>
                  <div className="text-sm text-ink-soft">{l.subtitle}</div>
                </div>
                {isDone && <span className="shrink-0 text-pine text-lg">✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (phase === 'recap') {
    const current = recap[exIndex]
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col">
        <TopBar title="Petit rappel" onBack={() => setPhase('list')} />
        <ProgressDots total={recap.length} current={exIndex} />
        <div className="flex-1 flex flex-col justify-center px-5 pb-8">
          <GrammarExerciseCard key={current.id} exercise={current} onAnswered={handleRecapAnswered} />
        </div>
      </div>
    )
  }

  if (phase === 'recap-done') {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col">
        <TopBar title="Petit rappel" />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center animate-popIn">
          <div className="stamp h-20 w-20 text-4xl border-pine text-pine bg-pine/10 animate-stampDown">🔁</div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Rappel fait !</h2>
            <p className="mt-2 text-sm text-ink-soft">
              {recapScore}/{recap.length} bonnes réponses. Reviens quand tu veux, ça t'aide à ne pas oublier.
            </p>
          </div>
          <button
            onClick={() => setPhase('list')}
            className="rounded-full bg-ink text-cream font-semibold px-8 py-3 active:scale-95 transition-transform"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    )
  }

  if (!lesson) return null

  if (phase === 'explain') {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col pb-8">
        <TopBar title={lesson.title} onBack={() => setPhase('list')} />
        <div className="px-5 flex flex-col gap-4">
          <div className="ticket-card px-6 py-6 flex flex-col gap-4 animate-popIn">
            {lesson.explanationBody.map((p, i) => (
              <p key={i} className="text-sm text-ink-soft leading-relaxed">
                {p}
              </p>
            ))}
            {lesson.table && <GrammarTable headers={lesson.table.headers} rows={lesson.table.rows} />}
          </div>
          <div className="flex flex-col gap-2">
            {lesson.examples.map((ex, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3">
                <SpeakButton text={ex.en} size="sm" />
                <div>
                  <TappableSentence text={ex.en} className="text-ink font-medium" />
                  <div className="text-xs text-ink-soft">{ex.fr}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPhase('practice')}
            className="rounded-full bg-coral text-white font-semibold px-6 py-3 active:scale-95 transition-transform self-center mt-1"
          >
            Je comprends, à moi de jouer →
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'practice') {
    const current = lesson.exercises[exIndex]
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col">
        <TopBar title={lesson.title} onBack={() => setPhase('explain')} />
        <ProgressDots total={lesson.exercises.length} current={exIndex} />
        <div className="flex-1 flex flex-col justify-center px-5 pb-8">
          <GrammarExerciseCard key={current.id} exercise={current} onAnswered={handleExerciseAnswered} />
        </div>
      </div>
    )
  }

  // done
  const nextLesson = GRAMMAR_LESSONS.find((l) => !completed.includes(l.id) && l.id !== lesson.id)
  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col">
      <TopBar title={lesson.title} />
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center animate-popIn">
        <div className="stamp h-20 w-20 text-4xl border-mustard text-mustard bg-mustard/10 animate-stampDown">🎓</div>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Leçon terminée !</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Tu peux la refaire quand tu veux, et le "Petit rappel" la fera revenir de temps en temps.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {nextLesson && (
            <button
              onClick={() => openLesson(nextLesson)}
              className="rounded-full bg-coral text-white font-semibold px-6 py-3 active:scale-95 transition-transform"
            >
              Leçon suivante : {nextLesson.title} →
            </button>
          )}
          <button onClick={() => setPhase('list')} className="text-sm text-ink-soft underline underline-offset-2">
            Retour à la liste
          </button>
          <button onClick={() => navigate('/')} className="text-sm text-ink-soft underline underline-offset-2">
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}
