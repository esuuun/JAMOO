import { CategoryBanner } from '@/src/components/manual-order/CategoryBanner';
import { MenuGrid } from '@/src/components/manual-order/MenuGrid';
import { fetchMenusByCategory } from '@/lib/fetchMenus';

export default async function SignaturePage() {
  const items = await fetchMenusByCategory('signature');

  return (
    <>
      <CategoryBanner
        title={'Signature\nSeries'}
        imageSrc="/manual-order/banner-signature.png"
      />
      <div className="flex-1 px-4 sm:px-6 md:px-12 py-6 md:py-10">
        <MenuGrid items={items} />
      </div>
    </>
  );
}
