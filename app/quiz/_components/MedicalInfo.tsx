"use client"

import React from 'react'
import { useState } from 'react'
import type { QuestionnaireData } from '@/lib/types'

interface Props {
  formData: QuestionnaireData
  setFormData: (d: QuestionnaireData) => void
  onSubmit: () => void
  onBack: () => void
}

export default function MedicalInfo({ formData, setFormData, onSubmit, onBack }: Props) {
  const [symptoms, setSymptoms] = useState('')
  const [allergies, setAllergies] = useState('')

  const syncFreeText = (nextSymptoms: string, nextAllergies: string) => {
    const parts = []
    if (nextSymptoms.trim()) parts.push(`Symptoms: ${nextSymptoms.trim()}`)
    if (nextAllergies.trim()) parts.push(`Allergies: ${nextAllergies.trim()}`)
    setFormData({ ...formData, free_text: parts.join('\n') })
  }

  return (
    <div className="bg-white rounded-t-3xl p-6 shadow-lg flex flex-col flex-1 relative w-full mt-4 overflow-hidden min-h-0">
      <h2 className="text-2xl font-extrabold text-[#4b2f1c] text-center leading-tight mb-8">
        Any specific symptoms or medical history?
      </h2>

      <div className="flex flex-col justify-between grow min-h-0">
        <div className="space-y-6">
          <div>
            <textarea
              value={symptoms}
              onChange={(e) => {
                const nextValue = e.target.value.slice(0, 200)
                setSymptoms(nextValue)
                syncFreeText(nextValue, allergies)
              }}
              className="w-full h-28 rounded-3xl border border-[#e9e4dc] bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.08)] outline-none resize-none text-[#2D1A10] placeholder:text-[#8c7d71]"
              rows={4}
              placeholder="Type here..."
            />
          </div>

          <div>
            <p className="text-center text-sm md:text-base text-[#5d4636] mb-3 leading-tight">
              Let us know if you have any allergies!
            </p>
            <textarea
              value={allergies}
              onChange={(e) => {
                const nextValue = e.target.value.slice(0, 200)
                setAllergies(nextValue)
                syncFreeText(symptoms, nextValue)
              }}
              className="w-full h-20 rounded-3xl border border-[#e9e4dc] bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.08)] outline-none resize-none text-[#2D1A10] placeholder:text-[#8c7d71]"
              rows={3}
              placeholder="Type here..."
            />
          </div>
        </div>

        <button
          onClick={onSubmit}
          className="mt-8 w-full py-3 rounded-xl bg-[#5b7f1d] text-white text-lg font-semibold shadow-md"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
