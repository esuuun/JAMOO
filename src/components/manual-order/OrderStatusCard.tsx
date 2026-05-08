'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type Props = {
  pickupNumber: number;
  estimatedTime: string;
  /** 0=Ordered, 1=Preparing, 2=Collection, 3=Completed */
  activeStep?: number;
};

const STEPS = ['Ordered', 'Preparing', 'Collection', 'Completed'] as const;

export function OrderStatusCard({
  pickupNumber,
  estimatedTime,
  activeStep = 1,
}: Props) {
  return (
    <section className="bg-[#f3f8d9] rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.25)] px-8 py-7 text-center">
      <h1 className="text-[28px] md:text-[32px] font-bold text-[#523921] tracking-tight">
        ORDER DETAILS
      </h1>

      <p className="mt-4 text-[14px] text-[#523921]">Pick Up Number</p>
      <motion.p
        key={pickupNumber}
        className="text-[36px] md:text-[40px] font-bold text-[#523921] leading-tight"
        initial={{ opacity: 0, y: -8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      >
        {pickupNumber}
      </motion.p>

      {/* Stepper */}
      <ol className="mt-2 flex items-start justify-between gap-2 max-w-[480px] mx-auto">
        {STEPS.map((label, i) => {
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          return (
            <li
              key={label}
              className="flex-1 flex flex-col items-center relative"
            >
              {i < STEPS.length - 1 && (
                <ConnectorLine filled={isDone} flowing={i === activeStep} />
              )}

              <StepCircle isActive={isActive} isDone={isDone} stepIndex={i} />

              <span
                className={`mt-2 text-[11px] md:text-[12px] leading-tight ${
                  isActive ? 'text-[#523921] font-semibold' : 'text-[#523921]'
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-[14px] text-[#523921]">Estimated Time Ready</p>
      <p className="text-[28px] md:text-[32px] font-bold text-[#523921] leading-none">
        {estimatedTime}
      </p>
    </section>
  );
}

function StepCircle({
  isActive,
  isDone,
  stepIndex,
}: {
  isActive: boolean;
  isDone: boolean;
  stepIndex: number;
}) {
  const iconColor = isActive || isDone ? '#ffffff' : '#82a1bc';
  const icon = stepIcon(stepIndex, iconColor);

  if (isActive) {
    return (
      <span className="relative z-10 w-[36px] h-[36px] flex items-center justify-center">
        {/* Single calm halo wave */}
        <motion.span
          className="absolute inset-0 rounded-full bg-[#9bbb55]"
          animate={{ scale: [1, 1.6], opacity: [0.35, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeOut' }}
          aria-hidden
        />

        {/* Core circle with very subtle breathing */}
        <motion.span
          className="relative w-[36px] h-[36px] rounded-full bg-[#9bbb55] border-2 border-[#7c9a3e] flex items-center justify-center"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          aria-current="step"
        >
          {icon}
        </motion.span>
      </span>
    );
  }

  return (
    <span
      className={`relative z-10 w-[36px] h-[36px] rounded-full border-2 flex items-center justify-center ${
        isDone
          ? 'bg-[#496f18] border-[#496f18]'
          : 'bg-white border-[#82a1bc]'
      }`}
    >
      {icon}
    </span>
  );
}

function stepIcon(stepIndex: number, color: string): ReactNode {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (stepIndex) {
    case 0:
      // Ordered — clipboard/receipt
      return (
        <svg {...common}>
          <rect x="6" y="4" width="12" height="17" rx="2" />
          <line x1="9" y1="9" x2="15" y2="9" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="13" y2="17" />
        </svg>
      );
    case 1:
      // Preparing — cup with steam
      return (
        <svg {...common}>
          <path d="M7 9h10v8a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" />
          <path d="M17 11h2a2 2 0 0 1 0 4h-2" />
          <path d="M9 4c0 1 1 1 1 2s-1 1-1 2" />
          <path d="M13 4c0 1 1 1 1 2s-1 1-1 2" />
        </svg>
      );
    case 2:
      // Collection — hand reaching
      return (
        <svg {...common}>
          <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M12 11V4.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M15 11V6.5a1.5 1.5 0 0 1 3 0V14" />
          <path d="M9 11V8.5a1.5 1.5 0 0 0-3 0v6.5a6 6 0 0 0 6 6h1a6 6 0 0 0 6-6" />
        </svg>
      );
    case 3:
      // Completed — checkmark
      return (
        <svg {...common} strokeWidth={2.6}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    default:
      return null;
  }
}

function ConnectorLine({
  filled,
  flowing,
}: {
  filled: boolean;
  flowing: boolean;
}) {
  if (flowing) {
    return (
      <span
        className="absolute top-[18px] left-[60%] w-[80%] h-[2px] overflow-hidden bg-[#cfd9c5]"
        aria-hidden
      >
        <motion.span
          className="block h-full w-1/2 bg-gradient-to-r from-transparent via-[#496f18] to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
    );
  }
  return (
    <span
      className={`absolute top-[18px] left-[60%] w-[80%] h-[2px] ${
        filled ? 'bg-[#496f18]' : 'bg-[#82a1bc]'
      }`}
      aria-hidden
    />
  );
}
