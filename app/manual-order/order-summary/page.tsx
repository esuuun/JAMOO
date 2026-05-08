'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBag } from '@/src/contexts/BagContext';
import { formatIDR } from '@/src/data/menuData';
import { OrderHeader } from '@/src/components/manual-order/OrderHeader';
import { OrderSummaryItems } from '@/src/components/manual-order/OrderSummaryItems';
import { LandscapeBackdrop } from '@/src/components/manual-order/LandscapeBackdrop';

// TODO: replace fixed values with real promo / tax logic when available.
const DISCOUNT = 4000;
const TAX = 4000;

export default function OrderSummaryPage() {
  const { items, subtotal } = useBag();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) router.replace('/manual-order/signature');
  }, [items, router]);

  if (items.length === 0) {
    return <main className="min-h-screen bg-[#f8fddd]" />;
  }

  return (
    <main className="relative min-h-screen bg-[#f8fddd] flex items-start justify-center py-8 md:py-12 px-4 overflow-hidden">
      {/* Noise overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-multiply">
        <Image
          src="/manual-order/noise.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden
        />
      </div>

      {/* Landscape illustration overlay */}
      <LandscapeBackdrop />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[657px] flex flex-col items-stretch gap-3">
        {/* Main white card */}
        <div className="bg-white rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.25)] p-6 md:p-7 flex flex-col gap-4">
          <OrderHeader />

          <Section title="ORDER SUMMARY">
            <OrderSummaryItems items={items} />
          </Section>

          <Section title="Payment Details">
            <div className="flex flex-col gap-2 text-[13px] text-[#523921]">
              <div className="flex justify-between">
                <span>Discount</span>
                <span>{formatIDR(DISCOUNT)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatIDR(TAX)}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 mt-1">
                <span>Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
            </div>
          </Section>

          <Section title="Payment Methods">
            <button
              type="button"
              className="w-full bg-[rgba(130,161,188,0.2)] rounded-[5px] h-[40px] flex items-center px-4 gap-3 text-[14px] font-bold text-[#523921] hover:brightness-95 transition"
            >
              {/* QR icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#523921"
                strokeWidth="2"
                aria-hidden
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <path d="M14 14h3v3h-3zM18 18h3v3h-3z" />
              </svg>
              <span>QRIS</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#523921"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-auto"
                aria-hidden
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </Section>
        </div>

        {/* Place Order button */}
        <Link
          href="/manual-order/order-details"
          className="self-stretch bg-[#496f18] rounded-[5px] h-[44px] flex items-center justify-center text-white font-bold text-[20px] tracking-tight hover:brightness-110 transition"
        >
          PLACE ORDER
        </Link>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-[8px] shadow-[0_0_8px_rgba(130,161,188,0.25)] p-5">
      <h2 className="text-[18px] font-bold text-[#523921] mb-3 leading-none">
        {title}
      </h2>
      {children}
    </section>
  );
}
