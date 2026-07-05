"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const images = [
  // "/11.png",
  "/33.png",
  "/22.png",
  // "/44.png",
  "/677276fd561b48d392692e3b_LEATHER-min.png",
  "/677276fd561b48d392692e3c_FABRIC-min.png",
  "/677276fd561b48d392692e3d_STONE-min.png",
  "/677276fd561b48d392692e3a_WOOD-min.png",
  "/677276fd561b48d392692e39_METAL-min.png",
];

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!imgRef.current) return;

    let current = 0;
    let tl: gsap.core.Timeline;

    const distance = window.innerHeight * 0.45;

    const playAnimation = () => {
      if (!imgRef.current) return;

      gsap.set(imgRef.current, {
        y: distance,
        opacity: 0,
        rotate: -360,
        scale: 0.7,
      });

      tl = gsap.timeline({
        onComplete: () => {
          current = (current + 1) % images.length;
          setIndex(current);
        },
      });

      tl.to(imgRef.current, {
        y: 0,
        opacity: 1,
        rotate: 0,
        scale: 1,
        duration: 1.6,
        ease: "expo.out",
      })

        .to({}, { duration: 0.7 })

        .to(imgRef.current, {
          y: -distance,
          opacity: 0,
          rotate: 360,
          scale: 0.8,
          duration: 1.6,
          ease: "expo.in",
        })

        .call(() => {
          playAnimation();
        });
    };

    playAnimation();

    return () => tl?.kill();
  }, []);

  return (
    <section className="relative flex h-screen items-center justify-center overflow-hidden">

      {/* Floating Image */}
      <div
        ref={imgRef}
        className="absolute z-0 will-change-transform"
      >
        <Image
          src={images[index]}
          alt=""
          width={500}
          height={500}
          priority
          className="
            w-[110px]
            sm:w-[140px]
            md:w-[190px]
            lg:w-[250px]
            xl:w-[400px]
            2xl:w-[380px]
            h-auto
            object-contain
            select-none
          "
        />
      </div>

      {/* Heading */}
      <div className="relative z-10 pointer-events-none">

        <h1
          className="
            text-center
            uppercase
            font-black
            leading-[1.0]
            tracking-[-0.04em]
            mix-blend-difference
            select-none

            text-[10vw]
            sm:text-[10vw]
            md:text-[10vw]
            lg:text-[8vw]
            xl:text-[7vw]
            2xl:text-[8vw]
          "
        >
          ELEVATE
          <br />
          LIVING
        </h1>

      </div>

    </section>
  );
}