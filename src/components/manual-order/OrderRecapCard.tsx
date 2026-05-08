'use client';

import Image from 'next/image';
import { BagItem } from '@/src/contexts/BagContext';
import { formatIDR } from '@/src/data/menuData';
import { OrderSummaryItems } from './OrderSummaryItems';

type Props = {
  items: BagItem[];
  total: number;
};

export function OrderRecapCard({ items, total }: Props) {
  return (
    <section className="bg-white rounded-[5px] shadow-[0_0_10px_rgba(130,161,188,0.25)] p-5 flex flex-col gap-4">
      {/* Order Summary */}
      <div>
        <h2 className="text-[18px] font-bold text-[#523921] leading-none">
          ORDER SUMMARY
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <Image
            src="/manual-order/store.svg"
            alt=""
            width={20}
            height={16}
            aria-hidden
          />
          <p className="text-[13px] font-bold text-[#523921] leading-none">
            JAMOO MRT Blok M BCA
          </p>
        </div>
        <div className="mt-3">
          <OrderSummaryItems items={items} />
        </div>
      </div>

      {/* Payment Detail */}
      <div>
        <h2 className="text-[18px] font-bold text-[#523921] leading-none">
          Payment Detail
        </h2>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
            <span className="text-[13px] font-bold text-[#523921]">QRIS</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-[#82a1bc] leading-tight">
              Total
            </span>
            <span className="text-[13px] font-bold text-[#523921] leading-tight">
              {formatIDR(total)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
