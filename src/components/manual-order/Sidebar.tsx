'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/manual-order/signature', word1: 'Signature', word2: 'Series' },
  { href: '/manual-order/classic', word1: 'Classic', word2: 'Series' },
  { href: '/manual-order/heritage', word1: 'Heritage', word2: 'Series' },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="md:relative bg-white rounded-[5px] shadow-[0_0_10px_rgba(130,161,188,0.25)] md:w-[226px] md:shrink-0 md:self-start">
      {/* Mobile: horizontal scroll tabs / Desktop: vertical list */}
      <ul className="flex md:flex-col gap-1 md:gap-0 px-2 md:px-0 py-2 md:py-6 overflow-x-auto md:overflow-visible">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href} className="relative shrink-0 md:shrink">
              <Link
                href={link.href}
                className={
                  isActive
                    ? 'relative z-10 block bg-[#496f18] text-white rounded-[5px] shadow-[0_0_10px_rgba(130,161,188,0.5)] px-4 md:px-8 py-3 md:py-5 font-bold text-[14px] md:text-[20px] leading-tight md:leading-[20px] whitespace-nowrap md:whitespace-normal md:-mr-3'
                    : 'block px-4 md:px-8 py-3 md:py-5 font-bold text-[14px] md:text-[20px] leading-tight md:leading-[20px] text-[#523921] hover:bg-[#f8fddd]/60 transition-colors whitespace-nowrap md:whitespace-normal'
                }
              >
                <span className="block md:block">
                  {link.word1}
                  <span className="md:hidden"> {link.word2}</span>
                </span>
                <span className="hidden md:block">{link.word2}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
