import { speak, isSpeechSupported } from '../services/tts'

interface SpeakButtonProps {
  text: string
  size?: 'sm' | 'lg'
}

export default function SpeakButton({ text, size = 'lg' }: SpeakButtonProps) {
  if (!isSpeechSupported()) return null
  const dimension = size === 'lg' ? 'h-16 w-16 text-2xl' : 'h-10 w-10 text-base'
  return (
    <button
      onClick={() => speak(text)}
      aria-label="Écouter"
      className={`stamp ${dimension} border-ink/20 dark:border-cream/25 bg-card dark:bg-dusk-card text-ink dark:text-cream active:scale-90 transition-transform animate-floatSlow`}
    >
      🔊
    </button>
  )
}
