// "Mot du jour" : un message chaleureux qui change selon la date, affiché sur
// l'accueil. Volontairement doux et jamais culpabilisant — pas de rappel
// "tu n'es pas venue depuis 3 jours", juste un petit mot sympa.
export const DAILY_MESSAGES: string[] = [
  "Même 2 minutes, ça compte.",
  "Un petit pas aujourd'hui, et c'est déjà ça.",
  "Pas de pression, juste un moment pour toi.",
  "Chaque mot appris reste appris.",
  "Prends ce que tu as le temps de prendre.",
  "L'anglais se construit petit bout par petit bout.",
  "Aucune obligation, juste une invitation.",
  "Tu avances, même quand ça ne se voit pas.",
  "Une pause anglaise, comme une pause café.",
  "Pas besoin d'être parfaite pour progresser.",
  "Content(e) de te revoir.",
  "Le rythme que tu veux, quand tu veux.",
]

/** Choisit un message de façon stable pour la journée (change chaque jour). */
export function getDailyMessage(date: Date = new Date()): string {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  )
  return DAILY_MESSAGES[dayOfYear % DAILY_MESSAGES.length]
}
