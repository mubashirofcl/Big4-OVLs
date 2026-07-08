"use client";

import Image from "next/image";

const CIRCLE_SIZE = 66;
const TOP_OFFSET = 48; // top-12 = 48px
const BOTTOM_OFFSET = 2; // bottom-14 = 56px

const images = [
  {
    src: "/77.webp",
    top: 180,
    left: 45,
    width: 160,
    height: 115,
  },
  {
    src: "/78.webp",
    top: 310,
    right: 40,
    width: 160,
    height: 105,
  },
  {
    src: "/79.webp",
    top: 500,
    left: 45,
    width: 160,
    height: 115,
  },
  {
    src: "/80.webp",
    top: 640,
    right: 40,
    width: 160,
    height: 180,
  },
  {
    src: "/81.jpg",
    top: 860,
    left: 120,
    width: 160,
    height: 105,
  },
];

export default function TimelineGallery() {
  return (
    <section className="flex justify-center  py-8">
      <div className="relative h-[1100px] w-[450px] overflow-hidden bg-[#1f2023]">

        {/* ---------- TOP CIRCLE ---------- */}

        <div
          className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#5d5d5d]"
          style={{
            top: TOP_OFFSET,
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
          }}
        />

        {/* ---------- CENTER LINE ---------- */}

        <div
          className="absolute left-1/2 w-px -translate-x-1/2 bg-[#4b4b4b]"
          style={{
            top: TOP_OFFSET + CIRCLE_SIZE,
            bottom: BOTTOM_OFFSET + CIRCLE_SIZE,
          }}
        />

        {/* ---------- BOTTOM CIRCLE ---------- */}

        <div
          className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#5d5d5d]"
          style={{
            bottom: BOTTOM_OFFSET,
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
          }}
        />

        {/* ---------- LINE BELOW BOTTOM CIRCLE ---------- */}

        <div
          className="absolute bottom-0 left-1/2 w-px -translate-x-1/2 bg-[#4b4b4b]"
          style={{
            height: BOTTOM_OFFSET,
          }}
        />

        {/* ---------- IMAGES ---------- */}

        {images.map((img, index) => (
          <div
            key={index}
            className="absolute overflow-hidden"
            style={{
              top: img.top,
              left: img.left,
              right: img.right,
              width: img.width,
              height: img.height,
            }}
          >
            <Image
              src={img.src}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}