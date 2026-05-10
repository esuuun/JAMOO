"use client"

import React from 'react'
import ResultCard from './ResultCard'
import type { RecommendationResponse } from '@/lib/types'

interface Props {
  results: RecommendationResponse
  selectedMenuId: string | null
  onSelect: (menuId: string) => void
}

export default function ResultList({ results, selectedMenuId, onSelect }: Props) {
  return (
    <div className="mt-6 bg-white/95 p-4 rounded-lg shadow">
      {results.top3.map((item, i) => (
        <ResultCard
          key={item.menu_id}
          rank={i + 1}
          menu_id={item.menu_id}
          menu_name={item.menu_name}
          description={item.description ?? ''}
          imageUrl={item.image_url ?? null}
          price={item.price}
          isSelected={selectedMenuId === item.menu_id}
          onSelect={onSelect}
        />
      ))}

    </div>
  )
}
  )
}
