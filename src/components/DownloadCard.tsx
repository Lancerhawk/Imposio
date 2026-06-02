"use client";

import { Download, CheckCircle, RefreshCw } from "lucide-react";
import { PdfInfo } from "@/types/pdf";
import { downloadPdf, getBookletFileName, formatFileSize } from "@/lib/pdf-utils";

interface DownloadCardProps {
  pdfInfo: PdfInfo;
  bookletBytes: Uint8Array;
  onReset: () => void;
}

export default function DownloadCard({ pdfInfo, bookletBytes, onReset }: DownloadCardProps) {
  const fileName = getBookletFileName(pdfInfo.fileName);

  const handleDownload = () => {
    downloadPdf(bookletBytes, fileName);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-red-100 shadow-sm overflow-hidden">
      {/* Success banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">Booklet Ready!</p>
            <p className="text-red-100 text-sm">Your print-ready booklet PDF has been generated</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* File details */}
        <div className="bg-stone-50 rounded-xl border border-stone-100 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500 font-medium">Output File</span>
            <span className="font-semibold text-stone-800 truncate ml-4 max-w-[200px]" title={fileName}>
              {fileName}
            </span>
          </div>
          <div className="w-full h-px bg-stone-200" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500 font-medium">Size</span>
            <span className="font-semibold text-stone-800">{formatFileSize(bookletBytes.length)}</span>
          </div>
          <div className="w-full h-px bg-stone-200" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500 font-medium">Format</span>
            <span className="font-semibold text-stone-800">PDF – Duplex Booklet</span>
          </div>
        </div>

        {/* Print instructions */}
        <div className="bg-stone-900 text-stone-100 rounded-xl p-4 text-sm space-y-2">
          <p className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Printing Instructions</p>
          {[
            "Open the PDF in your printer dialog",
            'Enable "Print on both sides" (duplex)',
            'Select "Flip on short edge" if prompted',
            "Print all pages",
            "Stack the sheets and fold in half",
            "Bind or staple along the fold",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                {i + 1}
              </span>
              <span className="text-stone-300 text-xs leading-relaxed">{step}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <button
          id="download-booklet-btn"
          onClick={handleDownload}
          className="
            w-full py-4 px-6 bg-red-600 hover:bg-red-700
            text-white font-bold rounded-xl transition-all duration-200
            shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-base
          "
        >
          <Download className="w-5 h-5" strokeWidth={2} />
          Download Booklet PDF
        </button>

        <button
          id="convert-another-btn"
          onClick={onReset}
          className="
            w-full py-3 px-6 bg-transparent hover:bg-stone-50
            text-stone-500 hover:text-stone-700 font-medium rounded-xl
            transition-all duration-200 border border-stone-200 hover:border-stone-300
            flex items-center justify-center gap-2 text-sm
          "
        >
          <RefreshCw className="w-4 h-4" />
          Convert Another PDF
        </button>
      </div>
    </div>
  );
}
