import type { ActivityId, SongTopic, UserProfile, WordProgress } from '../types'

// Toute la persistance MVP passe par localStorage. Chaque fonction est un petit
// wrapper typé — si un jour on veut migrer vers IndexedDB ou un backend, seul ce
// fichier a besoin de changer, le reste de l'app ne parle qu'à ces fonctions.

const KEYS = {
  profile: 'stopover.profile',
  progress: 'stopover.wordProgress',
  songs: 'stopover.songs',
  lessons: 'stopover.completedLessons',
  milestones: 'stopover.celebratedMilestones',
} as const

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // stockage plein ou indisponible (navigation privée) : on n'interrompt pas l'expérience
  }
}

// ---------- Profil ----------

export function loadProfile(): UserProfile | null {
  return read<UserProfile | null>(KEYS.profile, null)
}

export function saveProfile(profile: UserProfile) {
  write(KEYS.profile, profile)
}

export function createProfile(input: Pick<UserProfile, 'name' | 'level' | 'interests' | 'goals'>): UserProfile {
  const now = new Date().toISOString()
  const profile: UserProfile = {
    ...input,
    createdAt: now,
    lastOpenedAt: now,
    totalSessions: 0,
    totalMinutesApprox: 0,
    activityLog: [],
  }
  saveProfile(profile)
  return profile
}

export function logActivity(activityId: ActivityId, approxMinutes: number) {
  const profile = loadProfile()
  if (!profile) return
  profile.totalSessions += 1
  profile.totalMinutesApprox += approxMinutes
  profile.lastOpenedAt = new Date().toISOString()
  profile.activityLog.push({ activityId, date: profile.lastOpenedAt })
  // on garde un historique léger, pas un journal infini
  if (profile.activityLog.length > 100) {
    profile.activityLog = profile.activityLog.slice(-100)
  }
  saveProfile(profile)
}

// ---------- Progression des mots ----------

export function loadAllProgress(): Record<string, WordProgress> {
  return read<Record<string, WordProgress>>(KEYS.progress, {})
}

export function saveAllProgress(progress: Record<string, WordProgress>) {
  write(KEYS.progress, progress)
}

export function getOrCreateProgress(wordId: string): WordProgress {
  const all = loadAllProgress()
  if (all[wordId]) return all[wordId]
  const fresh: WordProgress = {
    wordId,
    seenCount: 0,
    correctCount: 0,
    wrongCount: 0,
    avgResponseTimeMs: 0,
    lastSeen: null,
    masteryScore: 0,
    contextsUsed: [],
    dueDate: new Date().toISOString(),
  }
  return fresh
}

export function saveProgress(progress: WordProgress) {
  const all = loadAllProgress()
  all[progress.wordId] = progress
  saveAllProgress(all)
}

// ---------- Chansons (activité Music) ----------

export function loadSongs(): SongTopic[] {
  return read<SongTopic[]>(KEYS.songs, [])
}

export function addSong(songQuery: string): SongTopic {
  const songs = loadSongs()
  const song: SongTopic = { id: `song_${Date.now()}`, songQuery, createdAt: new Date().toISOString() }
  songs.unshift(song)
  write(KEYS.songs, songs.slice(0, 20))
  return song
}

// ---------- Leçons "Bases" ----------

export function loadCompletedLessons(): string[] {
  return read<string[]>(KEYS.lessons, [])
}

export function markLessonComplete(lessonId: string) {
  const done = loadCompletedLessons()
  if (!done.includes(lessonId)) {
    done.push(lessonId)
    write(KEYS.lessons, done)
  }
}

// ---------- Jalons célébrés (petites attentions) ----------

export function loadCelebratedMilestones(): string[] {
  return read<string[]>(KEYS.milestones, [])
}

export function markMilestoneCelebrated(id: string) {
  const done = loadCelebratedMilestones()
  if (!done.includes(id)) {
    done.push(id)
    write(KEYS.milestones, done)
  }
}
