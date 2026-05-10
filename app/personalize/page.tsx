'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PersonalizePage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const cards = [
    {
      id: 'quiz',
      title: 'Which\nJamoo\nSuits You?',
      href: '/quiz',
      mascotSrc: '/mascot-thinking.svg',
      mascotAlt: 'JAMOO mascot thinking',
      mascotLeft: true,
    },
    {
      id: 'face',
      title: 'Make Your\nOwn\nJamoo!',
      href: '/face-scan',
      mascotSrc: '/mascot-happy.svg',
      mascotAlt: 'JAMOO mascot happy',
      mascotLeft: false,
    },
  ]

  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">

      {/* ── Background ──────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-personalize.svg"
          alt="JAMOO Background"
          fill
          priority
          className="object-cover object-center"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/bg-jamoo.svg'
          }}
        />
      </div>

      {/* ── Overlay tipis ────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 bg-white/5" />

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-center w-full h-full px-4 py-6 md:px-8 md:py-10">

        {/* Back button */}
        <div className="w-full flex items-start mb-8 md:mb-10">
          <button
            onClick={() => router.push('/')}
            className="
              flex items-center gap-1.5
              text-[#4A5820] font-bold text-sm
              bg-white/70 backdrop-blur-sm
              rounded-full px-4 py-2
              hover:bg-white/90
              active:scale-95
              transition-all duration-200
              shadow-sm
            "
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#4A5820" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
        </div>

        {/* Title area */}
        <div className="flex flex-col items-center mb-2 md:mb-3">
          <p
            className="text-xs md:text-sm font-black tracking-[0.25em] uppercase mb-1"
            style={{ color: '#4A5820' }}
          >
            PERSONALIZE
          </p>
          <h1
            className="text-xl md:text-2xl font-black tracking-wide text-center"
            style={{ color: '#2D1A10' }}
          >
            How do you want to find your JAMOO?
          </h1>
        </div>

        {/* Cards container */}
        <div className="flex flex-col gap-4 w-full max-w-xs md:max-w-sm">

          {cards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="
                relative
                bg-white rounded-2xl md:rounded-3xl
                overflow-hidden
                shadow-xl
                transition-all duration-200
                hover:scale-[1.03] hover:shadow-2xl
                active:scale-[0.98]
                border border-white/60
                block
              "
              style={{ minHeight: '160px' }}
            >
              {/* Teks judul — padding disesuaikan posisi mascot */}
              <div
                className={`
                  flex items-center h-full py-5
                  ${card.mascotLeft ? 'pl-36 md:pl-40 pr-6' : 'pl-6 pr-32 md:pr-36'}
                `}
              >
                <h2
                  className="text-2xl md:text-3xl font-black leading-tight whitespace-pre-line"
                  style={{
                    fontFamily: "'Articulat CF', sans-serif",
                    color: '#2D1A10',
                  }}
                >
                  {card.title}
                </h2>
              </div>

              {/* Mascot — kiri atau kanan tergantung card */}
              <div
                className={`
                  absolute ${card.mascotLeft ? 'left-0' : 'right-0'} bottom-0
                  w-28 h-28 md:w-32 md:h-32
                  pointer-events-none
                  transition-transform duration-300
                `}
                style={{
                  transform: hoveredCard === card.id ? 'scale(1.08) translateY(-4px)' : 'scale(1) translateY(0)',
                }}
              >
                <Image
                  src={card.mascotSrc}
                  alt={card.mascotAlt}
                  fill
                  className={`
                    object-contain drop-shadow-lg
                    ${card.mascotLeft ? 'object-left-bottom' : 'object-right-bottom'}
                  `}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/mascot.svg'
                  }}
                />
              </div>

              
            </Link>
          ))}
        </div>

        {/* Bottom slogan */}
        <div className="mt-auto pt-4 flex justify-center">
          <Image
            src="/jamoo_slogan.svg"
            alt="Experience the New with JAMOO"
            width={220}
            height={50}
            className="w-44 h-auto md:w-52 opacity-80"
          />
        </div>
      </div>
    </main>
  )
}