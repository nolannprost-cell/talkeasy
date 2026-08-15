import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserProfile } from '../types'
import { getDueCount } from '../services/activityGenerator'
import { GRAMMAR_LESSONS } from '../data/grammarLessons'
import { loadCompletedLessons, loadAllProgress, loadCelebratedMilestones, markMilestoneCelebrated } from '../services/storage'
import { getDailyMessage } from '../data/dailyMessages'
import { WORDS } from '../data/words'
import MilestoneCelebration from '../components/MilestoneCelebration'

interface HomeProps {
  profile: UserProfile
}

const GREETINGS = ['Salut', 'Hey', 'Coucou', 'Yo']

interface Milestone {
  id: string
  check: (discoveredCount: number, basesDone: boolean) => boolean
  emoji: string
  message: string
}

const MILESTONES: Milestone[] = [
  { id: 'words-10', check: (c) => c >= 10, emoji: '🌱', message: '10 mots découverts ! Tu prends le rythme.' },
  { id: 'bases-done', check: (_c, b) => b, emoji: '🎓', message: 'Les bases terminées ! Les fondations sont posées.' },
  { id: 'words-25', check: (c) => c >= 25, emoji: '🌸', message: '25 mots ! Ça commence à faire un sacré vocabulaire.' },
  { id: 'words-50', check: (c) => c >= WORDS.length, emoji: '🏆', message: 'Tout le vocabulaire de l\'appli découvert !' },
]

export default function Home({ profile }: HomeProps) {
  const navigate = useNavigate()
  const [dueCount, setDueCount] = useState(0)
  const [completedLessons, setCompletedLessons] = useState(0)
  const [celebration, setCelebration] = useState<Milestone | null>(null)

  useEffect(() => {
    setDueCount(getDueCount())
    const lessonsDone = loadCompletedLessons().length
    setCompletedLessons(lessonsDone)

    const discoveredCount = Object.values(loadAllProgress()).filter((p) => p.seenCount > 0).length
    const basesDone = lessonsDone >= GRAMMAR_LESSONS.length
    const celebrated = loadCelebratedMilestones()
    const next = MILESTONES.find((m) => !celebrated.includes(m.id) && m.check(discoveredCount, basesDone))
    if (next) setCelebration(next)
  }, [])

  function dismissCelebration() {
    if (celebration) markMilestoneCelebrated(celebration.id)
    setCelebration(null)
  }

  const greeting = GREETINGS[new Date().getDate() % GREETINGS.length]
  const basesDone = completedLessons >= GRAMMAR_LESSONS.length

  return (
    <div className="relative min-h-dvh max-w-md mx-auto flex flex-col px-5 pb-10 overflow-hidden">
      {celebration && (
        <MilestoneCelebration emoji={celebration.emoji} message={celebration.message} onDismiss={dismissCelebration} />
      )}

      <div className="safe-top flex items-center justify-between pt-2 pb-6">
        <div>
          <p className="text-sm text-ink-soft">{greeting},</p>
          <h1 className="font-display text-2xl font-semibold text-ink">{profile.name} ✨</h1>
        </div>
        <button
          onClick={() => navigate('/profile')}
          aria-label="Profil"
          className="stamp h-11 w-11 border-ink/15 text-lg bg-card text-ink active:scale-90 transition-transform overflow-hidden"
        >
          {profile.photoDataUrl ? (
            <img src={profile.photoDataUrl} alt="" className="h-full w-full object-cover rounded-full" />
          ) : (
            profile.name.charAt(0).toUpperCase()
          )}
        </button>
      </div>

      <div className="relative flex-1 flex flex-col justify-center gap-3">
        <button
          onClick={() => navigate('/bases')}
          className="ticket-card w-full px-5 py-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
        >
          <span className="stamp h-14 w-14 shrink-0 text-2xl border-pine bg-pine/15 text-pine">📘</span>
          <div className="min-w-0 flex-1">
            <div className="font-display text-lg font-semibold text-ink">Les bases</div>
            <p className="text-sm text-ink-soft">
              {basesDone ? 'Terminées — tu peux les revoir quand tu veux' : `${completedLessons}/${GRAMMAR_LESSONS.length} leçons faites`}
            </p>
          </div>
          {basesDone && <span className="text-pine text-lg shrink-0">✓</span>}
        </button>

        <button
          onClick={() => navigate('/three-minutes')}
          className="ticket-card w-full px-6 py-9 flex flex-col items-center gap-4 text-center active:scale-[0.98] transition-transform"
        >
          <span className="stamp h-20 w-20 text-4xl border-coral bg-coral/15 text-coral-dark">⚡</span>
          <div>
            <div className="font-display text-2xl font-semibold text-ink">3 minutes</div>
            <p className="mt-1 text-sm text-ink-soft">
              {dueCount > 0
                ? `${dueCount} mot${dueCount > 1 ? 's' : ''} à retravailler aujourd'hui, mélangés à du nouveau`
                : 'Quelques mini-exercices variés, un peu de tout'}
            </p>
          </div>
          <span className="rounded-full bg-coral text-white font-semibold px-6 py-2.5 text-sm">Commencer</span>
        </button>

        {dueCount > 0 && (
          <button
            onClick={() => navigate('/focus')}
            className="text-center text-sm text-ink-soft underline underline-offset-2"
          >
            🔁 Retravailler mes {dueCount} mot{dueCount > 1 ? 's' : ''} en attente
          </button>
        )}
      </div>

      <p className="relative mt-8 text-center text-xs text-ink-soft/70">{getDailyMessage()}</p>
    </div>
  )
}
