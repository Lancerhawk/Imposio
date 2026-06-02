"use client";

import { FileText, Hash, HardDrive, RotateCcw } from "lucide-react";
import { PdfInfo } from "@/types/pdf";
import { formatFileSize } from "@/lib/pdf-utils";

interface PdfInfoCardProps {
  pdfInfo: PdfInfo;
  onReset: () => void;
}

export default function PdfInfoCard({ pdfInfo, onReset }: PdfInfoCardProps) {
  const stats = [
    {
      icon: FileText,
      label: "File Name",
      value: pdfInfo.fileName,
      truncate: true,
    },
    {
      icon: Hash,
      label: "Pages",
      value: pdfInfo.pageCount.toString(),
      truncate: false,
    },
    {
      icon: HardDrive,
      label: "File Size",
      value: formatFileSize(pdfInfo.fileSize),
      truncate: false,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
            PDF Analysis
          </span>
        </div>
        <button
          onClick={onReset}
          id="reset-pdf-btn"
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-red-500 transition-colors duration-200 hover:bg-red-50 px-3 py-1.5 rounded-lg"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Upload Different PDF
        </button>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, truncate }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl border border-stone-100"
          >
            <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-4.5 h-4.5 text-red-600" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-stone-400 font-medium uppercase tracking-wider mb-1">
                {label}
              </p>
              <p
                className={`text-sm font-semibold text-stone-800 ${
                  truncate ? "truncate" : ""
                }`}
                title={truncate ? value : undefined}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
