'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useBag } from '@/src/contexts/BagContext';
import { OrderStatusCard } from '@/src/components/manual-order/OrderStatusCard';
import { OrderRecapCard } from '@/src/components/manual-order/OrderRecapCard';
import { LandscapeBackdrop } from '@/src/components/manual-order/LandscapeBackdrop';

function generatePickupNumber(): number {
  return Math.floor(100 + Math.random() * 900);
}

function generateEstimatedTime(minutesAhead = 5): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutesAhead);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}.${mm}`;
}

export default function OrderDetailsPage() {
  const { items, subtotal, clear } = useBag();
  const router = useRouter();

  const [snapshot, setSnapshot] = useState<{
    items: typeof items;
    total: number;
    pickupNumber: number;
    estimatedTime: string;
  } | null>(null);

  useEffect(() => {
    if (snapshot) return;
    if (items.length === 0) {
      router.replace('/manual-order/signature');
      return;
    }
    setSnapshot({
      items,
      total: subtotal,
      pickupNumber: generatePickupNumber(),
      estimatedTime: generateEstimatedTime(5),
    });
  }, [items, subtotal, snapshot, router]);

  const view = useMemo(() => snapshot, [snapshot]);

  if (!view) return <main className="min-h-screen bg-[#f8fddd]" />;

  function handleBackToHome() {
    sessionStorage.removeItem('jamoo_last_qr');
    clear();
    router.push('/');
  }

  return (
    <main className="relative min-h-screen bg-[#f8fddd] overflow-hidden flex flex-col">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-multiply">
        <Image src="/manual-order/noise.png" alt="" fill sizes="100vw" className="object-cover" aria-hidden />
      </div>

      <LandscapeBackdrop />

      <div className="relative z-10 px-4 pt-8 flex justify-center">
        <div className="w-full max-w-[657px]">
          <OrderStatusCard
            pickupNumber={view.pickupNumber}
            estimatedTime={view.estimatedTime}
            activeStep={1}
          />
        </div>
      </div>

      <div className="flex-1" />

      <div className="relative z-10 mt-6 mx-auto w-full max-w-[657px] bg-white rounded-t-[30px] shadow-[0_-4px_10px_rgba(130,161,188,0.25)] px-5 md:px-8 pt-7 pb-6 flex flex-col gap-5">
        <OrderRecapCard items={view.items} total={view.total} />

        <button
          type="button"
          onClick={handleBackToHome}
          className="w-full h-[52px] bg-[#496f18] rounded-[5px] text-white font-bold text-[20px] md:text-[22px] tracking-tight transition hover:brightness-110"
        >
          BACK TO HOME
        </button>
      </div>
    </main>
  );
}
