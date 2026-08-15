interface MilestoneCelebrationProps {
  emoji: string
  message: string
  onDismiss: () => void
}

// Petit écran de célébration discret pour un jalon atteint (pas un système
// de points ou de streak — juste un moment sympa, une fois, sans pression).
export default function MilestoneCelebration({ emoji, message, onDismiss }: MilestoneCelebrationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6" onClick={onDismiss}>
      <div
        className="ticket-card px-7 py-8 max-w-xs w-full flex flex-col items-center gap-4 text-center animate-popIn"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-5xl animate-stampDown">{emoji}</span>
        <p className="font-display text-lg font-semibold text-ink leading-snug">{message}</p>
        <button
          onClick={onDismiss}
          className="rounded-full bg-coral text-white font-semibold px-6 py-2.5 text-sm active:scale-95 transition-transform"
        >
          Merci !
        </button>
      </div>
    </div>
  )
}
