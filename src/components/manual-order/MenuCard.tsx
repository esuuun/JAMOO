"use client";

import Image from "next/image";
import { MenuItem, formatIDR } from "@/src/data/menuData";

type Props = {
  item: MenuItem;
  onClick?: () => void;
  onQuickAdd?: () => void;
};

export function MenuCard({ item, onClick, onQuickAdd }: Props) {
  const displayPrice = item.price.large;
  const useDefault = !item.image;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-white rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.25)] w-full max-w-[320px] sm:max-w-[253px] aspect-[253/316] p-4 sm:p-5 flex flex-col text-left transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#496f18]"
    >
      {/* Drink illustration */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="relative w-[55%] aspect-square max-w-[170px]">
          {useDefault ? (
            <>
              <Image
                src="/manual-order/drink-default-bg.svg"
                alt=""
                fill
                className="object-contain"
                aria-hidden
              />
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain p-3"
                sizes="170px"
              />
            </>
          ) : (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-contain"
              sizes="170px"
            />
          )}
        </div>
      </div>

      {/* Bottom info */}
      <div className="flex flex-col gap-0">
        <h3 className="font-bold text-[15px] sm:text-[18px] text-[#523921] leading-tight uppercase line-clamp-2">
          {item.name}
        </h3>
        <p className="text-[13px] sm:text-[16px] text-[#523921] leading-tight truncate">
          {item.shortDescription}
        </p>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[13px] sm:text-[16px] text-[#523921] leading-tight">
            {formatIDR(displayPrice)}
          </span>
          <span
            role="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd?.();
            }}
            className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] border-2 border-[#e88133] text-[#e88133] rounded-[5px] flex items-center justify-center text-[16px] sm:text-[18px] font-bold leading-none transition hover:bg-[#e88133] hover:text-white shrink-0"
            aria-label={`Add ${item.name} to bag`}
          >
            +
          </span>
        </div>
      </div>
    </button>
  );
}
