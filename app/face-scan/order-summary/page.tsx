'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
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

export default function FaceScanOrderSummaryPage() {
  const router = useRouter()
  const [data, setData] = useState<StoredOrder | null>(null)
  const [ordering, setOrdering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('jamoo_face_order')
    if (!raw) { router.replace('/face-scan'); return }
    setData(JSON.parse(raw))
  }, [router])

  if (!data) return <div className="min-h-screen bg-[#EDEBD2]" />

  const { recipe, formData, qty, unitPrice, totalPrice, sessionId } = data

  async function handleQRIS() {
    if (qrCode) { setShowModal(true); return }

    setOrdering(true)
    setError(null)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          menu_id: recipe.menu_id,
          sweetness_level: formData.sweetnessLevel,
          unit_price: totalPrice,
        }),
      })
      if (!res.ok) throw new Error('Failed to create order')
      const { order } = await res.json()
      const code: string = order?.qr_code ?? ''
      setQrCode(code)
      setShowModal(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setOrdering(false)
    }
  }

  function handleConfirm() {
    setShowModal(false)
    router.push('/face-scan/order-details')
  }

  return (
    <>
      <main className="min-h-screen bg-[#EDEBD2] flex flex-col items-center justify-start py-10 px-4">
        <div className="w-full max-w-lg flex flex-col gap-4">

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="#523921" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-xl font-black text-[#523921] tracking-tight">ORDER SUMMARY</h1>
          </div>

          {/* Recipe card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex gap-4 p-4">
            <div
              className="relative w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden"
              style={{ backgroundImage: "url('/background_card.svg')", backgroundSize: 'cover' }}
            >
              <Image
                src={recipe.image_url ?? '/mascot.svg'}
                alt={recipe.menu_name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex flex-col justify-center gap-0.5 flex-1 min-w-0">
              <p className="text-xs text-[#9C9070] truncate">{recipe.persona}</p>
              <p className="text-base font-black text-[#523921] leading-tight truncate">{recipe.recipe_name}</p>
              <p className="text-sm text-[#9C9070] truncate">{recipe.menu_name}</p>
            </div>
          </div>

          {/* Order details */}
          <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
            <h2 className="text-base font-black text-[#523921] uppercase tracking-widest">Details</h2>
            <div className="flex flex-col gap-2 text-sm text-[#523921]">
              <Row label="Size" value={formData.size === 'large' ? 'Large (+Rp10.000)' : 'Regular'} />
              <Row label="Sweetness" value={SWEETNESS_LABEL[formData.sweetnessLevel]} />
              <Row label="Quantity" value={`${qty}x`} />
              <Row label="Unit Price" value={formatRupiah(unitPrice)} />
              <div className="border-t border-[#F0EDD8] pt-2 mt-1 flex justify-between font-black text-base">
                <span>Total</span>
                <span className="text-[#4A5820]">{formatRupiah(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3">
            <h2 className="text-base font-black text-[#523921] uppercase tracking-widest">Payment Method</h2>
            <button
              onClick={handleQRIS}
              disabled={ordering}
              className="w-full bg-[#F5F3E8] rounded-xl h-12 flex items-center px-4 gap-3 text-sm font-bold text-[#523921] hover:bg-[#EDE9D8] transition disabled:opacity-60"
            >
              {ordering ? (
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#523921" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#523921" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <path d="M14 14h3v3h-3zM18 18h3v3h-3z"/>
                </svg>
              )}
              <span>{ordering ? 'Processing...' : 'QRIS'}</span>
              {!ordering && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#523921" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              )}
            </button>
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
          </div>

        </div>
      </main>

      {/* QR Modal */}
      <AnimatePresence>
        {showModal && qrCode && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[30px] shadow-xl px-6 pt-5 pb-10 flex flex-col items-center gap-5 max-w-[600px] mx-auto"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="w-10 h-1 rounded-full bg-[#D0D9E8] -mt-1" />

              <div className="w-full flex items-center justify-between">
                <h2 className="text-lg font-black text-[#523921]">QRIS Payment</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F3E8] transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#523921" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-[#EDEBD2] rounded-2xl">
                  <QRCodeSVG value={qrCode} size={200} bgColor="#EDEBD2" fgColor="#2D1A10" level="M" />
                </div>
                <p className="text-xs text-[#9C9070] font-mono tracking-widest">{qrCode}</p>
              </div>

              <div className="w-full flex items-center justify-between bg-[#F5F3E8] rounded-xl px-5 py-3">
                <span className="text-sm text-[#523921]">Total Payment</span>
                <span className="text-lg font-black text-[#4A5820]">{formatRupiah(totalPrice)}</span>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full h-13 bg-[#4A5820] rounded-xl text-white font-bold text-base tracking-widest hover:bg-[#3a4518] transition py-4"
              >
                Confirm Payment
              </button>

              <p className="text-xs text-[#9C9070] text-center">
                Scan the QR code above using any QRIS-compatible payment app
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[#9C9070]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
