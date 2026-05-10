'use client';

import { useState } from 'react';
import { useBag } from '@/src/contexts/BagContext';
import { MenuItem } from '@/src/data/menuData';
import { MenuCard } from './MenuCard';
import { MenuDetailModal } from './MenuDetailModal';

type Props = {
  items: MenuItem[];
};

export function MenuGrid({ items }: Props) {
  const { addItem } = useBag();
  const [selected, setSelected] = useState<MenuItem | null>(null);

  function handleQuickAdd(item: MenuItem) {
    addItem({
      menuId: item.id,
      name: item.name,
      shortDescription: item.shortDescription,
      size: 'REGULAR',
      sweetness: 'NORMAL',
      quantity: 1,
      unitPrice: item.price.regular,
      imageUrl: item.image,
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10 justify-items-center">
        {items.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            onClick={() => setSelected(item)}
            onQuickAdd={() => handleQuickAdd(item)}
          />
        ))}
      </div>
      <MenuDetailModal item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
