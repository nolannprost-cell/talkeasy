// Lecture audio pour les activités Listen / Talk / Review.
// MVP : on utilise la synthèse vocale du navigateur (gratuite, fonctionne hors-ligne
// sur la plupart des appareils). Architecture prévue pour brancher plus tard de vrais
// fichiers audio (voix humaines) ou une API TTS : il suffira de changer `speak()` pour
// jouer un fichier `/audio/<id>.mp3` si disponible, avec ce moteur en repli.

let cachedVoice: SpeechSynthesisVoice | null = null

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  if (cachedVoice) return cachedVoice
  const voices = window.speechSynthesis.getVoices()
  cachedVoice =
    voices.find((v) => v.lang.startsWith('en-US')) ?? voices.find((v) => v.lang.startsWith('en')) ?? voices[0] ?? null
  return cachedVoice
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, rate = 0.95) {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = rate
  const voice = pickVoice()
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

// Certains navigateurs chargent les voix de façon asynchrone.
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null
  }
}
