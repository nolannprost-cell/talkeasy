import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import ExerciseCard from '../components/ExerciseCard'
import ProgressDots from '../components/ProgressDots'
import SessionComplete from '../components/SessionComplete'
import { generateFocusSession, getDueWordIdList } from '../services/activityGenerator'
import { recordAnswer } from '../services/srs'
import { getWordById } from '../data/words'

// Accessible depuis l'accueil quand des mots sont en attente (ex : après avoir
// tapé "Plus tard" sur l'offre de renfort) : permet de les retravailler sans
// attendre la prochaine session "3 minutes".

export default function Focus() {
  const navigate = useNavigate()
  const [wordIds] = useState(() => getDueWordIdList(4))
  const [exercises] = useState(() => generateFocusSession(wordIds))
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  if (wordIds.length === 0) {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col">
        <TopBar title="Mes mots" />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="text-4xl">🌤️</span>
          <p className="text-ink font-display text-lg">Rien à retravailler pour l'instant</p>
          <p className="text-sm text-ink-soft">Fais un peu de "3 minutes" pour découvrir de nouveaux mots.</p>
          <button onClick={() => navigate('/')} className="mt-2 text-sm text-coral-dark underline underline-offset-2">
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  const words = wordIds.map((id) => getWordById(id)).filter(Boolean)
  const current = exercises[index]
  const done = index >= exercises.length

  function handleAnswered(correct: boolean, responseTimeMs: number) {
    recordAnswer(current.wordId, current.kind, correct, responseTimeMs)
    if (correct) setCorrectCount((c) => c + 1)
    setIndex((i) => i + 1)
  }

  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col">
      <TopBar title="Mes mots" />
      {!done && (
        <>
          <div className="flex flex-wrap justify-center gap-1.5 px-5 -mt-1 mb-1">
            {words.map((w) => (
              <span key={w!.id} className="rounded-full bg-rust/10 text-rust px-2.5 py-0.5 text-xs font-medium">
                {w!.en}
              </span>
            ))}
          </div>
          <ProgressDots total={exercises.length} current={index} />
        </>
      )}
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
