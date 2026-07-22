"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import spin1 from "@/public/images/hero/spinHero/spin1.png";
import spin2 from "@/public/images/hero/spinHero/spin2.png";
import spin3 from "@/public/images/hero/spinHero/spin3.png";
import spin4 from "@/public/images/hero/spinHero/spin4.png";
import spin5 from "@/public/images/hero/spinHero/spin5.png";
import spin6 from "@/public/images/hero/spinHero/spin6.png";
import spin7 from "@/public/images/hero/spinHero/spin7.png";

const images = [spin1, spin2, spin3, spin4, spin5, spin6, spin7];

export default function Hero() {
  const imgRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    let current = 0;
    let tl: gsap.core.Timeline | null = null;
    let isMounted = true;

    const distance = window.innerHeight * 0.45;

    const ctx = gsap.context(() => {
      gsap.set([line1Ref.current, line2Ref.current], {
        y: 120,
        opacity: 0,
      });

      gsap.to([line1Ref.current, line2Ref.current], {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.7,
      });

      const playAnimation = () => {
        if (!imgRef.current || !isMounted) return;

        gsap.set(imgRef.current, {
          y: distance,
          opacity: 0,
          rotate: -360,
          scale: 0.7,
        });

        tl = gsap.timeline({
          onComplete: () => {
            if (!isMounted) return;

            current = (current + 1) % images.length;
            setIndex(current);
            playAnimation();
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
          });
      };

      playAnimation();
    });

    return () => {
      isMounted = false;
      tl?.kill();
      ctx.revert();
    };
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
          alt="Big4 Tiles & Sanitary showroom interior — Sullia"
          width={500}
          height={500}
          priority
          className={`
            w-[150px]
            sm:w-[160px]
            md:w-[190px]
            lg:w-[250px]
            xl:w-[400px]
            2xl:w-[380px]
            h-auto
            object-contain
            select-none
            transition-transform duration-300
            ${index === 3 || index === 5 ? "scale-150" : "scale-100"}
          `}
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
    font-bold

    text-[9vw]
    sm:text-[10vw]
    md:text-[10vw]
    lg:text-[8vw]
    xl:text-[7vw]
    2xl:text-[7vw]
  "
        >
          <div className="overflow-hidden">
            <div ref={line1Ref}>Living</div>
          </div>

          <div className="overflow-hidden">
            <div ref={line2Ref}>Experience</div>
          </div>
          <span className="sr-only">Big4 Tiles & Sanitaryware Showroom — Sullia, Dakshina Kannada</span>
        </h1>

      </div>


      <div className="absolute bottom-8 lg:bottom-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">

        <span className="text-[8px] lg:text-[10px]  uppercase  mix-blend-difference text-white">
          Scroll Down
        </span>
      </div>

    </section>
  );
}