"use client";

import { BookOpen, FileStack, Plus, Layers } from "lucide-react";
import { BookletInfo, ImpositionSheet } from "@/types/pdf";

interface BookletOptionsProps {
  bookletInfo: BookletInfo;
  onGenerate: () => void;
  isGenerating: boolean;
}

function SheetRow({ sheet }: { sheet: ImpositionSheet }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="text-center font-medium text-stone-500 text-xs uppercase tracking-wide self-center">
        Sheet {sheet.sheetNumber}
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
          <span className="text-xs text-stone-400 w-8 flex-shrink-0">Front</span>
          <span className="font-mono text-xs text-stone-600">
            {sheet.front.left} | {sheet.front.right}
          </span>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5">
          <span className="text-xs text-stone-400 w-8 flex-shrink-0">Back</span>
          <span className="font-mono text-xs text-stone-600">
            {sheet.back.left} | {sheet.back.right}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BookletOptions({
  bookletInfo,
  onGenerate,
  isGenerating,
}: BookletOptionsProps) {
  const summaryStats = [
    {
      icon: BookOpen,
      label: "Original Pages",
      value: bookletInfo.originalPages,
      color: "text-stone-700",
      bg: "bg-stone-50",
      iconColor: "text-stone-500",
      iconBg: "bg-stone-100",
    },
    {
      icon: Plus,
      label: "Added Blank Pages",
      value: bookletInfo.addedBlankPages,
      color: bookletInfo.addedBlankPages > 0 ? "text-amber-700" : "text-stone-500",
      bg: bookletInfo.addedBlankPages > 0 ? "bg-amber-50" : "bg-stone-50",
      iconColor: bookletInfo.addedBlankPages > 0 ? "text-amber-500" : "text-stone-400",
      iconBg: bookletInfo.addedBlankPages > 0 ? "bg-amber-100" : "bg-stone-100",
    },
    {
      icon: FileStack,
      label: "Final Booklet Pages",
      value: bookletInfo.finalPages,
      color: "text-red-700",
      bg: "bg-red-50",
      iconColor: "text-red-500",
      iconBg: "bg-red-100",
    },
    {
      icon: Layers,
      label: "Total Sheets",
      value: bookletInfo.sheetCount,
      color: "text-stone-700",
      bg: "bg-stone-50",
      iconColor: "text-stone-500",
      iconBg: "bg-stone-100",
    },
  ];

  // Show at most 8 sheets in the preview to avoid overflow
  const previewSheets = bookletInfo.impositionOrder.slice(0, 8);
  const hasMore = bookletInfo.impositionOrder.length > 8;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-stone-100 bg-stone-50">
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
        <span className="text-sm font-semibold text-stone-600 uppercase tracking-wider">
          Booklet Layout
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {summaryStats.map(({ icon: Icon, label, value, color, bg, iconColor, iconBg }) => (
            <div key={label} className={`${bg} rounded-xl border border-stone-100 p-4 text-center`}>
              <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-4 h-4 ${iconColor}`} strokeWidth={1.75} />
              </div>
              <p className={`text-2xl font-bold ${color} mb-1`}>{value}</p>
              <p className="text-xs text-stone-400 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Imposition order preview */}
        <div>
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
            Imposition Order Preview
          </h3>
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-3 gap-3 px-4 py-2 bg-stone-800 text-white text-xs font-medium">
              <div className="text-center">Sheet</div>
              <div className="text-center">Front (Left | Right)</div>
              <div className="text-center">Back (Left | Right)</div>
            </div>
            {/* Rows */}
            <div className="divide-y divide-stone-100 px-4 py-2 space-y-2">
              {previewSheets.map((sheet) => (
                <div key={sheet.sheetNumber} className="pt-2 first:pt-0">
                  <SheetRow sheet={sheet} />
                </div>
              ))}
              {hasMore && (
                <div className="pt-2 text-center text-xs text-stone-400 py-2">
                  + {bookletInfo.impositionOrder.length - 8} more sheets...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info note */}
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
          <BookOpen className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
          <p className="text-xs text-red-700 leading-relaxed">
            Print duplex (both sides), then fold and bind the sheets in order.
            The result will be a correctly-sequenced booklet.
          </p>
        </div>

        {/* Generate button */}
        <button
          id="generate-booklet-btn"
          onClick={onGenerate}
          disabled={isGenerating}
          className="
            w-full py-4 px-6 bg-red-600 hover:bg-red-700 disabled:bg-stone-300
            text-white font-semibold rounded-xl transition-all duration-200
            disabled:cursor-not-allowed shadow-sm hover:shadow-md
            flex items-center justify-center gap-2 text-base
          "
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin w-5 h-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating Booklet PDF…
            </>
          ) : (
            <>
              <BookOpen className="w-5 h-5" strokeWidth={1.75} />
              Generate Booklet PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}
