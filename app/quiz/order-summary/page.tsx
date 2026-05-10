'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { formatIDR } from '@/src/data/menuData';
import type { SweetnessLevel } from '@/lib/types';
import { OrderHeader } from '@/src/components/manual-order/OrderHeader';
import { OrderSummaryItems } from '@/src/components/manual-order/OrderSummaryItems';
import { LandscapeBackdrop } from '@/src/components/manual-order/LandscapeBackdrop';
import type { BagItem } from '@/src/contexts/BagContext';

const DISCOUNT = 0; // Or whatever is appropriate for quiz
const TAX = 0;

interface QuizOrderData {
  sessionId: string;
  menuId: string;
  name: string;
  sweetnessRaw: SweetnessLevel;
  sweetnessBag: string;
  unitPrice: number;
  imageUrl: string;
}

export default function QuizOrderSummaryPage() {
  const router = useRouter();

  const [orderData, setOrderData] = useState<QuizOrderData | null>(null);
  const [items, setItems] = useState<BagItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('jamoo_quiz_order');
    if (!raw) {
      router.replace('/quiz');
      return;
    }
    const data: QuizOrderData = JSON.parse(raw);
    setOrderData(data);

    // Convert to BagItem format for the OrderSummaryItems component
    const dummyItem: BagItem = {
      id: 'quiz-item-1',
      menuId: data.menuId,
      name: data.name,
      shortDescription: '',
      size: (data as any).size || 'REGULAR',
      sweetness: data.sweetnessBag as any,
      quantity: 1,
      unitPrice: data.unitPrice,
      imageUrl: data.imageUrl,
    };
    setItems([dummyItem]);
    setSubtotal(data.unitPrice);
  }, [router]);

  if (!orderData || items.length === 0) return <main className="min-h-screen bg-[#f8fddd]" />;

  async function handleQRIS() {
    if (qrCode) {
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: orderData!.sessionId,
          menu_id: orderData!.menuId,
          sweetness_level: orderData!.sweetnessRaw,
          unit_price: orderData!.unitPrice,
        }),
      });
      if (!orderRes.ok) throw new Error('Gagal membuat order');
      const { order } = await orderRes.json();
      
      const code = order.qr_code;
      sessionStorage.setItem('jamoo_last_qr', code);
      setQrCode(code);
      setShowModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  }

  function handleConfirmPayment() {
    setShowModal(false);
    router.push('/quiz/order-details');
  }

  return (
    <>
      <main className="relative min-h-screen bg-[#f8fddd] flex items-start justify-center py-8 md:py-12 px-4 overflow-hidden">
        {/* Noise overlay */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-multiply">
          <Image src="/manual-order/noise.png" alt="" fill sizes="100vw" className="object-cover" aria-hidden />
        </div>

        <LandscapeBackdrop />

        <div className="relative z-10 w-full max-w-[657px] flex flex-col items-stretch gap-3">
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
                <div className="flex justify-between font-bold pt-2 mt-1 border-t border-black/5">
                  <span>Subtotal</span>
                  <span>{formatIDR(subtotal)}</span>
                </div>
              </div>
            </Section>

            <Section title="Payment Methods">
              <button
                type="button"
                onClick={handleQRIS}
                disabled={isLoading}
                className="w-full bg-[rgba(130,161,188,0.2)] rounded-[5px] h-[48px] flex items-center px-4 gap-3 text-[14px] font-bold text-[#523921] hover:bg-[rgba(130,161,188,0.35)] active:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#523921" strokeWidth="2" aria-hidden>
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <path d="M14 14h3v3h-3zM18 18h3v3h-3z" />
                  </svg>
                )}
                <span>{isLoading ? 'Memproses...' : 'QRIS'}</span>
                {!isLoading && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#523921" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto" aria-hidden>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </button>
              {error && (
                <p className="mt-2 text-[12px] text-red-600 font-medium">{error}</p>
              )}
            </Section>
          </div>
        </div>
      </main>

      {/* QR Payment Modal */}
      <AnimatePresence>
        {showModal && qrCode && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[30px] shadow-[0_-4px_24px_rgba(0,0,0,0.15)] px-6 pt-5 pb-8 flex flex-col items-center gap-5 max-w-[600px] mx-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <div className="w-10 h-1 rounded-full bg-[#d0d9e8] -mt-1" aria-hidden />

              <div className="w-full flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#523921]">Pembayaran QRIS</h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0f0f0] transition"
                  aria-label="Tutup"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#523921" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-[#f8fddd] rounded-[16px] shadow-inner">
                  <QRCodeSVG
                    value={qrCode}
                    size={200}
                    bgColor="#f8fddd"
                    fgColor="#2d4a0e"
                    level="M"
                  />
                </div>
                <p className="text-[12px] text-[#82a1bc] font-mono tracking-widest">{qrCode}</p>
              </div>

              <div className="w-full flex items-center justify-between bg-[#f3f8d9] rounded-[10px] px-5 py-3">
                <span className="text-[14px] text-[#523921]">Total Pembayaran</span>
                <span className="text-[18px] font-bold text-[#496f18]">{formatIDR(subtotal)}</span>
              </div>

              <button
                type="button"
                onClick={handleConfirmPayment}
                className="w-full h-[52px] bg-[#496f18] rounded-[10px] text-white font-bold text-[16px] tracking-tight hover:brightness-110 transition"
              >
                Konfirmasi Pembayaran
              </button>

              <p className="text-[11px] text-[#82a1bc] text-center leading-snug">
                Scan QR code di atas menggunakan aplikasi pembayaran yang mendukung QRIS
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-[8px] shadow-[0_0_8px_rgba(130,161,188,0.25)] p-5">
      <h2 className="text-[18px] font-bold text-[#523921] mb-3 leading-none">{title}</h2>
      {children}
    </section>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#523921" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
