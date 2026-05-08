import Image from 'next/image'

export default function StepLoading() {
  return (
    <div className="w-full min-h-screen bg-[#EDEBD2] flex flex-col lg:flex-row lg:items-stretch">

      {/* ── Left: visual panel ── */}
      <div className="flex flex-col items-center justify-center px-6 pt-12 pb-6 lg:w-[45%] lg:min-h-screen lg:px-14 lg:pt-0 gap-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#C8D96B]/30 blur-2xl scale-125" />
          <Image
            src="/hourglass.svg"
            alt="Loading"
            width={120}
            height={120}
            className="relative lg:w-44 lg:h-44"
          />
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-2.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-3 h-3 rounded-full bg-[#4A5820] animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* ── Right: text panel ── */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 lg:mt-0 lg:rounded-none lg:rounded-l-3xl px-6 pt-8 pb-10 flex flex-col gap-5 lg:px-14 lg:py-16 lg:justify-center lg:shadow-2xl">

        <div>
          <p className="text-xs text-[#9C9070] uppercase tracking-widest font-semibold mb-1">Please wait</p>
          <h2 className="text-2xl lg:text-3xl font-black text-[#2D1A10] leading-tight">
            Crafting your<br />secret recipe…
          </h2>
        </div>

        <p className="text-sm lg:text-base text-[#5C4033] leading-relaxed border-l-2 border-[#C8D96B] pl-3">
          Our AI is reading your expression and selecting the perfect JAMOO blend just for you. This usually takes less than 15 seconds.
        </p>

        {/* Progress steps */}
        <div className="flex flex-col gap-3 mt-2">
          {[
            { label: 'Reading your expression', done: true },
            { label: 'Matching to secret personas', done: true },
            { label: 'Crafting your recipe narrative', done: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${item.done ? 'bg-[#4A5820]' : 'border-2 border-[#C8D96B] bg-transparent'}`}>
                {item.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className={`text-sm lg:text-base ${item.done ? 'text-[#2D1A10] font-semibold' : 'text-[#9C9070]'}`}>
                {item.label}
              </span>
              {!item.done && (
                <span className="ml-auto flex gap-1">
                  {[0, 1, 2].map(j => (
                    <span key={j} className="w-1.5 h-1.5 rounded-full bg-[#C8D96B] animate-bounce" style={{ animationDelay: `${j * 0.15}s` }} />
                  ))}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
