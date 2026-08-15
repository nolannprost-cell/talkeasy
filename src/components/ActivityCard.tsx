import { useNavigate } from 'react-router-dom'

interface ActivityCardProps {
  to: string
  emoji: string
  title: string
  subtitle: string
  accent: 'coral' | 'mustard' | 'pine' | 'blush'
  note?: string
}

const ACCENT_BG: Record<ActivityCardProps['accent'], string> = {
  coral: 'bg-coral/15 text-coral-dark dark:text-coral',
  mustard: 'bg-mustard/20 text-[#8a5f00] dark:text-mustard',
  pine: 'bg-pine/15 text-pine dark:text-[#7fd6bd]',
  blush: 'bg-blush/20 text-blush-deep dark:text-blush',
}

export default function ActivityCard({ to, emoji, title, subtitle, accent, note }: ActivityCardProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="ticket-card w-full text-left px-5 py-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
    >
      <div className={`stamp h-14 w-14 shrink-0 text-2xl border-current/30 ${ACCENT_BG[accent]}`}>
        <span aria-hidden>{emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-display text-lg font-semibold text-ink dark:text-cream">{title}</div>
        <div className="text-sm text-ink-soft dark:text-cream/70 truncate">{subtitle}</div>
      </div>
      {note && (
        <span className="shrink-0 rounded-full bg-paper dark:bg-dusk px-2.5 py-1 text-xs font-mono text-ink-soft dark:text-cream/60">
          {note}
        </span>
      )}
    </button>
  )
}
