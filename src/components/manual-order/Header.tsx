import Image from 'next/image';

export function Header() {
  return (
    <header className="relative bg-white rounded-[58px] shadow-[0_0_10px_rgba(130,161,188,0.25)] px-8 md:px-14 py-6 md:py-7">
      <h1 className="text-[28px] md:text-[37px] font-bold text-[#523921] leading-none tracking-tight">
        PICK UP
      </h1>
      <div className="mt-3 inline-flex items-center gap-3 bg-[rgba(130,161,188,0.2)] rounded-[5px] h-[35px] px-4 max-w-full">
        <Image
          src="/manual-order/store.svg"
          alt=""
          width={29}
          height={24}
          className="w-[22px] md:w-[29px] h-auto shrink-0"
        />
        <span className="text-[16px] md:text-[21px] font-bold text-[#523921] leading-none truncate">
          JAMOO MRT Blok M BCA
        </span>
      </div>
    </header>
  );
}
