'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Size = 'REGULAR' | 'LARGE';
export type Sweetness = 'NORMAL' | 'LESS SUGAR' | 'NO SUGAR';

export type BagItem = {
  id: string;
  menuId: string;
  name: string;
  shortDescription: string;
  size: Size;
  sweetness: Sweetness;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
};

type BagContextValue = {
  items: BagItem[];
  totalQuantity: number;
  subtotal: number;
  addItem: (item: Omit<BagItem, 'id'>) => void;
  updateItem: (id: string, patch: Partial<Omit<BagItem, 'id' | 'menuId'>>) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const BagContext = createContext<BagContextValue | null>(null);

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);

  const addItem = useCallback((item: Omit<BagItem, 'id'>) => {
    setItems((prev) => {
      const existing = prev.find(
        (it) =>
          it.menuId === item.menuId &&
          it.size === item.size &&
          it.sweetness === item.sweetness,
      );
      if (existing) {
        return prev.map((it) =>
          it.id === existing.id
            ? { ...it, quantity: it.quantity + item.quantity }
            : it,
        );
      }
      return [...prev, { ...item, id: makeId() }];
    });
  }, []);

  const updateItem = useCallback<BagContextValue['updateItem']>((id, patch) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalQuantity = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);

  const value: BagContextValue = {
    items,
    totalQuantity,
    subtotal,
    addItem,
    updateItem,
    removeItem,
    clear,
  };

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error('useBag must be used inside <BagProvider>');
  return ctx;
}
