import Image from 'next/image';

// Layered landscape composition mirrored from Figma frame (1440 × ~700 region).
// Each entry is rendered absolute-positioned inside a 1440-wide reference box
// that's centered horizontally; smaller viewports clip the sides via overflow-hidden.

type Layer = {
  src: string;
  top: number;
  left: number;
  w: number;
  h: number;
  flipX?: boolean;
};

const LAYERS: Layer[] = [
  { src: '/manual-order/landscape-1.svg', top: 10, left: 502, w: 618, h: 75, flipX: true },
  { src: '/manual-order/landscape-2.svg', top: 85, left: -646, w: 1392, h: 169 },
  { src: '/manual-order/landscape-3.svg', top: -47, left: 232, w: 1217, h: 387 },
  { src: '/manual-order/landscape-4.svg', top: 19, left: 232, w: 1369, h: 397 },
  { src: '/manual-order/landscape-5.svg', top: 159, left: 780, w: 819, h: 261 },
  { src: '/manual-order/landscape-cloud.svg', top: 69, left: 295, w: 971, h: 571 },
  { src: '/manual-order/landscape-mountain.svg', top: 146, left: -287, w: 1854, h: 395 },
  { src: '/manual-order/landscape-cloud.svg', top: 304, left: 537, w: 971, h: 571 },
  { src: '/manual-order/landscape-cloud.svg', top: 289, left: 830, w: 971, h: 571 },
  { src: '/manual-order/landscape-cloud.svg', top: 265, left: -415, w: 971, h: 571 },
  { src: '/manual-order/landscape-cloud.svg', top: 254, left: -160, w: 971, h: 571 },
  { src: '/manual-order/landscape-cloud.svg', top: 265, left: 781, w: 971, h: 571 },
];

export function LandscapeBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[820px] overflow-hidden flex justify-center"
      aria-hidden
    >
      {/* 1440-wide reference frame, centered */}
      <div className="relative w-[1440px] h-[820px] shrink-0">
        {LAYERS.map((l, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${l.left}px`,
              top: `${l.top}px`,
              width: `${l.w}px`,
              height: `${l.h}px`,
              transform: l.flipX ? 'scaleX(-1)' : undefined,
            }}
          >
            <Image
              src={l.src}
              alt=""
              fill
              sizes="1440px"
              className="object-contain"
              aria-hidden
            />
          </div>
        ))}
      </div>

      {/* Smooth fade to cream page bg */}
      <div className="absolute inset-x-0 bottom-0 h-[260px] bg-gradient-to-b from-transparent to-[#f8fddd]" />
    </div>
  );
}
