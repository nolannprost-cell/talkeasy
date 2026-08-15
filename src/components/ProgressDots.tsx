interface ProgressDotsProps {
  total: number
  current: number
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-2" aria-label={`Étape ${current + 1} sur ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current
              ? 'w-6 bg-coral'
              : i < current
                ? 'w-1.5 bg-pine/70'
                : 'w-1.5 bg-ink/10 dark:bg-cream/15'
          }`}
        />
      ))}
    </div>
  )
}
