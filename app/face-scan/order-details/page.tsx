'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { OrderStatusCard } from '@/src/components/manual-order/OrderStatusCard'
import type { SecretRecipeResponse, SweetnessLevel } from '@/lib/types'
import type { FaceScanData } from '../page'

interface StoredOrder {
  sessionId: string
  recipe: SecretRecipeResponse
  formData: FaceScanData
  qty: number
  unitPrice: number
  totalPrice: number
}

function formatRupiah(n: number) {
  return `Rp${n.toLocaleString('id-ID')}`
}

const SWEETNESS_LABEL: Record<SweetnessLevel, string> = {
  normal: 'Normal',
  less: 'Less Sugar',
  no_sugar: 'No Sugar',
}

function generatePickupNumber() {
  return Math.floor(100 + Math.random() * 900)
}

function generateEstimatedTime(minutesAhead = 5) {
  const d = new Date()
  d.setMinutes(d.getMinutes() + minutesAhead)
  return `${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`
}

export default function FaceScanOrderDetailsPage() {
  const router = useRouter()
  const [data, setData] = useState<StoredOrder | null>(null)
  const [snapshot, setSnapshot] = useState<{
    pickupNumber: number
    estimatedTime: string
  } | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('jamoo_face_order')
    if (!raw) { router.replace('/'); return }
    setData(JSON.parse(raw))
    setSnapshot({
      pickupNumber: generatePickupNumber(),
      estimatedTime: generateEstimatedTime(5),
    })
  }, [router])

  const view = useMemo(() => snapshot, [snapshot])

  if (!data || !view) return <div className="min-h-screen bg-[#EDEBD2]" />

  const { recipe, formData, qty, unitPrice, totalPrice } = data

  function handleBackToHome() {
    sessionStorage.removeItem('jamoo_face_order')
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-[#EDEBD2] flex flex-col">
      <div className="flex-1 px-4 pt-10 pb-6 flex flex-col items-center gap-5">
        <div className="w-full max-w-lg">
          <OrderStatusCard
            pickupNumber={view.pickupNumber}
            estimatedTime={view.estimatedTime}
            activeStep={1}
          />
        </div>
      </div>

      {/* Bottom recap */}
      <div className="bg-white rounded-t-[30px] shadow-[0_-4px_10px_rgba(0,0,0,0.08)] px-5 pt-7 pb-8 flex flex-col gap-5 mx-auto w-full max-w-lg">

        <h2 className="text-lg font-black text-[#523921] uppercase tracking-widest">Order Recap</h2>

        {/* Item row */}
        <div className="flex gap-4 items-center">
          <div
            className="relative w-16 h-16 rounded-xl flex-shrink-0 overflow-hidden"
            style={{ backgroundImage: "url('/background_card.svg')", backgroundSize: 'cover' }}
          >
            <Image
              src={recipe.image_url ?? '/mascot.svg'}
              alt={recipe.menu_name}
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-[#523921] truncate">{recipe.recipe_name}</p>
            <p className="text-xs text-[#9C9070] truncate">{recipe.menu_name}</p>
            <p className="text-xs text-[#9C9070] mt-0.5">
              {formData.size === 'large' ? 'Large' : 'Regular'} · {SWEETNESS_LABEL[formData.sweetnessLevel]}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-[#9C9070]">{qty}x {formatRupiah(unitPrice)}</p>
            <p className="text-sm font-black text-[#523921]">{formatRupiah(totalPrice)}</p>
          </div>
        </div>

        {/* Payment row */}
        <div className="flex items-center justify-between border-t border-[#F0EDD8] pt-4">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#523921" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <path d="M14 14h3v3h-3zM18 18h3v3h-3z"/>
            </svg>
            <span className="text-sm font-bold text-[#523921]">QRIS</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#9C9070]">Total</p>
            <p className="text-sm font-black text-[#4A5820]">{formatRupiah(totalPrice)}</p>
          </div>
        </div>

        <button
          onClick={handleBackToHome}
          className="w-full h-13 bg-[#4A5820] rounded-xl text-white font-bold text-base tracking-widest hover:bg-[#3a4518] transition py-4"
        >
          BACK TO HOME
        </button>
      </div>
    </main>
  )
}
