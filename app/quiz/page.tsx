'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ResultCard from './_components/ResultCard'
import MoodPicker from './_components/MoodPicker'
import NeedsPicker from './_components/NeedsPicker'
import SweetnessPicker from './_components/SweetnessPicker'
import MedicalInfo from './_components/MedicalInfo'
import ResultList from './_components/ResultList'
import type { QuestionnaireData, RecommendationResponse } from '@/lib/types'

export default function QuizPage() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [formData, setFormData] = useState<QuestionnaireData>({
    mood: '',
    feels: '',
    sweetness: 'normal',
    free_text: '',
  })
  const [results, setResults] = useState<RecommendationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'pickMood' | 'chooseNeeds' | 'sweetness' | 'medicalInfo' | 'results'>('pickMood')
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_source: 'questions' }),
        })
        if (res.ok) {
          const json = await res.json()
          setSessionId(json.session?.id ?? null)
        }
      } catch (err) {
        console.error('[Quiz] session init error', err)
      }
    }
    init()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!formData.mood || !formData.feels) {
      setError('Please answer required questions')
      return
    }
    if (!sessionId) {
      setError('Session not initialized')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, questionnaire: formData }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Recommendation failed')
      }
      const { recommendation } = await res.json()
      setResults(recommendation)
    } catch (err) {
      console.error('[Quiz] recommend error', err)
      setError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = (menuId: string) => {
    if (!sessionId) return setError('Session missing')
    
    const selectedItem = results?.top3.find(m => m.menu_id === menuId)
    if (!selectedItem) return

    const swMap: Record<string, string> = {
      'normal': 'NORMAL',
      'less': 'LESS SUGAR',
      'no_sugar': 'NO SUGAR'
    }

    const orderData = {
      sessionId,
      menuId,
      name: selectedItem.menu_name,
      sweetnessRaw: formData.sweetness,
      sweetnessBag: swMap[formData.sweetness] || 'NORMAL',
      unitPrice: selectedItem.price ?? 0,
      imageUrl: selectedItem.image_url ?? '',
    }

    sessionStorage.setItem('jamoo_quiz_order', JSON.stringify(orderData))
    router.push('/quiz/menu-detail')
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-3 px-6 overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/quiz/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md mt-6 flex-1 flex flex-col pb-0">
        <button
          onClick={() => router.back()}
          className="mb-1 w-fit"
          aria-label="Go back"
        >
          <img src="/quiz/Arrow.svg" alt="Back" className="h-5 w-5" />
        </button>

        {!results && (
          <h1 className="mb-4 text-xl font-bold text-white text-center">Let's get to know you first!</h1>
        )}

        {step === 'pickMood' && (
          <MoodPicker formData={formData} setFormData={setFormData} onNext={() => setStep('chooseNeeds')} />
        )}

        {step === 'chooseNeeds' && (
          <NeedsPicker formData={formData} setFormData={setFormData} onNext={() => setStep('sweetness')} onBack={() => setStep('pickMood')} />
        )}

        {step === 'sweetness' && (
          <SweetnessPicker formData={formData} setFormData={setFormData} onNext={() => setStep('medicalInfo')} onBack={() => setStep('chooseNeeds')} />
        )}

        {step === 'medicalInfo' && !results && (
          <MedicalInfo formData={formData} setFormData={setFormData} onBack={() => setStep('sweetness')} onSubmit={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)} />
        )}

        {results && (
          <>
            <h1 className="mb-4 text-2xl font-extrabold text-white text-center drop-shadow-lg">
              Here are our top JAMOO picks for you!
            </h1>
            <div className="bg-white/95 p-4 rounded-lg shadow space-y-3">
            {results.top3.map((item, i) => (
              <ResultCard
                key={`${item.menu_id}-${i}`}
                rank={i + 1}
                menu_id={item.menu_id}
                menu_name={item.menu_name}
                description={item.description ?? ''}
                imageUrl={item.image_url ?? null}
                price={item.price}
                isSelected={selectedMenuId === item.menu_id}
                onSelect={setSelectedMenuId}
              />
            ))}

            <button
              onClick={() => selectedMenuId && handleAccept(selectedMenuId)}
              disabled={!selectedMenuId || loading}
              className="w-full mt-6 py-3 rounded-xl bg-[#5b7f1d] text-white text-lg font-semibold shadow-md hover:bg-[#4a6917] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : 'PICK JAMOO'}
            </button>

          </div>
          </>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && !results && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm px-6 animate-in fade-in zoom-in-95 duration-500">
          <img src="/quiz/hourglass.svg" alt="Loading" className="w-32 h-32 mb-6 animate-pulse object-contain" />
          <h2 className="text-[24px] font-extrabold text-white text-center max-w-[340px] leading-tight drop-shadow-xl">
            Hold on, crafting a recipe based on your answer...
          </h2>
        </div>
      )}
    </div>
  )
}
