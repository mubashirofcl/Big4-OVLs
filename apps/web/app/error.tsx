"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/component/Home/Navbar";
import SiteFooter from "@/components/component/Home/Footer";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="light-theme bg-background text-foreground min-h-screen flex flex-col justify-between">
      <Navbar theme="light" />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-32 pb-20">
        <div className="max-w-md mx-auto">
          <h1 className="text-6xl font-black text-muted-foreground/30 mb-2">500</h1>
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground text-sm mb-8">
            An unexpected error occurred while loading this page.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-black text-white text-xs font-semibold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-black/20 text-black text-xs font-semibold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter bgColor="bg-white" textColor="text-black" />
    </div>
  );
}
