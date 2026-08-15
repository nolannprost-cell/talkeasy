import { useRef, useState } from 'react'
import TopBar from '../components/TopBar'
import ExerciseCard from '../components/ExerciseCard'
import ProgressDots from '../components/ProgressDots'
import SessionComplete from '../components/SessionComplete'
import { generateThemedSession } from '../services/activityGenerator'
import { recordAnswer } from '../services/srs'
import { addSong, loadSongs, logActivity } from '../services/storage'
import type { Exercise, WordCategory } from '../types'

// Important : je ne peux pas récupérer ni afficher les vraies paroles d'une
// chanson (droits d'auteur), et l'app n'a pas de backend pour interroger une
// API de paroles sous licence. À la place : on choisit une ambiance proche de
// la chanson pour piocher du vocabulaire pertinent dans notre banque, et on
// propose un lien pour aller lire les vraies paroles sur Genius si besoin.

const MOODS: { id: string; label: string; emoji: string; categories: WordCategory[] }[] = [
  { id: 'love', label: 'Love song', emoji: '💕', categories: ['social'] },
  { id: 'chill', label: 'Chill', emoji: '🌙', categories: ['daily', 'usa'] },
  { id: 'party', label: 'Party', emoji: '🎉', categories: ['usa', 'social'] },
  { id: 'motivation', label: 'Motivation', emoji: '🔥', categories: ['work', 'daily'] },
  { id: 'travel', label: 'Road trip', emoji: '🚗', categories: ['travel', 'usa'] },
]

export default function Music() {
  const [songInput, setSongInput] = useState('')
  const [moodId, setMoodId] = useState<string>(MOODS[0].id)
  const [activeSong, setActiveSong] = useState<string | null>(null)
  const [exercises, setExercises] = useState<Exercise[] | null>(null)
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const loggedRef = useRef(false)
  const recentSongs = loadSongs()

  function start(song: string) {
    if (!song.trim()) return
    const mood = MOODS.find((m) => m.id === moodId) ?? MOODS[0]
    addSong(song.trim())
    setActiveSong(song.trim())
    setExercises(generateThemedSession(mood.categories))
    setIndex(0)
    setCorrectCount(0)
    loggedRef.current = false
  }

  if (!activeSong || !exercises) {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col pb-8">
        <TopBar title="Music" />
        <div className="px-5 flex flex-col gap-4">
          <div className="ticket-card px-5 py-5 flex flex-col gap-4">
            <p className="text-sm text-ink-soft dark:text-cream/70">
              Je ne peux pas aller chercher les vraies paroles (droits d'auteur), mais dis-moi le nom de la chanson
              et son ambiance : je te prépare des expressions utiles dans le même esprit, et je te mets un lien pour
              lire les vraies paroles à côté.
            </p>
            <input
              value={songInput}
              onChange={(e) => setSongInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && start(songInput)}
              placeholder="Ex : Blinding Lights"
              className="w-full rounded-2xl border-2 border-ink/10 dark:border-cream/10 bg-paper dark:bg-dusk px-4 py-3 text-ink dark:text-cream outline-none focus:border-coral"
            />
            <div>
              <p className="mb-2 text-xs font-mono uppercase tracking-wide text-ink-soft dark:text-cream/50">
                Ambiance
              </p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMoodId(m.id)}
                    className={`rounded-full border-2 px-3.5 py-2 text-sm transition-colors ${
                      moodId === m.id
                        ? 'border-coral bg-coral/10 text-coral-dark dark:text-coral'
                        : 'border-ink/10 dark:border-cream/10 text-ink dark:text-cream'
                    }`}
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => start(songInput)}
              disabled={!songInput.trim()}
              className="rounded-full bg-coral text-white font-semibold px-6 py-3 disabled:opacity-40 active:scale-95 transition-transform"
            >
              🎵 Travailler cette chanson
            </button>
            {songInput.trim() && (
              <a
                href={`https://genius.com/search?q=${encodeURIComponent(songInput.trim())}`}
                target="_blank"
                rel="noreferrer"
                className="text-center text-xs text-ink-soft dark:text-cream/50 underline underline-offset-2"
              >
                Voir les vraies paroles sur Genius ↗
              </a>
            )}
          </div>

          {recentSongs.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-mono uppercase tracking-wide text-ink-soft dark:text-cream/50">
                Reprendre une chanson
              </p>
              <div className="flex flex-col gap-2">
                {recentSongs.slice(0, 5).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => start(s.songQuery)}
                    className="ticket-card text-left px-4 py-3 text-ink dark:text-cream active:scale-[0.98] transition-transform"
                  >
                    🎧 {s.songQuery}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
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
    logActivity('music', 3)
  }

  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col">
      <TopBar title={`🎵 ${activeSong}`} onBack={() => setActiveSong(null)} />
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
