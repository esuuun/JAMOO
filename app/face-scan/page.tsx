'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { SweetnessLevel, SecretRecipeResponse } from '@/lib/types'
import type { EmotionResult } from '@/hooks/useFaceDetection'
import StepForm from './_components/StepForm'
import StepConsent from './_components/StepConsent'
import StepLoading from './_components/StepLoading'
import StepResult from './_components/StepResult'

// Dynamic import — face-api.js hanya boleh jalan di browser
const StepCamera = dynamic(() => import('./_components/StepCamera'), { ssr: false })

type Step = 'form' | 'consent' | 'camera' | 'loading' | 'result'

export interface FaceScanData {
  customerName: string
  sweetnessLevel: SweetnessLevel
  size: 'regular' | 'large'
}

export default function FaceScanPage() {
  const [step, setStep]         = useState<Step>('form')
  const [formData, setFormData] = useState<FaceScanData>({
    customerName: '',
    sweetnessLevel: 'normal',
    size: 'regular',
  })
  const [recipe, setRecipe]       = useState<SecretRecipeResponse | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)

  async function handleScanned(emotion: EmotionResult) {
    setStep('loading')
    try {
      // ── Buat session ──────────────────────────────────────────
      const sessionRes = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_source: 'face' }),
      })
      const { session } = await sessionRes.json()
      if (!session) throw new Error('Gagal buat session')
      setSessionId(session.id)

      // ── Panggil face-recommend ────────────────────────────────
      const recipeRes = await fetch('/api/face-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id:       session.id,
          dominant_emotion: emotion.dominantEmotion,
          confidence_score: emotion.confidenceScore,
          customer_name:    formData.customerName,
          sweetness_level:  formData.sweetnessLevel,
          age:              emotion.age,
          gender:           emotion.gender,
        }),
      })
      const { recipe: result, error: apiErr } = await recipeRes.json()
      if (apiErr) throw new Error(apiErr)

      setRecipe(result)
      setStep('result')
    } catch (err) {
      console.error('[FaceScan]', err)
      setStep('camera')
    }
  }

  return (
    <div className="min-h-screen bg-[#EDEBD2] flex flex-col items-center">
      {step === 'form' && (
        <StepForm data={formData} onChange={setFormData} onNext={() => setStep('consent')} />
      )}
      {step === 'consent' && (
        <StepConsent onAccept={() => setStep('camera')} onDecline={() => setStep('form')} />
      )}
      {step === 'camera' && (
        <StepCamera onScanned={handleScanned} />
      )}
      {step === 'loading' && <StepLoading />}
      {step === 'result' && recipe && sessionId && (
        <StepResult
          recipe={recipe}
          formData={formData}
          sessionId={sessionId}
          basePrice={recipe.price}
          onCancel={() => setStep('form')}
        />
      )}
    </div>
  )
}
