'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { BagItem, useBag } from '@/src/contexts/BagContext';
import { findMenu, formatIDR, MenuItem } from '@/src/data/menuData';
import { EditingPayload, MenuDetailModal } from './MenuDetailModal';

export function MyBagPanel() {
  const { items, removeItem, totalQuantity } = useBag();
  const hasItems = items.length > 0;

  const [isOpen, setIsOpen] = useState(true);
  const prevHasItems = useRef(false);

  // Auto-open the panel when bag transitions from empty -> non-empty
  // (so the user sees confirmation when they add the first item)
  useEffect(() => {
    if (hasItems && !prevHasItems.current) {
      setIsOpen(true);
    }
    prevHasItems.current = hasItems;
  }, [hasItems]);

  const [editing, setEditing] = useState<{
    menu: MenuItem;
    payload: EditingPayload;
  } | null>(null);

  function handleEdit(item: BagItem) {
    const menu = findMenu(item.menuId);
    if (!menu) return;
    setEditing({
      menu,
      payload: {
        bagItemId: item.id,
        size: item.size,
        sweetness: item.sweetness,
        quantity: item.quantity,
      },
    });
  }

  return (
    <>
      {/* Slide-in panel */}
      <AnimatePresence>
        {hasItems && isOpen && (
          <motion.aside
            initial={{ x: '110%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '110%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="fixed right-4 top-[100px] bottom-6 z-30 w-[275px] max-w-[calc(100vw-2rem)] bg-[#f3f8d9] rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.25)] flex flex-col"
          >
            <div className="flex items-start justify-between px-5 pt-5 pb-3">
              <h2 className="text-[28px] font-bold text-[#523921] leading-none">
                MY BAG
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 -mr-1 -mt-1 flex items-center justify-center rounded-full hover:bg-black/5 transition"
                aria-label="Hide bag panel"
                title="Hide bag"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#523921"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto px-4 pb-3 space-y-3">
              {items.map((item) => (
                <BagItemRow
                  key={item.id}
                  item={item}
                  onEdit={() => handleEdit(item)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </ul>

            <div className="px-5 pb-5 pt-2">
              <Link
                href="/manual-order/order-summary"
                className="flex items-center justify-center w-full h-[44px] bg-[#496f18] rounded-[5px] text-white font-bold text-[16px] leading-none transition hover:brightness-110"
              >
                PLACE ORDER
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Floating reopen button when bag has items and panel is closed.
          Compact on mobile (icon + badge only), full pill on md+. */}
      <AnimatePresence>
        {hasItems && !isOpen && (
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
            className="fixed right-3 bottom-3 md:right-4 md:bottom-4 z-30 h-[40px] md:h-[52px] px-2.5 md:pl-4 md:pr-5 flex items-center gap-1.5 md:gap-2 bg-[#496f18] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.25)] text-white hover:brightness-110 transition"
            aria-label={`Open My Bag (${totalQuantity} item${totalQuantity > 1 ? 's' : ''})`}
            title="Open My Bag"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="hidden md:inline font-bold text-[15px] md:text-[16px] leading-none">
              MY BAG
            </span>
            <span className="min-w-[20px] h-[20px] md:min-w-[22px] md:h-[22px] px-1.5 flex items-center justify-center rounded-full bg-white text-[#496f18] text-[11px] md:text-[12px] font-bold leading-none">
              {totalQuantity}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Edit modal — opens when user clicks the pencil on a bag item */}
      <MenuDetailModal
        item={editing?.menu ?? null}
        editing={editing?.payload ?? null}
        onClose={() => setEditing(null)}
      />
    </>
  );
}

function BagItemRow({
  item,
  onEdit,
  onRemove,
}: {
  item: BagItem;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const menu = findMenu(item.menuId);
  return (
    <li className="flex items-start gap-2 py-1">
      {/* Drink thumb */}
      <div className="relative w-[44px] h-[44px] flex-shrink-0">
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
          className="object-contain p-1"
          sizes="44px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-[#293845] uppercase truncate leading-tight">
          {item.name}
        </p>
        <p className="text-[10px] text-[#293845] leading-tight">
          {item.size} · {item.sweetness}
          {item.quantity > 1 ? ` · x${item.quantity}` : ''}
        </p>
        <p className="text-[10px] text-[#293845] leading-tight truncate">
          {menu?.shortDescription ?? ''}
        </p>
        <p className="text-[12px] font-semibold text-[#293845] leading-tight mt-0.5">
          {formatIDR(item.unitPrice * item.quantity)}
        </p>
      </div>

      {/* Action icons */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/5 transition"
          aria-label={`Edit ${item.name}`}
          title="Edit item"
        >
          <Image
            src="/manual-order/edit-pencil.svg"
            alt=""
            width={14}
            height={14}
            aria-hidden
          />
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/5 transition"
          aria-label={`Remove ${item.name} from bag`}
          title="Remove from bag"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#523921"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1.5 14a2 2 0 0 1-2 2H8.5a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V6" />
          </svg>
        </button>
      </div>
    </li>
  );
}
