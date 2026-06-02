"use client";

import { useState, useRef, useCallback } from "react";
import { AlertCircle } from "lucide-react";

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import UploadZone from "@/components/UploadZone";
import PdfInfoCard from "@/components/PdfInfo";
import BookletOptions from "@/components/BookletOptions";
import DownloadCard from "@/components/DownloadCard";
import ProgressBar from "@/components/ProgressBar";

import { PdfInfo, BookletInfo } from "@/types/pdf";
import { analyzePdf, generateBookletPdf } from "@/lib/pdf-utils";
import { computeBookletInfo } from "@/lib/booklet";

type AppStep = "upload" | "analyze" | "options" | "generating" | "done" | "error";

export default function Home() {
  const [appStep, setAppStep] = useState<AppStep>("upload");
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [bookletInfo, setBookletInfo] = useState<BookletInfo | null>(null);
  const [bookletBytes, setBookletBytes] = useState<Uint8Array | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const toolSectionRef = useRef<HTMLDivElement>(null);

  const scrollToTool = useCallback(() => {
    toolSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleFileAccepted = useCallback(async (file: File) => {
    setAppStep("analyze");
    setErrorMessage("");
    try {
      const info = await analyzePdf(file);
      const bInfo = computeBookletInfo(info.pageCount);
      setPdfInfo(info);
      setBookletInfo(bInfo);
      setAppStep("options");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to read PDF. Please make sure the file is a valid, non-encrypted PDF.");
      setAppStep("error");
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!pdfInfo) return;
    setAppStep("generating");
    setProgress(0);
    try {
      const bytes = await generateBookletPdf(pdfInfo.file, (p) => setProgress(p));
      setBookletBytes(bytes);
      setAppStep("done");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to generate booklet PDF. Please try a different file.");
      setAppStep("error");
    }
  }, [pdfInfo]);

  const handleReset = useCallback(() => {
    setPdfInfo(null);
    setBookletInfo(null);
    setBookletBytes(null);
    setProgress(0);
    setErrorMessage("");
    setAppStep("upload");
  }, []);

  const handleHeroUploadClick = () => {
    scrollToTool();
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="2" width="6" height="8" rx="1" fill="white" opacity="0.7" />
                <rect x="9" y="2" width="6" height="8" rx="1" fill="white" />
                <rect x="3" y="12" width="10" height="2" rx="1" fill="white" opacity="0.5" />
              </svg>
            </div>
            <span className="text-lg font-extrabold text-stone-900">
              Impo<span className="text-red-600">sio</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-stone-500">
            <a href="#features" className="hover:text-red-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-red-600 transition-colors">How It Works</a>
          </div>
          <button
            onClick={scrollToTool}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm"
          >
            Try Now
          </button>
        </div>
      </nav>

      <main>
        <Hero onUploadClick={handleHeroUploadClick} />

        <section
          ref={toolSectionRef}
          className="py-16 px-4 bg-stone-50 border-y border-stone-200"
          id="tool"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-stone-900 mb-2">
                Convert Your PDF
              </h2>
              <p className="text-stone-500 text-sm">
                Upload a PDF to instantly generate a booklet-ready version.
              </p>
            </div>

            <div className="space-y-5">
              {appStep === "upload" && (
                <UploadZone onFileAccepted={handleFileAccepted} />
              )}

              {appStep === "analyze" && (
                <div className="bg-white border border-stone-200 rounded-2xl p-10 flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
                  <p className="text-stone-600 font-medium">Analyzing PDF…</p>
                </div>
              )}

              {appStep === "options" && pdfInfo && bookletInfo && (
                <>
                  <PdfInfoCard pdfInfo={pdfInfo} onReset={handleReset} />
                  <BookletOptions
                    bookletInfo={bookletInfo}
                    onGenerate={handleGenerate}
                    isGenerating={false}
                  />
                </>
              )}

              {appStep === "generating" && pdfInfo && bookletInfo && (
                <>
                  <PdfInfoCard pdfInfo={pdfInfo} onReset={handleReset} />
                  <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-4 border-red-200 border-t-red-600 animate-spin flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-stone-800">Generating Booklet PDF</p>
                        <p className="text-sm text-stone-400">
                          Processing {bookletInfo.finalPages} pages into {bookletInfo.sheetCount} sheets…
                        </p>
                      </div>
                    </div>
                    <ProgressBar progress={progress} label="Progress" />
                  </div>
                </>
              )}

              {appStep === "done" && pdfInfo && bookletBytes && (
                <>
                  <PdfInfoCard pdfInfo={pdfInfo} onReset={handleReset} />
                  <DownloadCard
                    pdfInfo={pdfInfo}
                    bookletBytes={bookletBytes}
                    onReset={handleReset}
                  />
                </>
              )}

              {appStep === "error" && (
                <div className="bg-white border border-red-200 rounded-2xl p-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-700 mb-1">Something went wrong</p>
                      <p className="text-sm text-stone-500">{errorMessage}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <Features />

        <HowItWorks />
      </main>

      <footer className="border-t border-stone-200 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded-md flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="2" width="6" height="8" rx="1" fill="white" opacity="0.7" />
                <rect x="9" y="2" width="6" height="8" rx="1" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-stone-700">
              Impo<span className="text-red-600">sio</span>
            </span>
          </div>
          <p className="text-xs text-stone-400">
            All processing is client-side. No files are uploaded or stored.
          </p>
          <p className="text-xs text-stone-400">© {new Date().getFullYear()} Imposio</p>
        </div>
      </footer>
    </div>
  );
}
