import Image from "next/image";


export default function Exper() {
    return (
        <>
            <div className="">
                <div className="flex flex-col justify-center items-center text-center gap-4 py-20">
                    <h1 className="text-3xl font-black uppercase">30+ <br /> years</h1>
                    <p className="text-xs px-4 uppercase font-black">of bringing high-end interior products to your home.</p>
                </div>


                <div className="py-16 flex flex-col gap-16">
                    <div className="px-6">
                        <h1 className="text-3xl font-black">DESIGN</h1>
                        <p className="font-inter text-xs mt-4  leading-5 text-[#8e8e8e]">Great visions begin with a single step, and we are dedicated to guiding
                            you toward impeccable decisions for your home. In a world of boundless
                            possibilities, our expert team of architects and interior designers will
                            accompany you every step of the way. From selecting exquisite colors,
                            styles, and materials to curating the perfect appliances and accessories,
                            we craft spaces that reflect your unique elegance and sophistication.
                        </p>
                        <div className="relative mt-6 h-[250px] w-full overflow-hidden">
                            <Image
                                src="/44.webp"
                                alt=""
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="px-6">
                        <h1 className="text-3xl font-black">DELIVERY</h1>
                        <p className="font-inter text-xs mt-4  leading-5 text-[#8e8e8e]">|
                            Every piece and module is meticulously designed and
                            crafted on demand at our premier partner facilities in Italy,
                            embodying the essence of bespoke artistry. Our in-house
                            logistics team expertly manages international shipping and
                            domestic delivery, ensuring seamless coordination while
                            keeping you informed with tailored updates on timelines
                            and delivery status, all aligned with your exacting
                            requirements.
                        </p>
                        <div className="relative mt-6 h-[250px] w-full overflow-hidden">
                            <Image
                                src="/45.webp"
                                alt=""
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="px-6">
                        <h1 className="text-3xl font-black">ASSEMBLY</h1>
                        <p className="font-inter text-xs mt-4  leading-5 text-[#8e8e8e]">
                            We strive for unparalleled perfection and utmost client satisfaction. Our
                            comprehensive, end-to-end services feature an expert assembly team
                            dedicated to seamlessly bringing every element together. With meticulous
                            care, we ensure your cherished possessions are flawlessly assembled and
                            elegantly integrated into your home, reflecting the epitome of luxury and
                            precision.
                        </p>
                        <div className="relative mt-6 h-[250px] w-full overflow-hidden">
                            <Image
                                src="/46.jpg"
                                alt=""
                                fill
                                priority
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}