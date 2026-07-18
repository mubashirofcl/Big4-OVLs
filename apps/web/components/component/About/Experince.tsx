"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Experinces() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mobileHeadingRef = useRef<HTMLHeadingElement>(null);
    const desktopHeadingRef = useRef<HTMLHeadingElement>(null);
    const mobileParagraphRef = useRef<HTMLParagraphElement>(null);
    const desktopParagraphRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Animate mobile heading lines
            const mobileLines = mobileHeadingRef.current?.querySelectorAll("span") || [];
            gsap.from(mobileLines, {
                y: 60,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "top 30%",
                    scrub: false,
                },
            });

            // Animate mobile paragraph lines
            const mobileParaLines = mobileParagraphRef.current?.querySelectorAll("span") || [];
            gsap.from(mobileParaLines, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.08,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "top 30%",
                    scrub: false,
                },
            });

            // Animate desktop heading lines
            const desktopLines = desktopHeadingRef.current?.querySelectorAll("span") || [];
            gsap.from(desktopLines, {
                y: 80,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                stagger: 0.15,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "top 20%",
                    scrub: false,
                },
            });

            // Animate desktop paragraph lines
            const desktopParaLines = desktopParagraphRef.current?.querySelectorAll("span") || [];
            gsap.from(desktopParaLines, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.4,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "top 20%",
                    scrub: false,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className=" md:min-h-screen w-screen flex justify-center items-center"
        >

            {/* Mobile */}
            <div className="block md:hidden w-full text-center px-6">
                <h1 ref={mobileHeadingRef} className="text-3xl font-black uppercase ">
                    <span className="block">The</span>
                    <span className="block">experience</span>
                    <span className="block">begins with</span>
                    <span className="block">BIG4 Tiles</span>
                </h1>

                <p ref={mobileParagraphRef} className="font-inter text-xs mt-8 leading-5 text-[#8e8e8e]">
                    <span className="block">Since 2017, BIG4 Tiles & Sanitary has been transforming homes and commercial spaces with premium tiles, sanitaryware, bath fittings, and surface solutions.</span>
                    <span className="block">Trusted by homeowners, architects, builders, and interior designers, we bring together leading brands, expert guidance, and exceptional quality to help create spaces that are beautiful, functional, and built to last.</span>
                </p>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex w-full justify-center">
                <div className="max-w-6xl text-center">
                    <h1 ref={desktopHeadingRef} className="text-5xl leading-13 font-extrabold  uppercase ">
                        <span className="block">The</span>
                        <span className="block">experience</span>
                        <span className="block">begins with</span>
                        <span className="block">BIG4 Tiles</span>
                    </h1>

                    <p ref={desktopParagraphRef} className="font-inter text-sm mt-8 px-[25%]  text-[#8e8e8e]">
                        <span className="block">Since 2017, BIG4 Tiles & Sanitary has been transforming homes and commercial spaces with premium tiles, sanitaryware, bath fittings, and surface solutions.</span>
                        <span className="block">Trusted by homeowners, architects, builders, and interior designers, we bring together leading brands, expert guidance, and exceptional quality to help create spaces that are beautiful, functional, and built to last.</span>
                    </p>
                </div>
            </div>

        </div>
    );
}