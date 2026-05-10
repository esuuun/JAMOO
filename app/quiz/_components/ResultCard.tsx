'use client'

import React from 'react'

interface Props {
  rank: number
  menu_id: string
  menu_name: string
  description: string
  price?: number
  imageUrl?: string | null
  highlighted?: boolean
  isSelected?: boolean
  onSelect: (menuId: string) => void
}

export default function ResultCard({ rank, menu_id, menu_name, description, price, imageUrl, highlighted = false, isSelected = false, onSelect }: Props) {
  const containerCls = isSelected || highlighted
    ? 'p-4 rounded-lg shadow-sm border border-[#CFDF79] ring-1 ring-[#CFDF79] bg-[#F2F6E8] flex flex-col cursor-pointer'
    : 'p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col cursor-pointer hover:border-[#CFDF79] transition-colors'

  const imgSrc = imageUrl ?? `/images/menus/${menu_id}.png`

  const formattedPrice = typeof price === 'number' ? price.toLocaleString('id-ID') : undefined

  return (
    <div className={containerCls} onClick={() => onSelect(menu_id)}>
      {/* Top section: Image + Name + Description */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-[#CFDF79] flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={imgSrc} alt={menu_name} className="w-12 h-12 object-contain" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-extrabold text-[#4b2f1c] uppercase leading-tight">{menu_name}</h3>
          <p className="text-sm text-[#2D1A10] mt-2 line-clamp-3">{description}</p>
        </div>
      </div>

      {/* Bottom section: Price */}
      {formattedPrice && (
        <div className="text-sm font-semibold text-[#2D1A10] mt-auto">
          Rp {formattedPrice}
        </div>
      )}
    </div>
  )
}
