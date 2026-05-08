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
      .select('id, name, price, image_url, secret_persona_name, secret_base_ingredients, secret_base_benefits, health_badge')
      .eq('is_secret', true)
      .eq('is_active', true)

    if (error || !personas || personas.length === 0) {
      throw new Error('No secret personas found in database')
    }

    console.log('[face-recommend] personas available:', personas.map(p => p.name))

    // ── Step 2: Format semua persona untuk di-inject ke LLM ──────
    // Shuffle dulu supaya LLM tidak selalu pilih persona pertama
    const shuffled = [...personas].sort(() => Math.random() - 0.5)

    const personaLibrary = shuffled
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
You are JAMOO's AI Recipe Creator. Based on the user's facial scan data, select the best matching persona and craft a personalized recipe description.

Face scan data:
- Dominant expression: ${dominant_emotion}
- Confidence: ${confidence_score ? (confidence_score * 100).toFixed(0) + '%' : 'unavailable'}
- Name: ${customer_name}
- Sweetness preference: ${sweetness_level}
${age ? `- Estimated age: ${age}` : ''}
${gender ? `- Gender: ${gender}` : ''}

Available personas (choose exactly ONE):
${personaLibrary}

Your tasks:
1. Analyze the combination of expression, age, and gender holistically to select the most suitable persona
2. Create a creative recipe name: "${customer_name}'s [creative English name]"
3. List the ingredients as a clean comma-separated list of ingredient names only (e.g. "Temulawak, Jahe, Kunyit, Serai") — no intro phrases, no "and", no descriptions
4. Write the benefits in a warm, inviting tone
5. Write a 2-3 sentence description explaining why this blend was chosen and what it does for the body — do NOT mention the user's age or gender directly

IMPORTANT:
- Choose only 1 persona
- Do not add or change ingredients/benefits beyond what is in the library
- Use the menu_id from the chosen persona
- All output must be in English
- ingredients must be a plain comma-separated list of names, nothing else

Reply ONLY with valid JSON, no other text:
{
  "menu_id": "uuid of chosen persona",
  "persona": "chosen persona name",
  "recipe_name": "${customer_name}'s [creative name]",
  "ingredients": "Ingredient One, Ingredient Two, Ingredient Three",
  "benefits": "rewritten base_benefits in warm tone",
  "narasi": "2-3 sentences on why this blend suits the user and its key benefits"
}
`.trim()

    const llmRaw = await callLLM(userPrompt)
    const recipe: SecretRecipeResponse = JSON.parse(llmRaw)

    const selectedMenu = personas.find(p => p.id === recipe.menu_id)
    recipe.price     = selectedMenu?.price ?? 0
    recipe.menu_name = selectedMenu?.name ?? ''
    recipe.image_url = selectedMenu?.image_url ?? null

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
