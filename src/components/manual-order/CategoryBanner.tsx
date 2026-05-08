import Image from 'next/image';

type Props = {
  title: string;
  imageSrc: string;
};

export function CategoryBanner({ title, imageSrc }: Props) {
  return (
    <div className="relative h-[124px] rounded-[5px] overflow-hidden">
      <Image
        src={imageSrc}
        alt=""
        fill
        sizes="(min-width: 1024px) 1226px, 100vw"
        className="object-cover"
        priority
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(102.63deg, rgba(73, 111, 24, 0.6) 31%, rgba(243, 248, 217, 1) 105%)',
        }}
      />
      <h2
        className="absolute left-9 md:left-9 top-1/2 -translate-y-1/2 text-white font-bold text-[28px] md:text-[35px] leading-[1.05] whitespace-pre-line"
        style={{
          textShadow:
            '0px 0px 4px rgba(0,0,0,0.5), 0px 4px 4px rgba(0,0,0,0.25)',
        }}
      >
        {title}
      </h2>
    </div>
  );
}
