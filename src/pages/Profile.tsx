import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import type { UserProfile } from '../types'
import { WORDS, getWordById } from '../data/words'
import { loadAllProgress } from '../services/storage'
import { getDueWordIdList } from '../services/activityGenerator'
import { resizeImageFile } from '../utils/image'

interface ProfilePageProps {
  profile: UserProfile
  onUpdate: (patch: Partial<UserProfile>) => void
}

export default function ProfilePage({ profile, onUpdate }: ProfilePageProps) {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const progress = loadAllProgress()
  const discoveredCount = Object.values(progress).filter((p) => p.seenCount > 0).length
  const dueWords = getDueWordIdList(6)
    .map((id) => getWordById(id))
    .filter(Boolean)

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await resizeImageFile(file)
      onUpdate({ photoDataUrl: dataUrl })
    } catch {
      // silencieux : si la photo échoue, on garde simplement l'avatar par défaut
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="min-h-dvh max-w-md mx-auto flex flex-col pb-10">
      <TopBar title="Ton profil" />
      <div className="px-5 flex flex-col gap-4">
        <div className="ticket-card px-6 py-6 flex flex-col items-center gap-2 text-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-dashed border-coral/60 active:scale-95 transition-transform"
            aria-label="Changer la photo de profil"
          >
            {profile.photoDataUrl ? (
              <img src={profile.photoDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-coral/10 text-2xl font-display font-semibold text-coral-dark">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 bg-ink/70 text-cream text-[10px] py-0.5">
              {uploading ? '...' : 'Modifier'}
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          <h2 className="font-display text-xl font-semibold text-ink">{profile.name}</h2>
        </div>

        <div className="ticket-card px-5 py-4">
          <p className="text-xs font-mono uppercase tracking-wide text-ink-soft mb-1">Ton rythme</p>
          <p className="text-ink text-sm">
            {profile.totalSessions} session{profile.totalSessions !== 1 ? 's' : ''} · environ{' '}
            {profile.totalMinutesApprox} min au total
          </p>
          <p className="text-ink text-sm mt-1">
            {discoveredCount} mot{discoveredCount !== 1 ? 's' : ''} découvert{discoveredCount !== 1 ? 's' : ''} sur{' '}
            {WORDS.length}
          </p>
        </div>

        {dueWords.length > 0 && (
          <div className="ticket-card px-5 py-4">
            <p className="text-xs font-mono uppercase tracking-wide text-ink-soft mb-2">Mots à retravailler</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {dueWords.map((w) => (
                <span key={w!.id} className="rounded-full bg-rust/10 text-rust px-3 py-1 text-sm">
                  {w!.en}
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate('/focus')}
              className="w-full rounded-full bg-coral text-white font-semibold px-4 py-2.5 text-sm active:scale-95 transition-transform"
            >
              Les retravailler maintenant
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
