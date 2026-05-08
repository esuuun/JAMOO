// Type-safe wrapper around the canonical data file at src/lib/menuData.js.
// Components should import from here so they get TypeScript types and helpers.

import { menuData as raw } from '@/src/lib/menuData';

export type Category = 'signature' | 'classic' | 'heritage';

export type MenuItem = {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: { regular: number; large: number };
  image: string;
  ingredients: string[];
  benefits: string[];
  mood?: string[];
  category: Category;
  asalDaerah?: string;
};

const all: MenuItem[] = [
  ...(raw.signature as MenuItem[]),
  ...(raw.classic as MenuItem[]),
  ...(raw.heritage as MenuItem[]),
];

export const menuItems: MenuItem[] = all;

export function menuByCategory(category: Category): MenuItem[] {
  return raw[category] as MenuItem[];
}

export function findMenu(id: string): MenuItem | undefined {
  return all.find((m) => m.id === id);
}

export function formatIDR(value: number): string {
  return `Rp${value.toLocaleString('id-ID')}`;
}
