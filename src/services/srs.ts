import type { ExerciseKind, WordProgress } from '../types'
import { getOrCreateProgress, saveProgress } from './storage'

// Répétition espacée volontairement simple (cahier des charges : pas de formule
// complexe pour le MVP). Principe façon "boîtes de Leitner" :
//   - une bonne réponse fait progresser d'une boîte -> l'intervalle avant la
//     prochaine révision augmente.
//   - une mauvaise réponse fait reculer de deux boîtes -> le mot revient vite.
// Le score de maîtrise (0-100) monte plus vite si le mot est réussi dans des
// contextes DIFFÉRENTS (recall, phrase à trous, écoute, production) : reconnaître
// un mot une seule fois ne suffit jamais à le considérer "maîtrisé".

const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30]

function boxFromMastery(mastery: number): number {
  return Math.min(BOX_INTERVAL_DAYS.length - 1, Math.floor(mastery / 20))
}

export function isMastered(progress: WordProgress): boolean {
  return progress.masteryScore >= 80 && progress.contextsUsed.length >= 3
}

export function recordAnswer(
  wordId: string,
  kind: ExerciseKind,
  correct: boolean,
  responseTimeMs: number
): WordProgress {
  const progress = getOrCreateProgress(wordId)

  progress.seenCount += 1
  progress.lastSeen = new Date().toISOString()
  progress.avgResponseTimeMs =
    progress.avgResponseTimeMs === 0
      ? responseTimeMs
      : Math.round(progress.avgResponseTimeMs * 0.7 + responseTimeMs * 0.3)

  if (correct) {
    progress.correctCount += 1
    const isNewContext = !progress.contextsUsed.includes(kind)
    if (isNewContext) progress.contextsUsed.push(kind)
    // un nouveau type de contexte réussi vaut plus qu'une répétition du même exercice
    const gain = isNewContext ? 22 : 10
    progress.masteryScore = Math.min(100, progress.masteryScore + gain)
  } else {
    progress.wrongCount += 1
    progress.masteryScore = Math.max(0, progress.masteryScore - 15)
  }

  const box = boxFromMastery(progress.masteryScore)
  const intervalDays = correct ? BOX_INTERVAL_DAYS[box] : 0
  const due = new Date()
  due.setDate(due.getDate() + intervalDays)
  // un échec fait toujours revenir le mot dans la même session ou le lendemain, pas dans 1 mois
  progress.dueDate = correct ? due.toISOString() : new Date(Date.now() + 1000 * 60 * 10).toISOString()

  saveProgress(progress)
  return progress
}

/** Mots dus aujourd'hui ou en retard, triés du plus urgent au moins urgent. */
export function getDueWordIds(allProgress: Record<string, WordProgress>): string[] {
  const now = Date.now()
  return Object.values(allProgress)
    .filter((p) => new Date(p.dueDate).getTime() <= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .map((p) => p.wordId)
}
