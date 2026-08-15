import { useNavigate } from 'react-router-dom'

interface SessionCompleteProps {
  correctCount: number
  totalCount: number
  newWordsCount?: number
}

const MESSAGES = [
  "Joli moment d'anglais !",
  'Bien joué, tu progresses.',
  "C'est dans la poche.",
  'Nice work! 🎉',
]

export default function SessionComplete({ correctCount, totalCount, newWordsCount = 0 }: SessionCompleteProps) {
  const navigate = useNavigate()
  const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center animate-popIn">
      <div className="stamp h-24 w-24 text-5xl border-mustard text-mustard bg-mustard/10 animate-stampDown">🏅</div>
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink dark:text-cream">{message}</h2>
        <p className="mt-2 text-ink-soft dark:text-cream/70">
          {correctCount}/{totalCount} bonnes réponses
          {newWordsCount > 0 ? ` · ${newWordsCount} nouveau${newWordsCount > 1 ? 'x' : ''} mot${newWordsCount > 1 ? 's' : ''}` : ''}
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="rounded-full bg-ink dark:bg-cream text-cream dark:text-ink font-semibold px-8 py-3 active:scale-95 transition-transform"
      >
        Retour à l'accueil
      </button>
    </div>
  )
}
