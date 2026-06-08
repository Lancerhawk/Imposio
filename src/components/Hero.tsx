"use client";

import { Upload } from "lucide-react";

interface HeroProps {
  onUploadClick: () => void;
}

export default function Hero({ onUploadClick }: HeroProps) {
  return (
    <section className="relative text-center py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-50 rounded-full opacity-60 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          100% Browser-Based · No Upload Required
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-stone-900 mb-4 leading-tight tracking-tight">
          Impo
          <span className="text-red-600">sio</span>
        </h1>

        <p className="text-xl md:text-2xl font-semibold text-stone-700 mb-4">
          Convert PDFs into print-ready booklets in seconds.
        </p>

        <p className="text-base text-stone-500 mb-10 max-w-xl mx-auto leading-relaxed">
          Upload any PDF and Imposio automatically rearranges pages into booklet
          order, ready for duplex printing, folding, and binding.
        </p>

        <button
          id="hero-upload-btn"
          onClick={onUploadClick}
          className="
            inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700
            text-white font-bold rounded-xl text-lg
            transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]
          "
        >
          <Upload className="w-5 h-5" strokeWidth={2} />
          Upload PDF
        </button>

        <p className="mt-4 text-xs text-stone-400">
          Files never leave your device — processed entirely in your browser
        </p>
      </div>
    </section>
  );
}
