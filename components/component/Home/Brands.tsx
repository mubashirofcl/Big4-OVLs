"use client";

import BrandCard from "@/components/ui/BrandCard";

const brands = [
  "VENOM",
  "CERA",
  "JAQUAR",
  "KAJARIA",
  "SOMANY",
  "NITCO",
  "JOHNSON",
  "AGL",
  "ORIENTBELL",
  "HINDWARE",
];

export default function BrandsSection() {
  return (
    <section
      id="brands"
      className="overflow-hidden bg-black text-white"
    >
      <div
        className="
          mx-auto
          max-w-[1220px]

          px-6
          sm:px-8
          lg:pl-56

          py-20
          md:py-28
          xl:py-36
        "
      >
        {/* Heading */}

        <div className="mb-16 md:mb-24 lg:mb-28 max-w-[520px]">
          <h2
            className="
              uppercase
              font-black
              leading-[1.0]
              tracking-[-0.05em]

              text-[30px]
              sm:text-[56px]
              md:text-[68px]
              lg:text-[56px]
              xl:text-[56px]
            "
          >
            OUR
            <br />
            EXCLUSIVE
            <br />
            BRANDS
          </h2>
        </div>

        {/* Grid */}

        <div
          className="
            grid
            grid-cols-2

            gap-4
            sm:gap-6
            md:gap-8
            xl:gap-10
          "
        >
          {brands.map((brand) => (
            <BrandCard
              key={brand}
              title={brand}
            />
          ))}
        </div>

        {/* CTA */}

        <div className="mt-16 md:mt-20 lg:mt-24">
          <button
            className="
              group
              relative

              flex
              items-center
              gap-5

              h-14
              md:h-14

              overflow-hidden

              border
              border-[#4d4d4d]

              px-8
              md:px-8

              uppercase
              font-semibold
              tracking-[0.12em]

              text-[10px]
              md:text-[8px]

              text-white
            "
          >
            {/* Fill */}

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
              EXPLORE OUR BRANDS
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
      </div>
    </section>
  );
}