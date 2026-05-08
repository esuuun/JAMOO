'use client';

import Image from 'next/image';
import { BagItem } from '@/src/contexts/BagContext';
import { formatIDR } from '@/src/data/menuData';

type Props = {
  items: BagItem[];
};

export function OrderSummaryItems({ items }: Props) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-4">
          {/* Drink thumb */}
          <div className="relative w-[60px] h-[60px] flex-shrink-0">
            <Image
              src="/manual-order/drink-default-bg.svg"
              alt=""
              fill
              className="object-contain"
              aria-hidden
            />
            <Image
              src="/manual-order/drink-default-cup.png"
              alt={item.name}
              fill
              className="object-contain p-1.5"
              sizes="60px"
            />
          </div>

          {/* Name + options */}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-[#523921] uppercase leading-tight truncate">
              {item.name}
            </p>
            <p className="text-[12px] text-[#523921] leading-tight">
              {capitalize(item.size)},{' '}
              {capitalize(sweetnessLabel(item.sweetness))}
            </p>
          </div>

          {/* Price + qty */}
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="text-[12px] font-bold text-[#523921] leading-tight">
              {formatIDR(item.unitPrice * item.quantity)}
            </span>
            <span className="text-[12px] text-[#523921] leading-tight">
              x{item.quantity}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function capitalize(s: string): string {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function sweetnessLabel(s: string): string {
  // "LESS SUGAR" → "Less Sugar"
  return s
    .split(' ')
    .map((w) => capitalize(w))
    .join(' ');
}
