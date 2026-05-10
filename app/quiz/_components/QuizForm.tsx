'use client'

import React from 'react'
import { SWEETNESS_OPTIONS } from '@/lib/constants'
import type { QuestionnaireData } from '@/lib/types'

interface Props {
  formData: QuestionnaireData
  setFormData: (d: QuestionnaireData) => void
}

export default function QuizForm({ formData, setFormData }: Props) {
  return (
    <form className="space-y-6">
      {/* Sweetness */}
      <div>
        <label className="block text-sm font-semibold">Sweetness preference</label>
        <div className="mt-2 space-y-2">
          {SWEETNESS_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-3">
              <input
                type="radio"
                name="sweetness"
                value={opt.value}
                checked={formData.sweetness === opt.value}
                onChange={e => setFormData({ ...formData, sweetness: e.target.value as any })}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Free text */}
      <div>
        <label className="block text-sm font-semibold">Additional info (optional)</label>
        <textarea
          value={formData.free_text || ''}
          onChange={e => setFormData({ ...formData, free_text: e.target.value.slice(0, 100) })}
          className="w-full border rounded p-2 mt-2"
          rows={3}
          maxLength={100}
          placeholder="e.g., I have sensitive stomach"
        />
        <p className="text-xs text-gray-500">{(formData.free_text || '').length}/100</p>
      </div>
    </form>
  )
}
