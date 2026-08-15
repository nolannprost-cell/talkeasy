import FleurDeLisIcon from './FleurDeLisIcon'

interface FleurBouquetProps {
  className?: string
}

// Un bouquet fourni de lys (5 fleurs), noué d'un ruban — l'illustration
// principale, visible sur l'accueil en plus du motif discret présent sur
// toutes les pages (voir index.css).
const FLOWERS = [
  { left: '4%', size: '30%', rotate: '-16deg', opacity: 0.85 },
  { left: '24%', size: '38%', rotate: '-7deg', opacity: 0.95 },
  { left: '48%', size: '44%', rotate: '0deg', opacity: 1 },
  { left: '68%', size: '38%', rotate: '7deg', opacity: 0.95 },
  { left: '86%', size: '30%', rotate: '16deg', opacity: 0.85 },
]

export default function FleurBouquet({ className }: FleurBouquetProps) {
  return (
    <div className={`relative ${className ?? ''}`}>
      <div className="absolute inset-0">
        {FLOWERS.map((f, i) => (
          <div
            key={i}
            className="absolute bottom-[20%]"
            style={{ left: f.left, width: f.size, transform: `translateX(-50%) rotate(${f.rotate})`, opacity: f.opacity }}
          >
            <FleurDeLisIcon className="w-full h-auto" />
          </div>
        ))}
      </div>
      {/* ruban */}
      <svg viewBox="0 0 200 60" className="absolute bottom-0 left-1/2 w-[70%] -translate-x-1/2">
        <path
          d="M20 18 C 60 32, 140 32, 180 18 C 174 42, 140 52, 100 50 C 60 52, 26 42, 20 18 Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path d="M80 40 C 74 48, 66 54, 56 58" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M120 40 C 126 48, 134 54, 144 58" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" />
      </svg>
    </div>
  )
}
