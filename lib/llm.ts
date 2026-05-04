import { JAMOO_SYSTEM_PROMPT } from './constants'

// ── Unified LLM client ────────────────────────────────────
// Support Gemini dan Groq, pilih via env LLM_PROVIDER

export async function callLLM(userPrompt: string): Promise<string> {
  const provider = process.env.LLM_PROVIDER ?? 'gemini'

  if (provider === 'groq') {
    return callGroq(userPrompt)
  }
  return callGemini(userPrompt)
}

// ── Gemini ────────────────────────────────────────────────
async function callGemini(userPrompt: string): Promise<string> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: JAMOO_SYSTEM_PROMPT,
  })

  const result = await model.generateContent(userPrompt)
  const text = result.response.text()

  // Strip markdown code block kalau ada
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
}

// ── Groq ──────────────────────────────────────────────────
async function callGroq(userPrompt: string): Promise<string> {
  const Groq = (await import('groq-sdk')).default
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: JAMOO_SYSTEM_PROMPT },
      { role: 'user',   content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 500,
  })

  return completion.choices[0]?.message?.content ?? '{}'
}
