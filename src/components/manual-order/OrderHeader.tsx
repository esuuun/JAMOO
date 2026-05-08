import Image from 'next/image';

export function OrderHeader() {
  return (
    <header>
      <h1 className="text-[28px] font-bold text-[#523921] leading-none tracking-tight">
        PICK UP
      </h1>
      <div className="mt-3 flex items-center gap-3 bg-[rgba(130,161,188,0.2)] rounded-[5px] h-[35px] px-4 max-w-full">
        <Image
          src="/manual-order/store.svg"
          alt=""
          width={22}
          height={18}
          className="shrink-0"
          aria-hidden
        />
        <span className="text-[14px] md:text-[15px] font-bold text-[#523921] leading-none truncate">
          JAMOO MRT Blok M BCA
        </span>
      </div>
    </header>
  );
}
