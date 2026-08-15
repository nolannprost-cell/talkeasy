import type { Exercise, ExerciseKind, WordEntry, WordProgress } from '../types'
import { WORDS } from '../data/words'
import { getDueWordIds, isMastered } from './srs'
import { loadAllProgress, loadProfile } from './storage'

// Construit les exercices affichés un par un dans "3 minutes" et "Review".
// Le principe : ne jamais reconstruire un exercice figé, toujours partir du
// mot + de sa phrase d'exemple pour rester dans du "vrai anglais" en contexte.

const LEVEL_ORDER = ['beginner', 'elementary', 'intermediate'] as const

/**
 * Le niveau choisi à l'inscription sert de plafond de difficulté : une
 * débutante ne voit que du vocabulaire "beginner" au départ. On débloque le
 * niveau suivant tous les 8 mots maîtrisés, pour ne pas rester bloquée mais
 * sans la noyer dès le premier jour.
 */
function getAvailableWords(): WordEntry[] {
  const profile = loadProfile()
  const progress = loadAllProgress()
  const masteredCount = Object.values(progress).filter(isMastered).length

  const baseIndex = profile ? LEVEL_ORDER.indexOf(profile.level) : 0
  const bonus = Math.floor(masteredCount / 8)
  const maxIndex = Math.min(LEVEL_ORDER.length - 1, baseIndex + bonus)

  return WORDS.filter((w) => !w.excludeForNow && LEVEL_ORDER.indexOf(w.level) <= maxIndex)
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickDistractors(correct: WordEntry, field: 'en' | 'fr', count = 2): string[] {
  const pool = WORDS.filter((w) => w.id !== correct.id && w.category === correct.category)
  const backupPool = WORDS.filter((w) => w.id !== correct.id)
  const source = pool.length >= count ? pool : backupPool
  return shuffle(source)
    .slice(0, count)
    .map((w) => w[field])
}

function makeExercise(word: WordEntry, kind: ExerciseKind, variant: 0 | 1 = 0): Exercise {
  const id = `${word.id}_${kind}_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  const useAlt = variant === 1 && word.example2 && word.example2Fr
  const exEn = useAlt ? word.example2! : word.example
  const exFr = useAlt ? word.example2Fr! : word.exampleFr

  switch (kind) {
    case 'recall-en': {
      const options = shuffle([word.en, ...pickDistractors(word, 'en')])
      return {
        id,
        kind,
        wordId: word.id,
        prompt: word.fr,
        promptFr: 'Trouve le mot en anglais',
        options,
        answer: word.en,
        explanation: `"${word.fr}" se dit "${word.en}". Exemple : ${exEn} (${exFr})`,
      }
    }
    case 'recall-fr': {
      const options = shuffle([word.fr, ...pickDistractors(word, 'fr')])
      return {
        id,
        kind,
        wordId: word.id,
        prompt: word.en,
        promptFr: 'Que veut dire ce mot ?',
        options,
        answer: word.fr,
        audioText: word.en,
        explanation: `"${word.en}" veut dire "${word.fr}". Exemple : ${exEn} (${exFr})`,
      }
    }
    case 'fill-blank': {
      const escaped = word.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const blanked = exEn.replace(new RegExp(escaped, 'i'), '____')
      if (blanked === exEn) {
        // le mot n'apparaît pas tel quel dans la phrase (verbe conjugué, forme
        // séparée...) : plutôt que d'afficher un "trou" qui ne masque rien,
        // on bascule sur un exercice de reconnaissance pour ce mot.
        return makeExercise(word, 'recall-en', variant)
      }
      return {
        id,
        kind,
        wordId: word.id,
        prompt: blanked,
        promptFr: `Le mot manquant veut dire "${word.fr}" — écris-le en anglais, juste le mot`,
        answer: word.en,
        // pas d'indice ici : la traduction française à côté suffit, un indice
        // en anglais donnerait la réponse (cf retour utilisatrice).
        explanation: `La phrase complète : "${exEn}" — ${exFr}`,
      }
    }
    case 'listening': {
      return {
        id,
        kind,
        wordId: word.id,
        prompt: 'Qu\'as-tu entendu ? Écoute puis choisis la traduction.',
        options: shuffle([word.fr, ...pickDistractors(word, 'fr')]),
        answer: word.fr,
        audioText: exEn,
        explanation: `Tu as entendu : "${exEn}" — ça veut dire : ${exFr}`,
      }
    }
    case 'production': {
      return {
        id,
        kind,
        wordId: word.id,
        prompt: exFr,
        promptFr: `Traduis cette phrase en anglais, en utilisant "${word.en}"`,
        answer: word.en, // validation souple : on vérifie juste que le mot est présent
        // pas d'indice : afficher la phrase anglaise donnerait directement la réponse à copier.
        explanation: `Traduction : "${exEn}"`,
      }
    }
  }
}

function pickSessionWords(count: number): WordEntry[] {
  const available = getAvailableWords()
  const availableIds = new Set(available.map((w) => w.id))
  const progress = loadAllProgress()
  const dueIds = getDueWordIds(progress).filter((id) => availableIds.has(id))
  const dueWords = dueIds.map((id) => WORDS.find((w) => w.id === id)).filter(Boolean) as WordEntry[]
  const seenIds = new Set(Object.keys(progress))
  const newWords = available.filter((w) => !seenIds.has(w.id))

  const selection: WordEntry[] = []
  const usedIds = new Set<string>()

  // priorité aux mots dus, puis on complète avec des mots jamais vus, puis avec le reste
  for (const w of shuffle(dueWords)) {
    if (selection.length >= count) break
    if (usedIds.has(w.id)) continue
    selection.push(w)
    usedIds.add(w.id)
  }
  for (const w of shuffle(newWords)) {
    if (selection.length >= count) break
    if (usedIds.has(w.id)) continue
    selection.push(w)
    usedIds.add(w.id)
  }
  if (selection.length < count) {
    for (const w of shuffle(available)) {
      if (selection.length >= count) break
      if (usedIds.has(w.id)) continue
      selection.push(w)
      usedIds.add(w.id)
    }
  }
  return selection
}

/** Session "3 minutes" : mini-exercices variés, un par mot sélectionné. */
export function generateThreeMinuteSession(): Exercise[] {
  const words = pickSessionWords(6)
  const kinds: ExerciseKind[] = ['recall-en', 'fill-blank', 'listening', 'recall-fr', 'production', 'recall-en']
  return words.map((w, i) => makeExercise(w, kinds[i % kinds.length]))
}

/**
 * Session "Review" : pour chaque mot dû, propose la prochaine étape logique
 * (reconnaissance -> phrase à trous -> production), comme l'exemple "avoid" du brief.
 */
export function generateReviewSession(): Exercise[] {
  const progress = loadAllProgress()
  const dueIds = getDueWordIds(progress)
  const words = dueIds.length > 0 ? dueIds.map((id) => WORDS.find((w) => w.id === id)!).filter(Boolean) : pickSessionWords(5)

  const sequence: ExerciseKind[] = ['recall-en', 'fill-blank', 'production']

  return words.slice(0, 8).map((word) => {
    const p: WordProgress | undefined = progress[word.id]
    const doneKinds = p?.contextsUsed ?? []
    const nextKind = sequence.find((k) => !doneKinds.includes(k)) ?? sequence[doneKinds.length % sequence.length]
    return makeExercise(word, nextKind)
  })
}

/** Session thématique : utilisée par l'activité Music pour coller à l'ambiance choisie. */
export function generateThemedSession(categories: WordEntry['category'][], count = 6): Exercise[] {
  const progress = loadAllProgress()
  const pool = WORDS.filter((w) => categories.includes(w.category))
  const source = pool.length >= 3 ? pool : WORDS
  const dueIds = new Set(getDueWordIds(progress))
  const sorted = shuffle(source).sort((a, b) => Number(dueIds.has(b.id)) - Number(dueIds.has(a.id)))
  const words = sorted.slice(0, count)
  const kinds: ExerciseKind[] = ['recall-en', 'fill-blank', 'listening', 'recall-fr', 'production', 'recall-en']
  return words.map((w, i) => makeExercise(w, kinds[i % kinds.length]))
}

/**
 * Session ciblée sur un ou plusieurs mots qui viennent de poser problème :
 * 3 exercices par mot (reconnaissance -> phrase à trous -> production), avec
 * une phrase différente à chaque fois pour ne pas juste répéter l'exercice de
 * base. Si plusieurs mots sont concernés, on les entrelace pour ne jamais
 * enchaîner 3 fois de suite le même mot.
 */
export function generateFocusSession(wordIds: string[]): Exercise[] {
  const sequence: ExerciseKind[] = ['recall-en', 'fill-blank', 'production']
  const variants: (0 | 1)[] = [0, 1, 1] // la reconnaissance n'affiche pas de phrase, les 2 suivantes varient
  const words = wordIds.map((id) => WORDS.find((w) => w.id === id)).filter(Boolean) as WordEntry[]

  const perWord = words.map((word) => sequence.map((kind, i) => makeExercise(word, kind, variants[i])))

  const interleaved: Exercise[] = []
  for (let step = 0; step < sequence.length; step++) {
    for (const wordExercises of perWord) interleaved.push(wordExercises[step])
  }
  return interleaved
}

export function getDueCount(): number {
  return getDueWordIds(loadAllProgress()).length
}

/** Liste des identifiants de mots dus, pour l'accès "retravailler mes mots" depuis l'accueil. */
export function getDueWordIdList(limit = 4): string[] {
  return getDueWordIds(loadAllProgress()).slice(0, limit)
}
