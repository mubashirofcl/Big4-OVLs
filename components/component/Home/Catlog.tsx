"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CatalogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !titleRef.current ||
      !buttonRef.current ||
      !circleRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      tl.from(circleRef.current, {
        opacity: 0,
        scale: 0,
        duration: 0.8,
        ease: "expo.out",
      });

      tl.from(
        titleRef.current,
        {
          opacity: 0,
          y: 80,
          scale: 0.9,
          duration: 1.2,
          ease: "expo.out",
        },
        "-=0.3"
      );

      tl.from(
        buttonRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex  lg:min-h-screen items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Decorative Circle */}

      

      {/* Content */}

      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1800px]
          flex-col
          items-center
          justify-center

          px-6
          sm:px-10
          lg:px-16
        "
      >
        {/* Title */}

        <h1
          ref={titleRef}
          className="
            text-center
            font-black
            uppercase

            leading-none
            tracking-[-0.06em]

            text-[10vw]
            sm:text-[12vw]
            md:text-[12vw]
            lg:text-[10vw]
            xl:text-[8vw]
            2xl:text-[7vw]
          "
        >
          CATALOG
        </h1>

        {/* Button */}

        <button
          ref={buttonRef}
          className="
            group
            relative
            cursor-pointer
            mt-10
            lg:mt-14

            flex
            h-12
            items-center
            gap-4

            overflow-hidden

            border
            border-[#3a3a3a]

            px-8

            text-[9px]
            sm:text-[10px]
            lg:text-[11px]

            font-semibold
            uppercase
            tracking-[0.14em]

            text-white
          "
        >
          {/* Background */}

          <span
            className="
              absolute
              inset-0
             

              origin-left
              scale-x-0

              bg-white

              transition-transform
              duration-500
              ease-[cubic-bezier(.76,0,.24,1)]

              group-hover:scale-x-100
            "
          />

          {/* Text */}

          <span
            className="
              relative
              z-10

              transition-colors
              duration-500

              group-hover:text-black
            "
          >
            SEE ALL PRODUCTS
          </span>

          {/* Arrow */}

          <span
            className="
              relative
              z-10

              transition-all
              duration-500

              group-hover:-translate-y-1
              group-hover:translate-x-1
              group-hover:text-black
            "
          >
            ↗
          </span>
        </button>
      </div>
    </section>
  );
}