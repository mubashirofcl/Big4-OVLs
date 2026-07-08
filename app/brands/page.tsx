"use client"
import { useEffect, useRef } from "react";
import Image from "next/image";
import { DoorClosed, Sofa, Lamp, UtensilsCrossed } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const brands = [
    {
        name: "MODULNOVA",
        href: "https://www.aristo-group.co.il/brands/modulnova",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    },
    {
        name: "MERIDIANI",
        href: "#",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
    },
    {
        name: "FIAM",
        href: "#",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    },
    {
        name: "MOLTENI&C",
        href: "#",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
    },
    {
        name: "POLIFORM",
        href: "#",
        image: "https://images.unsplash.com/photo-1616594039964-ae9021ef2b31?w=1200&q=80",
    },
    {
        name: "RIMADESIO",
        href: "#",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    },
];

const filters = [
    { label: "ALL", icon: null },
    { label: "WARDROBES", icon: DoorClosed },
    { label: "FURNITURE", icon: Sofa },
    { label: "APPLIENCES", icon: Lamp },
    { label: "KITCHEN & SYSTEMS", icon: UtensilsCrossed },
];

export default function OurBrands() {
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mm = gsap.matchMedia();

        // Pinned horizontal-scroll-reveal — desktop/tablet only.
        // Mobile keeps the native swipe carousel (see className below).
        mm.add("(min-width: 768px)", () => {
            const track = trackRef.current;
            const wrapper = wrapperRef.current;
            const section = sectionRef.current;
            if (!track || !wrapper || !section) return;

            const scrollAmount = () => track.scrollWidth - wrapper.offsetWidth;

            const tween = gsap.to(track, {
                x: () => -scrollAmount(),
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: () => "+=" + scrollAmount(),
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                },
            });

            return () => {
                tween.scrollTrigger?.kill();
                tween.kill();
            };
        });

        return () => mm.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="bg-black text-white py-16 md:py-20 lg:py-24 overflow-hidden"
        >
            {/* Heading */}
            <h2 className="text-center font-bold uppercase tracking-widest text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-10 md:mb-14 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                Our Brands
            </h2>

            {/* Wrapper clips the track on desktop; on mobile it's just the scroll container */}
            <div
                ref={wrapperRef}
                className="
                    overflow-x-auto md:overflow-hidden
                    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                "
            >
                <div
                    ref={trackRef}
                    className="
                        flex gap-4 snap-x snap-mandatory px-4 pb-2
                        md:snap-none md:gap-6 md:px-8 lg:gap-10 lg:px-16 md:w-max
                    "
                >
                    {brands.map((brand) => (
                        <a
                            key={brand.name}
                            href={brand.href}
                            className="
                                group shrink-0 snap-start
                                w-[78%] sm:w-[60%] md:w-[420px] lg:w-[520px]
                            "
                        >
                            <div className="relative w-full h-64 md:h-80 lg:h-[420px] overflow-hidden">
                                <Image
                                    src={brand.image}
                                    alt={brand.name}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 768px) 80vw, 40vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <p className="mt-4 font-bold uppercase tracking-wide text-lg md:text-xl text-white">
                                {brand.name}
                            </p>
                        </a>
                    ))}
                </div>
            </div>

            {/* Filter pills */}
            <div className="mt-10 md:mt-12 flex flex-wrap justify-center gap-3 px-4">
                {filters.map(({ label, icon: Icon }) => (
                    <button
                        key={label}
                        className="
                            flex items-center gap-2 rounded-full border border-white/60
                            px-5 py-2.5 text-xs md:text-sm font-semibold uppercase tracking-wide text-white
                            hover:bg-white hover:text-black transition-colors
                        "
                    >
                        {Icon && <Icon size={16} strokeWidth={1.75} />}
                        {label}
                    </button>
                ))}
            </div>
        </section>
    );
}