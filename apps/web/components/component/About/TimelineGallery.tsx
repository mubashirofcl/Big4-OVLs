"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const images = [
  { src: "/77.webp", ratio: 170 / 125, align: "start" as const },
  { src: "/78.webp", ratio: 190 / 120, align: "end" as const },
  { src: "/79.webp", ratio: 170 / 125, align: "start" as const },
  { src: "/80.webp", ratio: 190 / 215, align: "end" as const },
  { src: "/81.jpg", ratio: 170 / 115, align: "start" as const },
];

function RevealImage({ src, ratio }: { src: string; ratio: number }) {
  const ref = useRef<HTMLDivElement>(null);

  // Tracks the ENTIRE time the image is in the viewport — not just its entrance.
  // This is what makes the motion continuous instead of a one-shot reveal.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Growth: only the first slice of scroll (0 -> 0.35) grows the mask open.
  // Runs in reverse too if you scroll back up.
  const clipBottom = useTransform(scrollYProgress, [0, 0.35], [100, 0]);
  const clipPath = useTransform(clipBottom, (v) => `inset(0% 0% ${Math.max(v, 0)}% 0%)`);

  // Parallax: the photo itself keeps drifting for the WHOLE time it's on screen —
  // this is the persistent "something is happening while I scroll" motion.
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ aspectRatio: ratio }}>
      <motion.div style={{ clipPath }} className="absolute inset-0">
        <motion.div style={{ y }} className="absolute inset-0 h-[124%] -top-[12%]">
          <Image src={src} alt="" fill sizes="(max-width: 1023px) 60vw, 484px" className="object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function TimelineGallery() {
  return (
    <section className="flex justify-center py-16 md:py-24">
      <div className="relative w-full max-w-[1100px] px-6">
        <div className="absolute left-1/2 top-[33px] bottom-[33px] z-0 w-px -translate-x-1/2 bg-[#4b4b4b]" />

        {/* Solid fallback color — works even if --page-bg is never defined */}
        <div className="absolute left-1/2 top-0 z-20 h-[66px] w-[66px] -translate-x-1/2 rounded-full border border-[#5d5d5d] bg-[color:var(--page-bg,#0a0a0a)]" />

        <div className="relative z-10 flex flex-col gap-16 pt-36 pb-36 md:gap-24 md:pt-44 md:pb-44 lg:gap-32">
          {images.map((img, i) => (
            <div
              key={i}
              className={
                "w-[62%] sm:w-[55%] md:w-[48%] lg:w-[44%] " +
                (img.align === "start" ? "self-start" : "self-end")
              }
            >
              <RevealImage src={img.src} ratio={img.ratio} />
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-1/2 z-20 h-[66px] w-[66px] -translate-x-1/2 rounded-full border border-[#5d5d5d] bg-[color:var(--page-bg,#0a0a0a)]" />
      </div>
    </section>
  );
}