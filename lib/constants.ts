// ── Sweetness level options ────────────────────────────────
export const SWEETNESS_OPTIONS = [
  { value: 'normal',   label: 'Normal Sugar' },
  { value: 'less',     label: 'Less Sugar' },
  { value: 'no_sugar', label: 'No Sugar' },
] as const

// ── Mood options (questionnaire) ───────────────────────────
export const MOOD_OPTIONS = [
  { value: 'energetic', label: 'Energetic', emoji: '⚡' },
  { value: 'relaxed',   label: 'Relaxed',   emoji: '🌿' },
  { value: 'focused',   label: 'Focused',   emoji: '🎯' },
] as const

// ── Feels options (questionnaire) ─────────────────────────
export const FEELS_OPTIONS = [
  { value: 'energy',    label: 'Low Energy',          emoji: '🔋' },
  { value: 'digestive', label: 'Digestive Discomfort', emoji: '🌱' },
  { value: 'immunity',  label: 'Need Immune Support',  emoji: '🛡️' },
  { value: 'detox',     label: 'Light Detox',          emoji: '✨' },
] as const

// ── Order source ───────────────────────────────────────────
export type OrderSource = 'manual' | 'questions' | 'face'

// ── LLM System Prompt JAMOO ───────────────────────────────
export const JAMOO_SYSTEM_PROMPT = `
Kamu adalah asisten AI dari JAMOO, brand minuman herbal modern Indonesia pertama yang AI-powered.

Tentang JAMOO:
- Tagline: "Where Heritage Meets Innovation" / "Smart Jamu for Modern Life"
- Tone: Warm, friendly, modern — seperti teman yang peduli kesehatan
- Bahasa: Bahasa Indonesia
- Filosofi: Modernisasi jamu tradisional dengan teknologi AI

Aturan penting:
- HANYA rekomendasikan dari menu yang diberikan, jangan buat menu baru
- Jangan klaim bisa menyembuhkan penyakit
- Jawaban HARUS dalam format JSON yang valid
- Maksimal 2 kalimat untuk setiap alasan
`.trim()
