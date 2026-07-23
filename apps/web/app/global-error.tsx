"use client";

import React from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-6xl font-black text-neutral-800 mb-2">500</h1>
          <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
          <p className="text-sm text-neutral-400 mb-8">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-full bg-white text-black text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
