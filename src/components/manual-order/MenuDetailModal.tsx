'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuItem, formatIDR } from '@/src/data/menuData';
import { Size, Sweetness, useBag } from '@/src/contexts/BagContext';

export type EditingPayload = {
  bagItemId: string;
  size: Size;
  sweetness: Sweetness;
  quantity: number;
};

type Props = {
  item: MenuItem | null;
  editing?: EditingPayload | null;
  onClose: () => void;
};

const SWEETNESS_OPTIONS: Sweetness[] = ['NORMAL', 'LESS SUGAR', 'NO SUGAR'];

export function MenuDetailModal({ item, editing, onClose }: Props) {
  const isEditing = !!editing;

  const [size, setSize] = useState<Size>(editing?.size ?? 'LARGE');
  const [sweetness, setSweetness] = useState<Sweetness>(
    editing?.sweetness ?? 'NORMAL',
  );
  const [quantity, setQuantity] = useState(editing?.quantity ?? 1);

  const { addItem, updateItem } = useBag();
  const router = useRouter();

  // Reset/seed local state when item or editing payload changes
  useEffect(() => {
    if (!item) return;
    setSize(editing?.size ?? 'LARGE');
    setSweetness(editing?.sweetness ?? 'NORMAL');
    setQuantity(editing?.quantity ?? 1);
  }, [item, editing]);

  useEffect(() => {
    if (!item) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  const unitPrice = item
    ? size === 'LARGE'
      ? item.price.large
      : item.price.regular
    : 0;
  const totalPrice = unitPrice * quantity;

  function handleAddToBag() {
    if (!item) return;
    addItem({
      menuId: item.id,
      name: item.name,
      shortDescription: item.shortDescription,
      size,
      sweetness,
      quantity,
      unitPrice,
      imageUrl: item.image,
    });
    onClose();
  }

  function handlePlaceOrder() {
    handleAddToBag();
    router.push('/manual-order/order-summary');
  }

  function handleSaveChanges() {
    if (!item || !editing) return;
    updateItem(editing.bagItemId, { size, sweetness, quantity, unitPrice });
    onClose();
  }

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-30 bg-[rgba(73,111,24,0.4)]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Modal positioning wrapper */}
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center px-4 py-6 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {/* Modal card */}
            <div
              className="relative w-[657px] max-w-full max-h-[92vh] bg-white rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.25)] pointer-events-auto flex flex-col overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Close (X) button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/95 hover:bg-[#f8fddd] transition shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                aria-label="Close"
                title="Close"
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

              {/* Scrollable upper section */}
              <div className="flex-1 overflow-y-auto">
                {/* Cup image */}
                <div className="flex items-center justify-center pt-6 pb-3">
                  <div className="relative w-[180px] h-[180px]">
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
                      sizes="180px"
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="px-10 pb-5">
                  <h2
                    id="modal-title"
                    className="text-[24px] font-bold text-[#523921] uppercase leading-tight"
                  >
                    {item.name}
                  </h2>
                  <p className="mt-2 text-[15px] text-[#523921] text-justify leading-snug">
                    {item.fullDescription}
                  </p>

                  {/* Size */}
                  <div className="mt-5">
                    <h3 className="text-[19px] font-bold text-[#523921]">Size</h3>
                    <div className="mt-2 flex gap-3">
                      <SizeOption
                        label="LARGE"
                        price={formatIDR(item.price.large)}
                        active={size === 'LARGE'}
                        onClick={() => setSize('LARGE')}
                      />
                      <SizeOption
                        label="REGULAR"
                        price={formatIDR(item.price.regular)}
                        active={size === 'REGULAR'}
                        onClick={() => setSize('REGULAR')}
                      />
                    </div>
                  </div>

                  {/* Sweetness */}
                  <div className="mt-5">
                    <h3 className="text-[19px] font-bold text-[#523921]">
                      Sweetness Level
                    </h3>
                    <div className="mt-2 flex gap-3 flex-wrap">
                      {SWEETNESS_OPTIONS.map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          active={sweetness === s}
                          onClick={() => setSweetness(s)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky footer — always visible */}
              <div className="shrink-0 bg-[#e6ecf2] px-10 py-4 border-t border-black/5">
                <div className="flex items-center justify-between">
                  <span className="text-[20px] font-bold text-[#523921] leading-none">
                    {formatIDR(totalPrice)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-[26px] h-[26px] bg-[#e0e5ee] border-2 border-[#9aafbb] flex items-center justify-center text-[15px] font-bold text-[#523921] leading-none transition hover:brightness-95"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-[28px] text-[16px] font-bold text-[#523921] text-center leading-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-[26px] h-[26px] bg-[#d4e2c0] border-2 border-[#c9d19b] flex items-center justify-center text-[15px] font-bold text-[#523921] leading-none transition hover:brightness-95"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-8">
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      className="w-[270px] h-[38px] bg-[#496f18] rounded-[5px] text-white font-bold text-[14px] leading-none transition hover:brightness-110"
                    >
                      SAVE CHANGES
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleAddToBag}
                        className="w-[125px] h-[38px] bg-white border border-[#c0b7b7] rounded-[5px] text-[#523921] font-bold text-[14px] leading-none transition hover:bg-[#f8fddd]"
                      >
                        ADD TO BAG
                      </button>
                      <button
                        type="button"
                        onClick={handlePlaceOrder}
                        className="w-[135px] h-[38px] bg-[#496f18] rounded-[5px] text-white font-bold text-[14px] leading-none transition hover:brightness-110"
                      >
                        PLACE ORDER
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SizeOption({
  label,
  price,
  active,
  onClick,
}: {
  label: string;
  price: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'w-[100px] h-[44px] rounded-[5px] flex flex-col items-center justify-center transition ' +
        (active
          ? 'bg-[#d4e2c0] border-2 border-[#c9d19b]'
          : 'bg-[#e6ecf2] border-2 border-transparent hover:brightness-95')
      }
    >
      <span className="text-[15px] font-semibold text-[#523921] leading-none">
        {label}
      </span>
      <span className="text-[12px] text-[#523921] leading-none mt-0.5">
        {price}
      </span>
    </button>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'min-w-[100px] h-[34px] px-3 rounded-[5px] text-[14px] font-semibold text-[#523921] leading-none transition ' +
        (active
          ? 'bg-[#d4e2c0] border-2 border-[#c9d19b]'
          : 'bg-[#e6ecf2] border-2 border-transparent hover:brightness-95')
      }
    >
      {label}
    </button>
  );
}
