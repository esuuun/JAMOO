'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatIDR } from '@/src/data/menuData';
import { LandscapeBackdrop } from '@/src/components/manual-order/LandscapeBackdrop';
import type { SweetnessLevel } from '@/lib/types';

const SIZE_UPCHARGE = 6000;

interface QuizOrderData {
  sessionId: string;
  menuId: string;
  name: string;
  sweetnessRaw: SweetnessLevel;
  sweetnessBag: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  imageUrl: string;
  size: 'REGULAR' | 'LARGE';
  description?: string; // Optional if we passed it
}

export default function QuizMenuDetailPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<QuizOrderData | null>(null);
  
  const [size, setSize] = useState<'REGULAR' | 'LARGE'>('LARGE');
  const [sweetness, setSweetness] = useState<string>('NORMAL');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const raw = sessionStorage.getItem('jamoo_quiz_order');
    if (!raw) {
      router.replace('/quiz');
      return;
    }
    const data = JSON.parse(raw);
    setOrderData(data);
    setSweetness(data.sweetnessBag || 'NORMAL');
  }, [router]);

  if (!orderData) return <main className="min-h-screen bg-[#f8fddd]" />;

  const regularPrice = orderData.unitPrice;
  const largePrice = regularPrice + SIZE_UPCHARGE;
  const unitPrice = size === 'LARGE' ? largePrice : regularPrice;
  const totalPrice = unitPrice * quantity;

  function handlePlaceOrder() {
    if (!orderData) return;
    const updatedData: QuizOrderData = {
      ...orderData,
      size,
      sweetnessBag: sweetness,
      unitPrice,
      totalPrice,
      quantity,
    };
    sessionStorage.setItem('jamoo_quiz_order', JSON.stringify(updatedData));
    router.push('/quiz/order-summary');
  }

  const SWEETNESS_OPTIONS = ['NORMAL', 'LESS SUGAR', 'NO SUGAR'];

  return (
    <main className="min-h-screen bg-[#f8fddd] flex flex-col items-center">
      <div className="w-full max-w-[657px] bg-white min-h-screen flex flex-col relative shadow-[0_0_15px_rgba(0,0,0,0.1)]">
        
        {/* Back button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => {
              sessionStorage.setItem('jamoo_quiz_restore', '1');
              router.push('/quiz');
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 hover:bg-white transition shadow-sm backdrop-blur-md"
            aria-label="Back"
          >
            <img src="/quiz/ArrowBrown.svg" alt="Back" className="w-6 h-6" />
          </button>
        </div>

        {/* Top Image Banner */}
        <div className="relative w-full h-[320px] bg-[#d2e2e9] shrink-0">
          <Image src="/manual-order/banner-signature.png" alt="" fill className="object-cover opacity-60" aria-hidden />
          <div className="absolute inset-0 flex items-end justify-center pb-6">
            <div className="relative w-[240px] h-[280px]">
              <Image
                src={orderData.imageUrl || '/images/menus/default.png'}
                alt={orderData.name}
                fill
                className="object-contain"
                sizes="240px"
              />
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="flex-1 -mt-8 relative z-10 bg-white rounded-t-[30px] px-6 sm:px-8 py-8 flex flex-col shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <h2 className="text-[22px] font-black text-[#523921] uppercase leading-tight">
            {orderData.name}
          </h2>
          <p className="mt-2 text-[14px] text-[#523921] leading-relaxed">
            {orderData.description}
          </p>

          {/* Size Options */}
          <div className="mt-6">
            <h3 className="text-[17px] font-bold text-[#523921]">Size</h3>
            <div className="mt-3 flex gap-3">
              <SizeOption
                label="LARGE"
                price={formatIDR(largePrice)}
                active={size === 'LARGE'}
                onClick={() => setSize('LARGE')}
              />
              <SizeOption
                label="REGULAR"
                price={formatIDR(regularPrice)}
                active={size === 'REGULAR'}
                onClick={() => setSize('REGULAR')}
              />
            </div>
          </div>
          
          {/* Sweetness Options */}
          <div className="mt-6">
            <h3 className="text-[17px] font-bold text-[#523921]">Sweetness Level</h3>
            <div className="mt-3 flex gap-3 flex-wrap">
              {SWEETNESS_OPTIONS.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  active={sweetness === s}
                  disabled={true}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 bg-[#e6ecf2] px-6 sm:px-8 py-5 border-t border-black/5">
          <div className="flex items-center justify-between">
            <span className="text-[24px] font-black text-[#523921] leading-none">
              {formatIDR(totalPrice)}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-[26px] h-[26px] bg-[#e0e5ee] border border-[#9aafbb] flex items-center justify-center text-[15px] font-bold text-[#523921] leading-none transition hover:brightness-95 rounded-sm"
              >
                −
              </button>
              <span className="w-[28px] text-[16px] font-bold text-[#523921] text-center leading-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-[26px] h-[26px] bg-[#d4e2c0] border border-[#c9d19b] flex items-center justify-center text-[15px] font-bold text-[#523921] leading-none transition hover:brightness-95 rounded-sm"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="w-full h-[46px] bg-[#496f18] rounded-[8px] text-white font-bold text-[14px] leading-none transition hover:brightness-110 shadow-md"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function SizeOption({ label, price, active, onClick }: { label: string; price: string; active: boolean; onClick: () => void; }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'w-[110px] h-[52px] rounded-[6px] flex flex-col items-center justify-center transition ' +
        (active
          ? 'bg-[#d4e2c0] border-2 border-[#c9d19b]'
          : 'bg-[#e6ecf2] border-2 border-transparent hover:brightness-95')
      }
    >
      <span className="text-[14px] font-bold text-[#523921] leading-none">
        {label}
      </span>
      <span className="text-[12px] text-[#523921] leading-none mt-1 opacity-80">
        {price}
      </span>
    </button>
  );
}

function Chip({ label, active, disabled, onClick }: { label: string; active: boolean; disabled?: boolean; onClick: () => void; }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={
        'h-[36px] px-4 rounded-[6px] text-[13px] font-bold text-[#523921] leading-none transition ' +
        (active
          ? 'bg-[#d4e2c0] border-2 border-[#c9d19b] ' + (disabled ? 'cursor-default' : '')
          : 'bg-[#e6ecf2] border-2 border-transparent ' + (disabled ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-95'))
      }
    >
      {label}
    </button>
  );
}
