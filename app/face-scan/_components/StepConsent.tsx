"use client";

import { useState } from "react";

interface Props {
  onAccept: () => void;
  onDecline: () => void;
}

export default function StepConsent({ onAccept, onDecline }: Props) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="w-full min-h-screen bg-[#EDEBD2] flex flex-col lg:flex-row lg:items-stretch">
      {/* ── Left: hero panel ── */}
      <div className="flex flex-col items-center justify-center px-6 pt-10 pb-6 lg:w-[45%] lg:min-h-screen lg:px-14 lg:pt-0 gap-5">
        {/* Camera icon */}
        <div className="bg-white/60 rounded-3xl p-7 lg:p-10">
          <svg
            width="80"
            height="80"
            viewBox="0 0 64 64"
            fill="none"
            className="lg:w-28 lg:h-28"
          >
            <rect
              x="8"
              y="14"
              width="48"
              height="36"
              rx="5"
              stroke="#2D1A10"
              strokeWidth="2.5"
            />
            <circle cx="32" cy="32" r="10" stroke="#2D1A10" strokeWidth="2.5" />
            <circle cx="32" cy="32" r="5" fill="#2D1A10" />
            <rect x="22" y="10" width="20" height="6" rx="3" fill="#2D1A10" />
            <circle cx="50" cy="20" r="2" fill="#4A5820" />
          </svg>
        </div>

        <div className="text-center lg:text-left">
          <h1 className="text-3xl lg:text-5xl font-black text-[#2D1A10] leading-none">
            PRIVACY
          </h1>
          <p className="text-base lg:text-xl font-semibold text-[#2D1A10] mt-1">
            First. Always.
          </p>
        </div>

        <div className="bg-[#C8D96B] rounded-2xl px-5 py-4 max-w-[280px] lg:max-w-xs">
          <p className="text-sm lg:text-base text-[#2D1A10] text-center lg:text-left">
            Your face is <span className="font-bold">never stored</span> — we
            only read your expression in real-time, then it&apos;s gone.
          </p>
        </div>
      </div>

      {/* ── Right: consent card ── */}
      <div className="flex-1 bg-white rounded-t-3xl lg:rounded-none lg:rounded-l-3xl px-6 pt-8 pb-10 flex flex-col gap-6 lg:px-14 lg:py-16 lg:justify-center lg:shadow-2xl">
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-[#2D1A10]">
            Camera Permission
          </h2>
          <p className="text-sm lg:text-base text-[#9C9070] mt-1">
            One-time scan to personalise your JAMOO
          </p>
        </div>

        <p className="text-sm lg:text-base text-[#5C4033] leading-relaxed border-l-2 border-[#C8D96B] pl-3">
          To get the perfect menu, we need to detect your facial expression.
          Rest assured,{" "}
          <strong>
            your facial data is only used for this process. It is never saved or
            shared with anyone.
          </strong>{" "}
          This image is permanently deleted immediately after analysis.
        </p>

        {/* Checklist */}
        <div className="bg-[#F5F3E8] rounded-2xl px-5 py-4 flex flex-col gap-3">
          {[
            "No photo is uploaded to our servers",
            "Analysis happens entirely on your device",
            "Data is discarded after the scan",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#4A5820] flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4l3 3 5-6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-sm lg:text-base text-[#5C4033]">
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Checkbox agreement */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#4A5820] cursor-pointer"
          />
          <span className="text-sm lg:text-base text-[#2D1A10]">
            I agree to have my face scanned for this menu recommendation
          </span>
        </label>

        <div className="flex-1 lg:hidden" />

        <button
          disabled={!agreed}
          onClick={onAccept}
          className="w-full bg-[#4A5820] disabled:opacity-40 text-white font-bold py-4 rounded-2xl text-base tracking-widest hover:bg-[#3a4518] transition-colors flex items-center justify-center gap-2"
        >
          NEXT <span>→</span>
        </button>

        <a
          href="/manual-order"
          className="text-sm font-semibold text-[#2D1A10] underline underline-offset-2 text-center"
        >
          No, take me to Manual Order
        </a>
      </div>
    </div>
  );
}
