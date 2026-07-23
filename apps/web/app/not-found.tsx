"use client";

import Link from "next/link";
import Navbar from "@/components/component/Home/Navbar";
import SiteFooter from "@/components/component/Home/Footer";

export default function NotFound() {
  return (
    <div className="light-theme bg-background text-foreground min-h-screen flex flex-col justify-between">
      <Navbar theme="light" />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-8xl font-black text-muted-foreground/30 mb-2">404</h1>
          <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-sm mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <SiteFooter bgColor="bg-white" textColor="text-black" />
    </div>
  );
}
