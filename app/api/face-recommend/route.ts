import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { callLLM } from '@/lib/llm'
import { FaceRecommendRequest, SecretRecipeResponse } from '@/lib/types'

// POST /api/face-recommend
// Flow: Make Your Own Jamoo (face scan)
// 1. Ambil SEMUA secret persona dari Supabase
// 2. Inject semua persona + data ekspresi ke LLM
// 3. LLM yang memilih persona paling cocok + generate narasi
//    → Lebih "AI" karena LLM bisa reasoning berdasarkan konteks
export async function POST(req: NextRequest) {
  try {
    const {
      session_id,
      dominant_emotion,
      confidence_score,
      customer_name,
      sweetness_level,
      age,
      gender,
    }: FaceRecommendRequest = await req.json()

    // ── Step 1: Ambil semua secret persona dari Supabase ─────────
    const { data: personas, error } = await supabase
      .from('menus')
      .select('id, secret_persona_name, secret_base_ingredients, secret_base_benefits, health_badge')
      .eq('is_secret', true)
      .eq('is_active', true)

    if (error || !personas || personas.length === 0) {
      throw new Error('No secret personas found in database')
    }

    // ── Step 2: Format semua persona untuk di-inject ke LLM ──────
    const personaLibrary = personas
      .map(p =>
        `ID: ${p.id}\n` +
        `Persona: ${p.secret_persona_name}\n` +
        `Ingredients: ${p.secret_base_ingredients}\n` +
        `Benefits: ${p.secret_base_benefits}\n` +
        `Badge: ${p.health_badge}`
      )
      .join('\n\n')

    // ── Step 3: LLM pilih persona + generate narasi ──────────────
    const userPrompt = `
Kamu adalah JAMOO Recipe Creator. Berdasarkan ekspresi wajah user, 
pilih 1 persona yang paling cocok dari library berikut, lalu generate narasi personal.

Data ekspresi user dari face scan:
- Ekspresi dominan: ${dominant_emotion}
- Confidence score: ${confidence_score ? (confidence_score * 100).toFixed(0) + '%' : 'tidak tersedia'}
- Nama: ${customer_name}
- Preferensi gula: ${sweetness_level}
${age ? `- Usia: ${age} tahun` : ''}
${gender ? `- Gender: ${gender}` : ''}

Library persona (pilih SALAH SATU yang paling cocok):
${personaLibrary}

Tugas kamu:
1. Analisis ekspresi "${dominant_emotion}" dan pilih persona yang paling sesuai secara psikologis dan emosional
2. Buat nama resep kreatif: "${customer_name}'s [nama kreatif Bahasa Inggris]"
3. Tulis ulang ingredients dengan gaya poetic tapi tetap informatif
4. Tulis ulang benefits dengan tone warm dan personal
5. Buat narasi 2-3 kalimat yang personal — jelaskan kenapa persona ini dipilih dan kenapa racikan ini cocok untuk mereka hari ini

PENTING:
- Pilih hanya 1 persona
- Jangan tambah atau ubah ingredients/benefits di luar yang ada di library
- Gunakan menu_id dari persona yang kamu pilih

Jawab HANYA dalam format JSON berikut, tanpa teks lain:
{
  "menu_id": "uuid dari persona yang dipilih",
  "persona": "nama persona yang dipilih",
  "recipe_name": "${customer_name}'s [nama kreatif]",
  "ingredients": "tulis ulang base_ingredients dengan gaya poetic",
  "benefits": "tulis ulang base_benefits dengan tone warm",
  "narasi": "2-3 kalimat personal kenapa persona ini cocok"
}
`.trim()

    const llmRaw = await callLLM(userPrompt)
    const recipe: SecretRecipeResponse = JSON.parse(llmRaw)

    // ── Simpan face scan session ke DB ────────────────────────────
    await supabase.from('face_scan_sessions').insert({
      session_id,
      dominant_emotion,
      mapped_mood: recipe.persona,   // persona yang dipilih LLM
      confidence_score,
      consent_given: true,
      image_deleted_at: new Date().toISOString(),
    })

    // Update session dengan detected mood
    await supabase
      .from('sessions')
      .update({
        detected_mood: dominant_emotion,
        ai_response: recipe,
      })
      .eq('id', session_id)

    return NextResponse.json({ recipe })
  } catch (err) {
    console.error('[POST /api/face-recommend]', err)
    return NextResponse.json({ error: 'Failed to process face scan' }, { status: 500 })
  }
}
