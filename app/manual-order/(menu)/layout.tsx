import Image from 'next/image';
import { Header } from '@/src/components/manual-order/Header';
import { Sidebar } from '@/src/components/manual-order/Sidebar';
import { MyBagPanel } from '@/src/components/manual-order/MyBagPanel';

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#f8fddd] flex flex-col">
      {/* Noise texture overlay */}
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

      {/* Page content */}
      <div className="relative z-10 flex flex-1 flex-col px-3 sm:px-4 md:px-8 lg:px-12 pt-4 md:pt-6 pb-6 gap-4 md:gap-6">
        <Header />

        <div className="flex flex-col md:flex-row flex-1 gap-3 md:gap-2">
          <Sidebar />
          <main className="flex-1 bg-white rounded-[5px] shadow-[0_0_10px_rgba(130,161,188,0.5)] overflow-hidden flex flex-col min-w-0">
            {children}
          </main>
        </div>
      </div>

      {/* Slide-in My Bag panel — only visible when bag has items */}
      <MyBagPanel />
    </div>
  );
}
