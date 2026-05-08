'use client'

import Image from 'next/image'
import type { SweetnessLevel } from '@/lib/types'
import type { FaceScanData } from '../page'

interface Props {
  data: FaceScanData
  onChange: (data: FaceScanData) => void
  onNext: () => void
}

const SWEETNESS: { value: SweetnessLevel; label: string }[] = [
  { value: 'normal',   label: 'Normal' },
  { value: 'less',     label: 'Less Sugar' },
  { value: 'no_sugar', label: 'No Sugar' },
]

const SIZES: { value: 'regular' | 'large'; label: string; note: string }[] = [
  { value: 'large',   label: 'Large',   note: '+Rp10.000' },
  { value: 'regular', label: 'Regular', note: '+Rp0' },
]

export default function StepForm({ data, onChange, onNext }: Props) {
  const canSubmit = data.customerName.trim().length > 0

  return (
    <div className="w-full min-h-screen bg-[#EDEBD2] flex flex-col lg:flex-row lg:items-stretch">

      {/* ── Left: hero panel ── */}
      <div className="relative flex flex-col px-6 pt-10 pb-6 lg:w-[45%] lg:min-h-screen lg:justify-center lg:px-14 lg:pt-0">
        <h1 className="text-4xl lg:text-6xl font-black text-[#2D1A10] leading-none">DISCOVER</h1>
        <p className="text-lg lg:text-2xl font-semibold text-[#2D1A10] mt-1">Your Secret Recipe!</p>

        <div className="mt-4 bg-[#C8D96B] rounded-2xl px-5 py-4 max-w-[260px]">
          <p className="text-sm lg:text-base text-[#2D1A10]">
            Fill in your details to get a{' '}
            <span className="font-bold italic">special JAMOO</span>{' '}
            tailored to your profile!
          </p>
        </div>

        {/* Mascot — absolute on mobile, relative block on desktop */}
        <div className="absolute right-0 top-4 lg:static lg:mt-8 lg:self-center">
          <Image
            src="/mascot.svg"
            alt="JAMOO Mascot"
            width={160}
            height={180}
            className="object-contain lg:w-64 lg:h-72"
          />
        </div>
      </div>

      {/* ── Right: form card ── */}
      <div className="flex-1 bg-white rounded-t-3xl lg:rounded-none lg:rounded-l-3xl px-6 pt-8 pb-10 flex flex-col gap-6 lg:px-14 lg:py-16 lg:justify-center lg:shadow-2xl">

          {/* Back button */}
          <button
            onClick={() => window.history.back()}
            className="
              self-start flex items-center gap-1.5
              text-[#4A5820] font-bold text-sm
              bg-[#EAE8D8]
              rounded-full px-4 py-2
              hover:bg-[#DDD9C8]
              active:scale-95
              transition-all duration-200
            "
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#4A5820" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-center font-semibold text-[#2D1A10] lg:text-left lg:text-base">
            What&apos;s your name?
          </label>
          <input
            className="bg-[#EAE8D8] rounded-xl px-4 py-3 text-center lg:text-left text-[#2D1A10] placeholder:text-[#9C9070] outline-none focus:ring-2 focus:ring-[#4A5820]/30 transition"
            placeholder="Enter here"
            value={data.customerName}
            onChange={e => onChange({ ...data, customerName: e.target.value })}
          />
        </div>

        {/* Age — commented out per request */}
        {/* <div className="flex flex-col gap-2">
          <label className="text-center font-semibold text-[#2D1A10]">Age</label>
          <input type="number" className="bg-[#EAE8D8] rounded-xl px-4 py-3 text-center text-[#2D1A10] placeholder:text-[#9C9070] outline-none" placeholder="Enter here" />
        </div> */}

        {/* Sweetness */}
        <div className="flex flex-col gap-2">
          <label className="text-center font-semibold text-[#2D1A10] lg:text-left lg:text-base">
            Sweetness Level
          </label>
          <div className="flex gap-2">
            {SWEETNESS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onChange({ ...data, sweetnessLevel: opt.value })}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  data.sweetnessLevel === opt.value
                    ? 'bg-[#4A5820] text-white'
                    : 'bg-[#EAE8D8] text-[#2D1A10] hover:bg-[#DDD9C8]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="flex flex-col gap-2">
          <label className="text-center font-semibold text-[#2D1A10] lg:text-left lg:text-base">
            Size
          </label>
          <div className="flex gap-3">
            {SIZES.map(opt => (
              <button
                key={opt.value}
                onClick={() => onChange({ ...data, size: opt.value })}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors flex flex-col items-center gap-0.5 ${
                  data.size === opt.value
                    ? 'bg-[#4A5820] text-white'
                    : 'bg-[#EAE8D8] text-[#2D1A10] hover:bg-[#DDD9C8]'
                }`}
              >
                <span>{opt.label}</span>
                <span className="text-xs opacity-75">{opt.note}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 lg:hidden" />

        <button
          disabled={!canSubmit}
          onClick={onNext}
          className="w-full bg-[#4A5820] disabled:opacity-40 text-white font-bold py-4 rounded-2xl text-base tracking-widest hover:bg-[#3a4518] transition-colors lg:mt-4"
        >
          SUBMIT
        </button>
      </div>
    </div>
  )
}
