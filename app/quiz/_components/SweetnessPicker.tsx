"use client"

import React from 'react'
import type { QuestionnaireData } from '@/lib/types'

interface Props {
  formData: QuestionnaireData
  setFormData: (d: QuestionnaireData) => void
  onNext: () => void
  onBack: () => void
}

export default function SweetnessPicker({ formData, setFormData, onNext, onBack }: Props) {
  const sweetnessValue = formData.sweetness === 'no_sugar' ? 0 : formData.sweetness === 'less' ? 35 : 70
  const sliderFillPercent = (sweetnessValue / 70) * 100

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)

    const nextSweetness = value < 18 ? 'no_sugar' : value < 53 ? 'less' : 'normal'
    setFormData({ ...formData, sweetness: nextSweetness })
  }

  return (
    <div className="bg-white rounded-t-3xl p-6 shadow-lg flex flex-col flex-1 relative w-full mt-4 overflow-hidden min-h-0">
      <h2 className="text-2xl font-extrabold text-[#2D1A10] text-center mb-6">Sweetness Level</h2>

      <div className="flex flex-col items-center justify-between grow pb-1 min-h-0">
        <div className="relative flex flex-col items-center justify-center pt-2 pb-4">
          <div className="relative w-48 h-60 md:w-52 md:h-64 flex items-center justify-center">
            <img
              src="/quiz/Cup.svg"
              alt="Sweetness cup"
              className="absolute inset-0 h-full w-full object-contain"
            />

            <div
              className="absolute left-1/2 -translate-x-1/2 text-center transition-all duration-200"
              style={{ top: sweetnessValue === 0 ? '6.8rem' : sweetnessValue === 35 ? '5.6rem' : '4.2rem' }}
            >
              <div className="text-4xl md:text-5xl font-extrabold text-black leading-none">{sweetnessValue}%</div>
              <div className="text-xs md:text-sm font-semibold text-black mt-1">
                {formData.sweetness === 'no_sugar' ? 'No sugar' : formData.sweetness === 'less' ? 'Less sugar' : 'Normal sugar'}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-88">
          <div className="text-center text-sm md:text-base text-[#2D1A10] mb-3">Find your sweet spot</div>

          <div className="rounded-3xl bg-white p-4 shadow-[0_6px_18px_rgba(0,0,0,0.14)] border border-[#f0eee8]">
            <div className="text-center text-base font-extrabold text-[#4b2f1c] mb-3">Slide to adjust</div>

            <input
              type="range"
              min={0}
              max={70}
              step={35}
              value={sweetnessValue}
              onChange={handleSliderChange}
              className="w-full"
              style={{
                accentColor: '#523921',
                background: `linear-gradient(90deg, #CFDF79 0%, #CFDF79 ${sliderFillPercent}%, #523921 ${sliderFillPercent}%, #523921 100%)`,
              }}
            />
          </div>

          <div className="mt-4">
            <button onClick={onNext} className="w-full py-3 rounded-xl bg-[#4b2f1c] text-white font-semibold">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
