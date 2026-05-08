'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">

      {/* ── Background Image ─────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-jamoo.svg"
          alt="JAMOO Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* ── Overlay ──────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 bg-white/10" />

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative z-20 flex flex-col items-center justify-between h-full w-full px-4 py-8 md:px-6 md:py-12">

        {/* Logo — mobile: tengah, desktop: kanan atas */}
        <div className="translate-y-36 md:translate-y-0 w-full flex justify-center md:justify-end md:pr-16 pt-2 md:pt-4">
          <Image
            src="/jamoo_logo.svg"
            alt="JAMOO Logo"
            width={420}
            height={120}
            priority
            className="w-[370px] h-auto lg:w-[420px] -translate-x-6 md:translate-x-0"
          />
        </div>

        {/* Buttons — mobile: tengah, desktop: geser kanan */}
        <div className="
          flex flex-row gap-6 md:gap-20
          w-full justify-center
          md:ml-40 lg:ml-140
          mt-0
        ">

          {/* ORDER Button */}
          <Link href="/manual-order/signature" className="flex-1 max-w-[140px] md:max-w-[220px] lg:max-w-[300px]">
            <button
              className="
                w-full aspect-square
                bg-white rounded-2xl md:rounded-3xl
                flex flex-col items-center justify-center gap-2 md:gap-4
                shadow-xl
                transition-all duration-200
                hover:scale-105 hover:shadow-2xl
                active:scale-95
                border border-white/60
              "
            >
              <Image
                src="/order_icon.svg"
                alt="Order icon"
                width={72}
                height={72}
                className="w-10 h-10 md:w-14 md:h-14 lg:w-[72px] lg:h-[72px]"
              />
              <span
                className="text-sm md:text-lg lg:text-xl font-black tracking-widest"
                style={{ fontFamily: "'Articulat CF', serif", color: '#444444' }}
              >
                ORDER
              </span>
            </button>
          </Link>

          {/* PERSONALIZE Button */}
          <Link href="/personalize" className="flex-1 max-w-[140px] md:max-w-[220px] lg:max-w-[300px]">
            <button
              className="
                w-full aspect-square
                bg-white rounded-2xl md:rounded-3xl
                flex flex-col items-center justify-center gap-2 md:gap-4
                shadow-xl
                transition-all duration-200
                hover:scale-105 hover:shadow-2xl
                active:scale-95
                border border-white/60
              "
            >
              <Image
                src="/personalize_icon.svg"
                alt="Personalize icon"
                width={72}
                height={72}
                className="w-10 h-10 md:w-14 md:h-14 lg:w-[72px] lg:h-[72px]"
              />
              <span
                className="text-sm md:text-lg lg:text-xl font-black tracking-widest"
                style={{ fontFamily: "'Articulat CF', serif", color: '#444444' }}
              >
                PERSONALIZE
              </span>
            </button>
          </Link>

        </div>

        {/* Slogan — bawah tengah */}
        <div className="flex justify-center pb-2 md:pb-4">
          <Image
            src="/jamoo_slogan.svg"
            alt="Experience the New with JAMOO"
            width={280}
            height={60}
            className="w-65 h-auto md:w-56 lg:w-[280px]"
          />
        </div>

      </div>
    </main>
  )
}