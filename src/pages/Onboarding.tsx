import { useState } from 'react'
import type { Level, UserProfile } from '../types'

interface OnboardingProps {
  onComplete: (input: Pick<UserProfile, 'name' | 'level' | 'interests' | 'goals'>) => void
}

const INTERESTS = ['🇺🇸 États-Unis', '✈️ Voyages', '🎬 Films & séries', '🎵 Musique', '💼 Travail', '🍔 Cuisine']
const GOALS = ['Voyager sereinement', 'Parler au travail', "Comprendre les films en VO", 'Discuter avec des gens']

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [level, setLevel] = useState<Level>('elementary')
  const [interests, setInterests] = useState<string[]>([])
  const [goals, setGoals] = useState<string[]>([])

  function toggle(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  const steps = [
    {
      title: 'Bienvenue 👋',
      subtitle: "Comment tu t'appelles ?",
      content: (
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ton prénom"
          className="w-full rounded-2xl border-2 border-ink/10 dark:border-cream/10 bg-paper dark:bg-dusk px-4 py-3 text-center text-lg text-ink dark:text-cream outline-none focus:border-coral"
        />
      ),
      canNext: name.trim().length > 0,
    },
    {
      title: 'Ton niveau actuel',
      subtitle: "Pas besoin d'être précis, on ajustera automatiquement",
      content: (
        <div className="flex flex-col gap-3">
          {(
            [
              ['beginner', 'Débutante — je connais quelques mots'],
              ['elementary', "Faux débutant — je me débrouille un peu"],
              ['intermediate', 'Intermédiaire — je comprends pas mal'],
            ] as [Level, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setLevel(value)}
              className={`rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
                level === value
                  ? 'border-coral bg-coral/10 text-coral-dark dark:text-coral'
                  : 'border-ink/10 dark:border-cream/10 text-ink dark:text-cream'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ),
      canNext: true,
    },
    {
      title: 'Ce que tu aimes',
      subtitle: 'Choisis ce qui te parle (plusieurs choix possibles)',
      content: (
        <div className="flex flex-wrap justify-center gap-2">
          {INTERESTS.map((item) => (
            <button
              key={item}
              onClick={() => toggle(interests, setInterests, item)}
              className={`rounded-full border-2 px-4 py-2 text-sm transition-colors ${
                interests.includes(item)
                  ? 'border-coral bg-coral/10 text-coral-dark dark:text-coral'
                  : 'border-ink/10 dark:border-cream/10 text-ink dark:text-cream'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      ),
      canNext: true,
    },
    {
      title: 'Ton objectif',
      subtitle: 'Pourquoi tu apprends l\'anglais en ce moment ?',
      content: (
        <div className="flex flex-col gap-3">
          {GOALS.map((item) => (
            <button
              key={item}
              onClick={() => toggle(goals, setGoals, item)}
              className={`rounded-2xl border-2 px-4 py-3 text-left transition-colors ${
                goals.includes(item)
                  ? 'border-coral bg-coral/10 text-coral-dark dark:text-coral'
                  : 'border-ink/10 dark:border-cream/10 text-ink dark:text-cream'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      ),
      canNext: true,
    },
  ]

  const current = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div className="min-h-dvh flex flex-col justify-center px-6 py-10 max-w-md mx-auto">
      <div className="ticket-card px-6 py-8 flex flex-col gap-6 animate-popIn">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-ink dark:text-cream">{current.title}</h1>
          <p className="mt-1 text-sm text-ink-soft dark:text-cream/70">{current.subtitle}</p>
        </div>

        {current.content}

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`text-sm text-ink-soft dark:text-cream/60 ${step === 0 ? 'invisible' : ''}`}
          >
            Retour
          </button>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === step ? 'bg-coral' : 'bg-ink/15 dark:bg-cream/20'}`} />
            ))}
          </div>
          <button
            disabled={!current.canNext}
            onClick={() => {
              if (isLast) {
                onComplete({ name: name.trim(), level, interests, goals })
              } else {
                setStep((s) => s + 1)
              }
            }}
            className="rounded-full bg-coral text-white font-semibold px-5 py-2 disabled:opacity-40 active:scale-95 transition-transform"
          >
            {isLast ? "C'est parti" : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  )
}
