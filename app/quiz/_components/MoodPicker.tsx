"use client"

import React from "react"
import type { QuestionnaireData } from '@/lib/types'

interface Props {
  formData: QuestionnaireData
  setFormData: (d: QuestionnaireData) => void
  onNext: () => void
}

export default function MoodPicker({ formData, setFormData, onNext }: Props) {
  const moods = [
    { key: 'energetic', label: 'Energetic', img: '/quiz/Energetic.jpg' },
    { key: 'relaxed', label: 'Relaxed', img: '/quiz/Relaxed.jpg' },
    { key: 'focused', label: 'Focused', img: '/quiz/Focus.png' },
  ]

  return (
    <div className="bg-white rounded-t-3xl p-6 shadow-lg flex flex-col flex-1 relative w-full mt-4">
      <h2 className="text-2xl font-extrabold text-[#2D1A10] text-center mb-6">Pick Your Mood!</h2>

      {/* Mood buttons with flex-grow to push mascot down */}
      <div className="space-y-4 grow">
        {moods.map((m) => (
          <button
            key={m.key}
            onClick={() => {
              setFormData({ ...formData, mood: m.key })
              onNext()
            }}
            className="w-full h-24 rounded-xl bg-white/90 shadow-md flex items-center justify-center text-xl font-bold"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${m.img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '4px solid rgba(74,88,32,0.9)'
            }}
          >
            <span className="text-white drop-shadow-md">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Spacer dihapus karena flex-1 sudah mengisi ruang kosong sampai bawah */}
      
      {/* Mascot overlapping at bottom right edge */}
      <div className="absolute bottom-0 -right-4 w-44 h-44 z-50 pointer-events-none translate-y-4 translate-x-4">
        <img 
          src="/quiz/mascot.png" 
          alt="Jamoo Mascot" 
          className="w-full h-full object-contain drop-shadow-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>
    </div>
  )
}
