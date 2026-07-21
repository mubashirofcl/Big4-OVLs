"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  interest: string;
};

/* ─────────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────────── */

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  icon,
}: {
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-inter uppercase tracking-[0.2em] text-[8px] font-semibold text-[#555]">
        {label}
      </label>
      <div
        className={`relative flex items-center bg-[#0d0d0d] border rounded-sm transition-all duration-300 ${
          focused ? "border-white" : "border-[#1e1e1e]"
        }`}
      >
        {icon && (
          <span className="pl-3 text-[#333]">{icon}</span>
        )}
        <input
          required={required}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent py-2.5 px-3 text-xs text-white placeholder:text-[#2a2a2a] outline-none font-inter"
        />
      </div>
    </div>
  );
}

function ContactInfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | string[];
  href?: string;
}) {
  const lines = Array.isArray(value) ? value : [value];
  return (
    <div className="flex items-start gap-4 group">
      <div className="mt-0.5 w-9 h-9 rounded-full border border-[#2a2a2a] flex items-center justify-center text-[#555] group-hover:border-white group-hover:text-white transition-all duration-300 flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="uppercase tracking-[0.2em] text-[9px] text-[#444] font-semibold">
          {label}
        </span>
        {lines.map((l, i) =>
          href ? (
            <a
              key={i}
              href={href}
              className="text-[13px] text-[#aaa] hover:text-white transition-colors duration-200 leading-relaxed"
            >
              {l}
            </a>
          ) : (
            <span key={i} className="text-[13px] text-[#aaa] leading-relaxed">
              {l}
            </span>
          )
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */

export default function ContactForm() {
  const heroRef        = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const cardRef        = useRef<HTMLDivElement>(null);
  const whyRef         = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    interest: "Buying Products",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k: keyof FormState) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  /* ── Hero: entrance + scroll parallax ── */
  useEffect(() => {
    if (!heroRef.current || !heroContentRef.current) return;
    const ctx = gsap.context(() => {

      /* — entrance animations — */
      gsap.set(".h-line", { yPercent: 115, opacity: 0 });
      gsap.to(".h-line", {
        yPercent: 0, opacity: 1,
        duration: 1.4, stagger: 0.08, ease: "power4.out", delay: 0.4,
      });
      gsap.from(".h-sub",    { y: 24, opacity: 0, duration: 1,   ease: "power3.out", delay: 1.0 });
      gsap.from(".h-badge",  { y: 16, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.9 });
      gsap.from(".h-scroll", { y: 16, opacity: 0, duration: 0.8, delay: 1.5 });

      /* — scroll-driven parallax: content drifts up & fades — */
      gsap.to(heroContentRef.current, {
        yPercent: -28,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      /* — scroll hint fades faster — */
      gsap.to(".h-scroll", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "25% top",
          scrub: true,
        },
      });

      /* — grid bg slight zoom-out as user scrolls — */
      gsap.to(".hero-grid", {
        scale: 1.08,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

    }, heroRef);
    return () => ctx.revert();
  }, []);

  /* ── Card section animation ── */
  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".card-left", {
        x: -60, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 75%", once: true },
      });
      gsap.from(".card-right", {
        x: 60, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: cardRef.current, start: "top 75%", once: true },
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  /* ── Why section animation ── */
  useEffect(() => {
    if (!whyRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".why-item", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: whyRef.current, start: "top 80%", once: true },
      });
    }, whyRef);
    return () => ctx.revert();
  }, []);

  /* ── Map animation ── */
  useEffect(() => {
    if (!mapRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".map-el", {
        y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: mapRef.current, start: "top 80%", once: true },
      });
    }, mapRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSubmitted(true); }, 1800);
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <main className="bg-black text-white overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center h-screen border-b border-[#141414] overflow-hidden"
      >
        {/* grid bg — parallax target */}
        <div
          className="hero-grid pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* noise overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── parallax content wrapper ── */}
        <div
          ref={heroContentRef}
          className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8 select-none will-change-transform"
        >
          {/* badge */}
          <div className="h-badge inline-flex items-center gap-2 mb-6 sm:mb-8 px-3 sm:px-4 py-1.5 sm:py-2 border border-[#2a2a2a] rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse flex-shrink-0" />
            <span className="font-inter uppercase tracking-[0.22em] sm:tracking-[0.28em] text-[8px] sm:text-[9px] text-[#777]">
              Response Within 24 Hours
            </span>
          </div>

          {/* giant heading — clipped so slide-up works */}
          <div className="overflow-hidden">
            <h1 className="h-line font-black uppercase tracking-[-0.05em] leading-[0.88]
              text-[13vw]
              sm:text-[13vw]
              md:text-[12vw]
              lg:text-[10vw]
              xl:text-[9vw]
            ">
              CONTACT
            </h1>
          </div>

          {/* sub-line */}
          <div className="overflow-hidden mt-3 sm:mt-4">
            <p className="h-sub font-inter uppercase
              tracking-[0.3em] sm:tracking-[0.45em]
              text-[8px] sm:text-[9px] md:text-[10px]
              text-[#444]
            ">
              Tiles &amp; Sanitary &mdash; Let&apos;s Build Something Beautiful
            </p>
          </div>
        </div>

        {/* scroll hint */}
        <div className="h-scroll absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2">
          <span className="font-inter uppercase tracking-[0.3em] text-[7px] sm:text-[8px] text-[#333]">Scroll</span>
          <div className="w-px h-8 sm:h-10 overflow-hidden">
            <div
              className="w-px h-full bg-gradient-to-b from-transparent via-[#555] to-transparent"
              style={{ animation: "scrollLine 1.8s ease-in-out infinite" }}
            />
          </div>
        </div>

        <style>{`
          @keyframes scrollLine {
            0%   { transform: translateY(-100%); }
            100% { transform: translateY(200%); }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════
          MAIN CONTACT CARD
      ══════════════════════════════════════════ */}
      <section ref={cardRef} className="px-4 sm:px-8 lg:px-16 xl:px-24 py-10 lg:py-14">
        <div className="mx-auto max-w-6xl">

          {/* outer card */}
          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] rounded-sm overflow-hidden border border-[#1a1a1a]">

            {/* ── LEFT PANEL ── */}
            <div className="card-left relative bg-[#080808] p-7 sm:p-9 lg:p-10 flex flex-col justify-between gap-8 border-b border-[#1a1a1a] lg:border-b-0 lg:border-r lg:border-[#1a1a1a]">

              {/* decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-[#222] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-[#1a1a1a] pointer-events-none" />

              <div>
                {/* status badge */}
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="font-inter uppercase tracking-[0.25em] text-[8px] text-[#555] font-semibold">
                    Response Within 24 Hours
                  </span>
                </div>

                <h2 className="font-black uppercase tracking-[-0.04em] leading-[0.95] text-2xl sm:text-3xl lg:text-[1.9rem]">
                  Tell us about<br />your project
                </h2>

                <p className="font-inter mt-3 text-[11px] leading-[1.8] text-[#555] max-w-xs">
                  We&apos;ll schedule a visit or call to understand your space, style, and requirements. Prefer email? Reach us directly below.
                </p>
              </div>

              {/* contact rows */}
              <div className="flex flex-col gap-4">
                <ContactInfoRow
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  }
                  label="Email"
                  value={["hello@big4tiles.com", "sales@big4tiles.com"]}
                  href="mailto:hello@big4tiles.com"
                />
                <ContactInfoRow
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.72A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.17a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                    </svg>
                  }
                  label="Phone / WhatsApp"
                  value="+91 98765 43210"
                  href="tel:+919876543210"
                />
                <ContactInfoRow
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                  }
                  label="Showroom"
                  value={["123 Tile Avenue, Design District,", "Mumbai — 400001"]}
                />
              </div>

              {/* hours strip */}
              <div className="border-t border-[#181818] pt-4">
                <p className="font-inter uppercase tracking-[0.2em] text-[8px] text-[#444] mb-2.5 font-semibold">
                  Showroom Hours
                </p>
                <div className="flex flex-col gap-1.5">
                  {[
                    ["Mon – Sat", "10am – 7pm"],
                    ["Sunday",   "11am – 5pm"],
                  ].map(([d, t]) => (
                    <div key={d} className="flex justify-between">
                      <span className="font-inter text-[11px] text-[#555]">{d}</span>
                      <span className="font-inter text-[11px] text-[#888]">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL — FORM ── */}
            <div className="card-right bg-[#050505] p-7 sm:p-9 lg:p-10">
              {submitted ? (
                /* ── success state ── */
                <div className="h-full min-h-[420px] flex flex-col items-center justify-center gap-6 text-center">
                  <div className="w-16 h-16 rounded-full border border-[#2a2a2a] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-white">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="uppercase font-black tracking-[0.1em] text-2xl">Message Sent</h3>
                    <p className="mt-3 text-[12px] text-[#555] leading-relaxed max-w-xs mx-auto">
                      Thank you for reaching out. Our team will contact you within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name:"", email:"", phone:"", subject:"", message:"", interest:"Buying Products" }); }}
                    className="mt-4 uppercase text-[9px] tracking-[0.3em] text-[#555] border-b border-[#333] pb-1 hover:text-white hover:border-white transition-all duration-300"
                  >
                    Send Another →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                  {/* row 1: name + email */}
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="Full Name"
                      placeholder="Name"
                      value={form.name}
                      onChange={set("name")}
                      required
                    />
                    <InputField
                      label="Email"
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={set("email")}
                      required
                    />
                  </div>

                  {/* row 2: phone + interest */}
                  <div className="grid grid-cols-2 gap-3">
                    <InputField
                      label="Phone / WhatsApp"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={set("phone")}
                    />
                    <div className="flex flex-col gap-1.5">
                      <label className="font-inter uppercase tracking-[0.2em] text-[8px] font-semibold text-[#555]">
                        I&apos;m Interested In
                      </label>
                      <select
                        value={form.interest}
                        onChange={(e) => set("interest")(e.target.value)}
                        className="font-inter bg-[#0d0d0d] border border-[#1e1e1e] focus:border-white rounded-sm py-2.5 px-3 text-xs text-[#888] outline-none transition-colors duration-300 cursor-pointer"
                      >
                        <option className="bg-black">Buying Products</option>
                        <option className="bg-black">Business Collaboration</option>
                        <option className="bg-black">Interior Design Consultation</option>
                        <option className="bg-black">Wholesale / Trade Enquiry</option>
                        <option className="bg-black">Project Sourcing</option>
                        <option className="bg-black">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* subject */}
                  <InputField
                    label="Project Subject"
                    placeholder="E.g. Bathroom Renovation / Showroom Flooring"
                    value={form.subject}
                    onChange={set("subject")}
                  />

                  {/* message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-inter uppercase tracking-[0.2em] text-[8px] font-semibold text-[#555]">
                      How Can We Help?
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe your vision, space requirements, and timeline…"
                      value={form.message}
                      onChange={(e) => set("message")(e.target.value)}
                      className="font-inter w-full bg-[#0d0d0d] border border-[#1e1e1e] focus:border-white rounded-sm py-2.5 px-3 text-xs text-white placeholder:text-[#2a2a2a] outline-none resize-none transition-colors duration-300"
                    />
                  </div>

                  {/* submit */}
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={sending}
                      className="group w-full py-3 overflow-hidden bg-white text-black uppercase tracking-[0.25em] text-[10px] font-bold flex items-center justify-center gap-2.5 hover:bg-black hover:text-white border border-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                            <path d="M12 2a10 10 0 0110 10" strokeOpacity="0.9"/>
                          </svg>
                          Sending…
                        </span>
                      ) : (
                        <>
                          Send Message
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="font-inter text-center text-[9px] text-[#2e2e2e]">
                      By submitting you agree to our{" "}
                      <a href="#" className="text-[#444] hover:text-white underline underline-offset-2 transition-colors duration-200">privacy policy</a>.
                    </p>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY VISIT US — numbered grid
      ══════════════════════════════════════════ */}
      <section ref={whyRef} className="border-t border-[#141414] px-4 sm:px-8 lg:px-16 xl:px-24 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">

          {/* section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
            <div>
              <p className="why-item uppercase tracking-[0.3em] text-[9px] text-[#444] mb-4 font-semibold">Why Choose BIG4</p>
              <h2 className="why-item uppercase font-black tracking-[-0.04em] leading-none text-[8vw] sm:text-5xl lg:text-6xl">
                VISIT OUR<br />SHOWROOM
              </h2>
            </div>
            <p className="why-item text-[11px] text-[#444] max-w-xs leading-relaxed">
              Step inside and discover why thousands of homeowners and designers trust BIG4 for their premium spaces.
            </p>
          </div>

          {/* grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#111]">
            {[
              { num: "01", title: "10,000+ Products", desc: "One of the largest curated collections of premium tiles, sanitaryware, and surface solutions under one roof." },
              { num: "02", title: "Expert Consultants", desc: "Trained design specialists help you find the perfect combination for your style, space, and budget." },
              { num: "03", title: "Trusted Since 2017", desc: "A legacy of quality, reliability, and strong partnerships with world-class global brands." },
              { num: "04", title: "Exclusive Showroom Deals", desc: "Access showroom-only pricing, bundle offers, and limited collections not available anywhere online." },
              { num: "05", title: "After-Sales Support", desc: "Dedicated after-sales assistance, warranty coordination, and replacement service for every product." },
              { num: "06", title: "Easy Access & Parking", desc: "Centrally located with ample parking. Open 6 days a week for your convenience." },
            ].map((item) => (
              <div
                key={item.num}
                className="why-item group bg-black px-8 py-10 flex flex-col gap-5 hover:bg-[#070707] transition-colors duration-400"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#2a2a2a] group-hover:text-[#555] transition-colors duration-300 font-semibold">
                    {item.num}
                  </span>
                  <div className="w-5 h-px bg-[#1e1e1e] group-hover:w-8 group-hover:bg-white transition-all duration-500" />
                </div>
                <h3 className="uppercase font-bold text-sm tracking-[0.08em] leading-tight">{item.title}</h3>
                <p className="text-[11px] leading-[1.9] text-[#444] group-hover:text-[#666] transition-colors duration-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MAP / LOCATION
      ══════════════════════════════════════════ */}
      <section ref={mapRef} className="border-t border-[#141414] px-4 sm:px-8 lg:px-16 xl:px-24 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl">

          <div className="map-el flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-6">
            <div>
              <p className="uppercase tracking-[0.3em] text-[9px] text-[#444] mb-4 font-semibold">Find Us</p>
              <h2 className="uppercase font-black tracking-[-0.04em] leading-none text-4xl lg:text-6xl">
                OUR<br />SHOWROOM
              </h2>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 uppercase text-[10px] tracking-[0.25em] text-[#444] hover:text-white transition-colors duration-300"
            >
              Open in Google Maps
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300">
                <path d="M7 17L17 7"/><path d="M8 7h9v9"/>
              </svg>
            </a>
          </div>

          {/* map embed */}
          <div className="map-el w-full h-[360px] sm:h-[420px] lg:h-[500px] bg-[#080808] border border-[#141414] overflow-hidden rounded-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.9!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzUuNyJF!5e0!3m2!1sen!2sin!4v1600000000000"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(92%) hue-rotate(180deg) saturate(0.3) brightness(0.85)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="BIG4 Tiles & Sanitary Showroom Location"
            />
          </div>

          {/* address bar below map */}
          <div className="map-el mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-[#141414] px-6 py-5">
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#444] flex-shrink-0">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <span className="text-[12px] text-[#666]">
                123 Tile Avenue, Design District, Mumbai — 400001, Maharashtra, India
              </span>
            </div>
            <div className="flex gap-6">
              <div className="text-right hidden sm:block">
                <p className="uppercase tracking-[0.2em] text-[9px] text-[#444] mb-1">Mon – Sat</p>
                <p className="text-[12px] text-[#777]">10am – 7pm</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="uppercase tracking-[0.2em] text-[9px] text-[#444] mb-1">Sunday</p>
                <p className="text-[12px] text-[#777]">11am – 5pm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}