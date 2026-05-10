import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { callLLM } from '@/lib/llm'
import { RecommendRequest, RecommendationResponse } from '@/lib/types'

// POST /api/recommend
// Flow: Which Jamoo Suits You?
// 1. Rule-based filter dari Supabase (mood_tags + benefits)
// 2. Inject 2-3 kandidat ke LLM
// 3. LLM rank + beri alasan personal
export async function POST(req: NextRequest) {
  try {
    const { session_id, questionnaire }: RecommendRequest = await req.json()
    const { mood, feels, sweetness, free_text } = questionnaire

    // ── Step 1: Rule-based filter dari DB ──────────────────
    // Cari menu yang mood_tags mengandung mood user
    // DAN benefits mengandung kondisi user
    const { data: candidates, error } = await supabase
      .from('menus')
      .select('id, name, description, health_badge, benefits, mood_tags, price, main_ingredients, image_url')
      .eq('is_active', true)
      .eq('is_secret', false)
      .contains('mood_tags', [mood])
      .limit(4)

    if (error) throw error

    // Fallback: kalau filter terlalu ketat dan tidak ada hasil,
    // ambil semua menu non-secret
    let menuCandidates = candidates ?? []
    if (menuCandidates.length < 3) {
      const { data: allMenus } = await supabase
        .from('menus')
        .select('id, name, description, health_badge, benefits, mood_tags, price, main_ingredients, image_url')
        .eq('is_active', true)
        .eq('is_secret', false)
        .limit(6)
      
      const existingIds = new Set(menuCandidates.map(m => m.id))
      const additional = (allMenus ?? []).filter(m => !existingIds.has(m.id))
      menuCandidates = [...menuCandidates, ...additional].slice(0, 4)
    }

    // ── Step 2: Format kandidat untuk di-inject ke LLM ─────
    const menuContext = menuCandidates
      .map(m =>
        `ID: ${m.id} | Nama: ${m.name} | Khasiat: ${m.health_badge} | ` +
        `Benefits: ${m.benefits.join(', ')} | Mood: ${m.mood_tags.join(', ')} | ` +
        `Ingredients: ${m.main_ingredients}`
      )
      .join('\n')

    // ── Step 3: Inject ke LLM ──────────────────────────────
    const userPrompt = `
User menginformasikan kondisinya:
- Mood saat ini: ${mood}
- Kondisi tubuh: ${feels}
- Preferensi gula: ${sweetness}
${free_text ? `- Keluhan tambahan: "${free_text}"` : ''}

Menu yang tersedia (sudah difilter sistem):
${menuContext}

Tugasmu: Ranking menu di atas dari yang paling cocok untuk user ini.
Buat alasan yang personal, warm, dan relatable (max 2 kalimat).

Jawab HANYA dalam format JSON berikut, tanpa teks lain (maksimal 3 menu):
{
  "top3": [
    { "menu_id": "uuid", "menu_name": "nama menu", "reason": "alasan personal" }
  ]
}
`.trim()

    const llmRaw = await callLLM(userPrompt)
    const recommendation: RecommendationResponse = JSON.parse(llmRaw)

    // ── Step 4: Enrich top3 dengan image_url + price dari DB ─
    // Create a map dari menu data untuk quick lookup
    const menuMap = new Map(menuCandidates.map(m => [m.id, m]))

    // Filter valid recommendations & attach description + image_url + price
    const enrichedTop3 = recommendation.top3
      .filter(item => menuMap.has(item.menu_id))
      .map(item => ({
        ...item,
        description: menuMap.get(item.menu_id)?.description ?? null,
        image_url: menuMap.get(item.menu_id)?.image_url ?? null,
        price: menuMap.get(item.menu_id)?.price ?? 0,
      }))

    const enrichedRecommendation: RecommendationResponse = {
      top3: enrichedTop3,
    }

    // ── Simpan ai_response ke session ──────────────────────
    await supabase
      .from('sessions')
      .update({
        detected_mood: mood,
        questionnaire,
        ai_response: enrichedRecommendation,
      })
      .eq('id', session_id)

    return NextResponse.json({ recommendation: enrichedRecommendation })
  } catch (err) {
    console.error('[POST /api/recommend]', err)
    return NextResponse.json({ error: 'Failed to get recommendation' }, { status: 500 })
  }
}
