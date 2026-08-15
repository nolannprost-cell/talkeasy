import { useState } from 'react'
import TopBar from '../components/TopBar'
import SpeakButton from '../components/SpeakButton'
import SessionComplete from '../components/SessionComplete'
import { LISTEN_SCENARIOS } from '../data/listenScenarios'
import type { ListenScenario } from '../types'
import { logActivity } from '../services/storage'
import { speak } from '../services/tts'

type Step = 'intro' | 'question' | 'expression' | 'reuse' | 'done'

const LEVEL_LABEL: Record<ListenScenario['level'], string> = {
  beginner: 'Débutant',
  elementary: 'Facile',
  intermediate: 'Intermédiaire',
}

export default function Listen() {
  const [scenario, setScenario] = useState<ListenScenario | null>(null)
  const [step, setStep] = useState<Step>('intro')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [reuseText, setReuseText] = useState('')

  function selectScenario(s: ListenScenario) {
    setScenario(s)
    setStep('intro')
    setSelectedOption(null)
    setReuseText('')
  }

  function finishSession() {
    logActivity('listen', 3)
    setStep('done')
  }

  if (!scenario) {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col pb-8">
        <TopBar title="Listen" />
        <div className="px-5 flex flex-col gap-3">
          <p className="text-sm text-ink-soft dark:text-cream/70 -mt-2 mb-1">Choisis une petite scène à écouter :</p>
          {LISTEN_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => selectScenario(s)}
              className="ticket-card text-left px-5 py-4 flex items-center justify-between gap-3 active:scale-[0.98] transition-transform"
            >
              <div>
                <div className="font-display font-semibold text-ink dark:text-cream">{s.title}</div>
                <div className="text-sm text-ink-soft dark:text-cream/70">{s.setup}</div>
              </div>
              <span className="shrink-0 rounded-full bg-paper dark:bg-dusk px-2.5 py-1 text-xs font-mono text-ink-soft dark:text-cream/60">
                {LEVEL_LABEL[s.level]}
              </span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className="min-h-dvh max-w-md mx-auto flex flex-col">
        <TopBar title="Listen" onBack={() => setScenario(null)} />
        <SessionComplete correctCount={1} totalCount={1} />
      </div>
    )
  }

  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col pb-8">
      <TopBar title={scenario.title} onBack={() => setScenario(null)} />
      <div className="flex-1 flex flex-col px-5 gap-5">
        {step === 'intro' && (
          <div className="ticket-card px-6 py-7 flex flex-col items-center gap-5 text-center animate-popIn">
            <p className="text-sm text-ink-soft dark:text-cream/70">{scenario.setup}</p>
            <div className="w-full flex flex-col gap-3">
              {scenario.lines.map((line, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl bg-paper dark:bg-dusk px-4 py-3 text-left">
                  <button
                    onClick={() => speak(line.text)}
                    aria-label="Écouter"
                    className="stamp h-9 w-9 shrink-0 border-ink/15 dark:border-cream/20 text-sm bg-card dark:bg-dusk-card active:scale-90 transition-transform"
                  >
                    🔊
                  </button>
                  <div>
                    <div className="text-xs font-mono text-ink-soft dark:text-cream/50">{line.speaker}</div>
                    <div className="text-ink dark:text-cream">{line.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep('question')}
              className="rounded-full bg-coral text-white font-semibold px-6 py-3 active:scale-95 transition-transform"
            >
              J'ai compris, la suite →
            </button>
          </div>
        )}

        {step === 'question' && (
          <div className="ticket-card px-6 py-7 flex flex-col items-center gap-5 text-center animate-popIn">
            <p className="font-display text-lg font-semibold text-ink dark:text-cream">
              {scenario.comprehensionQuestion.prompt}
            </p>
            <div className="w-full flex flex-col gap-3">
              {scenario.comprehensionQuestion.options.map((option) => {
                const isSelected = selectedOption === option
                const isAnswer = option === scenario.comprehensionQuestion.answer
                let style = 'bg-paper dark:bg-dusk border-ink/10 dark:border-cream/10 text-ink dark:text-cream'
                if (isSelected && isAnswer) style = 'bg-pine/15 border-pine text-pine'
                if (isSelected && !isAnswer) style = 'bg-rust/10 border-rust text-rust'
                return (
                  <button
                    key={option}
                    disabled={Boolean(selectedOption)}
                    onClick={() => {
                      setSelectedOption(option)
                      setTimeout(() => setStep('expression'), 700)
                    }}
                    className={`rounded-2xl border-2 px-4 py-3 text-left transition-colors ${style}`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 'expression' && (
          <div className="ticket-card px-6 py-7 flex flex-col items-center gap-4 text-center animate-popIn">
            <span className="text-xs font-mono uppercase tracking-wide text-ink-soft dark:text-cream/60">
              Expression à retenir
            </span>
            <SpeakButton text={scenario.targetExpression.en} />
            <p className="font-display text-2xl font-semibold text-ink dark:text-cream">
              {scenario.targetExpression.en}
            </p>
            <p className="text-ink-soft dark:text-cream/70">{scenario.targetExpression.fr}</p>
            <button
              onClick={() => (scenario.reuseSentenceStarter ? setStep('reuse') : finishSession())}
              className="rounded-full bg-coral text-white font-semibold px-6 py-3 active:scale-95 transition-transform"
            >
              {scenario.reuseSentenceStarter ? 'À toi de jouer →' : 'Terminer'}
            </button>
          </div>
        )}

        {step === 'reuse' && scenario.reuseSentenceStarter && (
          <div className="ticket-card px-6 py-7 flex flex-col items-center gap-4 text-center animate-popIn">
            <p className="text-ink dark:text-cream">{scenario.reuseSentenceStarter}</p>
            <input
              autoFocus
              value={reuseText}
              onChange={(e) => setReuseText(e.target.value)}
              placeholder="Écris ta phrase..."
              className="w-full rounded-2xl border-2 border-ink/10 dark:border-cream/10 bg-paper dark:bg-dusk px-4 py-3 text-ink dark:text-cream outline-none focus:border-coral"
            />
            <button
              onClick={finishSession}
              disabled={reuseText.trim().length === 0}
              className="rounded-full bg-coral text-white font-semibold px-6 py-3 disabled:opacity-40 active:scale-95 transition-transform"
            >
              Terminer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
