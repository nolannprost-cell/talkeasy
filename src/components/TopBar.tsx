import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  title: string
  onBack?: () => void
  right?: React.ReactNode
}

export default function TopBar({ title, onBack, right }: TopBarProps) {
  const navigate = useNavigate()
  return (
    <div className="safe-top flex items-center justify-between px-5 pb-3">
      <button
        onClick={() => (onBack ? onBack() : navigate('/'))}
        aria-label="Retour"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-card/80 dark:bg-dusk-card/80 text-ink dark:text-cream shadow-sm active:scale-90 transition-transform"
      >
        ←
      </button>
      <h1 className="font-display text-lg font-semibold text-ink dark:text-cream">{title}</h1>
      <div className="h-10 w-10">{right}</div>
    </div>
  )
}
