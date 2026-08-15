interface FleurDeLisIconProps {
  className?: string
}

/**
 * L'emblème classique de la fleur de lys héraldique (pointe centrale
 * arrondie/pincée à la base, deux boucles latérales, bandeau, petites
 * volutes). Forme à plat, sans dégradé.
 */
export default function FleurDeLisIcon({ className }: FleurDeLisIconProps) {
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden focusable="false" fill="currentColor">
      <path d="M100 8 C 60 60, 48 105, 62 138 C 68 152, 62 158, 58 165 C 54 174, 62 182, 78 178 C 88 175, 96 172, 100 172 C 104 172, 112 175, 122 178 C 138 182, 146 174, 142 165 C 138 158, 132 152, 138 138 C 152 105, 140 60, 100 8 Z" />
      <path d="M90 118 C 52 92, 12 96, 4 133 C -4 164, 20 188, 53 181 C 70 177, 80 165, 79 152 C 63 165, 40 163, 32 145 C 26 127, 43 113, 69 118 C 78 120, 85 124, 90 130 Z" />
      <path d="M110 118 C 148 92, 188 96, 196 133 C 204 164, 180 188, 147 181 C 130 177, 120 165, 121 152 C 137 165, 160 163, 168 145 C 174 127, 157 113, 131 118 C 122 120, 115 124, 110 130 Z" />
      <path d="M70 168 C 70 159, 130 159, 130 168 L 130 183 C 130 192, 70 192, 70 183 Z" />
      <path d="M70 185 C 57 181, 43 185, 41 198 C 39 210, 52 219, 65 212 C 56 210, 50 201, 54 193 C 57 187, 64 185, 70 187 Z" />
      <path d="M130 185 C 143 181, 157 185, 159 198 C 161 210, 148 219, 135 212 C 144 210, 150 201, 146 193 C 143 187, 136 185, 130 187 Z" />
      <path d="M82 188 C 84 204, 91 218, 100 230 C 109 218, 116 204, 118 188 C 109 195, 91 195, 82 188 Z" />
    </svg>
  )
}
