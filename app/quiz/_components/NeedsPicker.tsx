"use client"

import React from 'react'
import type { QuestionnaireData } from '@/lib/types'

interface Props {
  formData: QuestionnaireData
  setFormData: (d: QuestionnaireData) => void
  onNext: () => void
  onBack: () => void
}

export default function NeedsPicker({ formData, setFormData, onNext, onBack }: Props) {
  const needs = [
    {
      key: 'energy',
      label: 'Low Energy',
      img: '/quiz/LowEnergy.png',
    },
    {
      key: 'digestive',
      label: 'Digestive',
      img: '/quiz/Digestive.png',
    },
    {
      key: 'immunity',
      label: 'Immune',
      img: '/quiz/Immune.png',
    },
    {
      key: 'detox',
      label: 'Detox',
      img: '/quiz/Detox.png',
    },
  ]

  return (
    <div className="bg-white rounded-t-3xl p-6 shadow-lg flex flex-col flex-1 relative w-full mt-4">
      <h2 className="text-2xl font-extrabold text-[#2D1A10] text-center mb-6">What are your health goals?</h2>

      <div className="space-y-4 grow">
        {needs.map((n) => (
          <button
            key={n.key}
            onClick={() => { setFormData({ ...formData, feels: n.key }); onNext() }}
            className="w-full h-24 rounded-xl overflow-hidden bg-[#4a5820] shadow-md flex items-center justify-center text-xl font-bold relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.30), rgba(0,0,0,0.30)), url('${n.img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              border: '4px solid rgba(74,88,32,0.9)',
              boxShadow: 'inset -3px 0 0 0 rgba(74,88,32,0.9), 0 4px 6px -1px rgba(0,0,0,0.1)'
            }}
          >
            <span className="text-white drop-shadow-md">{n.label}</span>
          </button>
        ))}
      </div>

    </div>
  )
}
