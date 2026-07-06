"use client"
import Image from "next/image";

export default function ContactForm() {
    return (
        <section className="pt-32 pb-20 bg-black text-white flex justify-center">
            <div className="w-full max-w-sm md:max-w-3xl lg:max-w-5xl px-4 md:px-0">
                {/* Heading */}
                <h1 className="text-4xl lg:text-4xl font-bold text-center tracking-wider">
                    CONTACT
                </h1>

                <div className="md:flex md:py-8 md:gap-10 lg:gap-16 lg:justify-center md:items-start">

                    {/* Image */}
                    <div className="mt-8 md:mt-10 md:w-1/2">
                        <Image
                            src="/contact.webp"
                            alt="Contact"
                            width={1000}
                            height={350}
                            className="w-full h-64 md:h-full object-cover"
                        />
                    </div>

                    {/* Form */}
                    <form className="mt-10 md:mt-10 md:w-1/2 flex flex-col gap-8">
                        {/* Full Name */}
                        <div>
                            <label className="block uppercase tracking-widest text-base md:text-lg font-semibold mb-3">
                                Full Name:
                            </label>
                            <input
                                type="text"
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white outline-none pb-2 text-white"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block uppercase tracking-widest text-base md:text-lg font-semibold mb-3">
                                Email Address:
                            </label>
                            <input
                                type="email"
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white outline-none pb-2 text-white"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block uppercase tracking-widest text-base md:text-lg font-semibold mb-3">
                                Phone Number:
                            </label>
                            <input
                                type="tel"
                                className="w-full bg-transparent border-b border-gray-600 focus:border-white outline-none pb-2 text-white"
                            />
                        </div>

                        {/* Select */}
                        <div>
                            <label className="block uppercase tracking-widest text-base md:text-lg font-semibold mb-4">
                                I'm Interested In
                            </label>

                            <select className="w-full bg-transparent border-b border-gray-600 pb-3 outline-none text-gray-300">
                                <option className="bg-black">Buying Products</option>
                                <option className="bg-black">Business collaboration</option>
                            </select>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="mt-4 w-full bg-white text-black py-4 uppercase tracking-[0.3em] font-semibold hover:bg-gray-200 transition"
                        >
                            Send
                        </button>
                    </form>

                </div>
            </div>
        </section>
    );
}