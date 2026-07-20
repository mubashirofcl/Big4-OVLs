"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.clientWidth;
    const index = Math.round(scrollLeft / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  if (images.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full bg-muted/30 rounded-[var(--radius-xl)] overflow-hidden border border-border/50 flex items-center justify-center">
        <span className="text-muted-foreground">No Image Available</span>
      </div>
    );
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex < images.length - 1) setActiveIndex(activeIndex + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Mobile Snap Scroll (Hidden on lg) */}
      <div className="lg:hidden flex flex-col gap-4">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-[var(--radius-xl)] border border-border/50"
        >
          {images.map((src, i) => (
            <div key={i} className="relative w-full aspect-[4/3] shrink-0 snap-center bg-muted/30">
              <Image
                src={src}
                alt={`${alt} - Image ${i + 1}`}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <div className="flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      left: i * scrollRef.current.clientWidth,
                      behavior: "smooth"
                    });
                  }
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  activeIndex === i ? "bg-primary" : "bg-muted-foreground/30"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Gallery (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col gap-4">
        <div 
          className="relative w-full aspect-[4/3] bg-muted/30 rounded-[var(--radius-xl)] overflow-hidden border border-border/50 group cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={images[activeIndex]}
            alt={`${alt} - Image ${activeIndex + 1}`}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          
          {/* Hover Arrows */}
          {activeIndex > 0 && (
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-sm"
            >
              ←
            </button>
          )}
          {activeIndex < images.length - 1 && (
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-sm"
            >
              →
            </button>
          )}
        </div>

        {/* Desktop Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-3">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                  activeIndex === i ? "border-primary" : "border-transparent hover:border-primary/50"
                )}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="10vw"
                  className="object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur flex items-center justify-center cursor-zoom-out p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <Image
              src={images[activeIndex]}
              alt={`${alt} - Fullscreen`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button 
            className="absolute top-6 right-6 w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center text-xl hover:bg-muted transition-colors"
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
