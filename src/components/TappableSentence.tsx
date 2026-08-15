import { useState } from 'react'
import { MINI_DICTIONARY } from '../data/miniDictionary'
import { WORDS } from '../data/words'

interface TappableSentenceProps {
  text: string
  className?: string
}

function lookupTranslation(rawWord: string): string | null {
  const clean = rawWord.toLowerCase().replace(/[.,!?;:"]/g, '')
  if (!clean) return null

  // priorité au vocabulaire déjà présent dans l'appli (traduction officielle)
  const known = WORDS.find((w) => w.en.toLowerCase() === clean)
  if (known) return known.fr

  return MINI_DICTIONARY[clean] ?? null
}

/**
 * Affiche une phrase anglaise où chaque mot est tappable : au tap, une bulle
 * montre sa traduction française. Pensé pour le téléphone (pas besoin de
 * sélectionner du texte). Couvre le vocabulaire de l'appli + les mots
 * courants — un mot absent affiche juste "traduction non disponible".
 */
export default function TappableSentence({ text, className }: TappableSentenceProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const tokens = text.split(/(\s+)/) // garde les espaces comme tokens pour préserver la mise en page

  return (
    <span className={className}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return <span key={i}>{token}</span>
        const translation = lookupTranslation(token)
        const isActive = activeIndex === i
        return (
          <span key={i} className="relative inline-block">
            <button
              type="button"
              onClick={() => setActiveIndex(isActive ? null : i)}
              className={`rounded px-0.5 -mx-0.5 transition-colors ${isActive ? 'bg-coral/20' : 'active:bg-coral/10'}`}
            >
              {token}
            </button>
            {isActive && (
              <span className="absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-xl bg-ink px-3 py-1.5 text-xs font-medium text-cream shadow-lg">
                {translation ?? 'traduction non disponible'}
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
