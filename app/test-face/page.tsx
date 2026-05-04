'use client'

import { useState } from 'react'
import { useFaceDetection } from '@/hooks/useFaceDetection'
import type { SecretRecipeResponse } from '@/lib/types'

type SweetnessLevel = 'normal' | 'less' | 'no_sugar'

export default function TestFacePage() {
  const { videoRef, modelsLoaded, cameraActive, isScanning, error, startCamera, stopCamera, scanEmotion } =
    useFaceDetection()

  const [customerName, setCustomerName]     = useState('Ikhsan')
  const [sweetness, setSweetness]           = useState<SweetnessLevel>('normal')
  const [status, setStatus]                 = useState<string>('Siap')
  const [recipe, setRecipe]                 = useState<SecretRecipeResponse | null>(null)
  const [loading, setLoading]               = useState(false)

  async function handleScan() {
    if (!modelsLoaded) { setStatus('Model belum selesai load...'); return }

    setLoading(true)
    setRecipe(null)
    setStatus('Scanning ekspresi...')

    try {
      // ── 1. Scan emotion dari kamera ──────────────────────────
      const emotion = await scanEmotion()
      if (!emotion) { setStatus('Wajah tidak terdeteksi, coba lagi.'); setLoading(false); return }

      setStatus(`Detected: ${emotion.dominantEmotion} (${(emotion.confidenceScore * 100).toFixed(0)}%) — membuat session...`)

      // ── 2. Buat session ──────────────────────────────────────
      const sessionRes = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_source: 'face' }),
      })
      const { session } = await sessionRes.json()
      if (!session) throw new Error('Gagal buat session')

      setStatus(`Session dibuat (${session.id.slice(0, 8)}...) — memanggil LLM...`)

      // ── 3. Panggil face-recommend ─────────────────────────────
      const recipeRes = await fetch('/api/face-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id:       session.id,
          dominant_emotion: emotion.dominantEmotion,
          confidence_score: emotion.confidenceScore,
          customer_name:    customerName,
          sweetness_level:  sweetness,
        }),
      })
      const { recipe: result, error: apiErr } = await recipeRes.json()
      if (apiErr) throw new Error(apiErr)

      setRecipe(result)
      setStatus('Selesai!')
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8 flex flex-col gap-6 items-center">
      <h1 className="text-2xl font-bold">🧪 Test Face Scan Flow</h1>

      {/* ── Inputs ── */}
      <div className="flex gap-4">
        <input
          className="bg-gray-800 rounded px-3 py-2 text-sm"
          placeholder="Nama kamu"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
        />
        <select
          className="bg-gray-800 rounded px-3 py-2 text-sm"
          value={sweetness}
          onChange={e => setSweetness(e.target.value as SweetnessLevel)}
        >
          <option value="normal">Normal Sugar</option>
          <option value="less">Less Sugar</option>
          <option value="no_sugar">No Sugar</option>
        </select>
      </div>

      {/* ── Status ── */}
      <p className="text-sm text-gray-400">{status}</p>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <p className="text-xs text-gray-600">
        Model: {modelsLoaded ? '✅ loaded' : '⏳ loading...'}
      </p>

      {/* ── Video ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="rounded-lg w-80 h-60 bg-gray-800 object-cover"
      />

      {/* ── Controls ── */}
      <div className="flex gap-3">
        {!cameraActive ? (
          <button
            onClick={startCamera}
            className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded text-sm"
          >
            Mulai Kamera
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-sm"
          >
            Stop Kamera
          </button>
        )}
        <button
          onClick={handleScan}
          disabled={!cameraActive || isScanning || loading}
          className="bg-amber-700 hover:bg-amber-600 disabled:opacity-40 px-4 py-2 rounded text-sm"
        >
          {loading ? 'Loading...' : 'Scan & Rekomendasikan'}
        </button>
      </div>

      {/* ── Result ── */}
      {recipe && (
        <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full flex flex-col gap-2">
          <h2 className="text-lg font-bold text-amber-400">{recipe.recipe_name}</h2>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{recipe.persona}</p>
          <hr className="border-gray-700 my-1" />
          <p className="text-sm"><span className="text-gray-400">Bahan:</span> {recipe.ingredients}</p>
          <p className="text-sm"><span className="text-gray-400">Manfaat:</span> {recipe.benefits}</p>
          <p className="text-sm italic text-gray-300 mt-2">{recipe.narasi}</p>
        </div>
      )}
    </main>
  )
}
