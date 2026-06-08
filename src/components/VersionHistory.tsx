"use client";

import { useState } from "react";
import { History, X } from "lucide-react";
import versionsData from "@/data/versions.json";

export default function VersionHistory() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-stone-800 transition-all hover:-translate-y-0.5 active:translate-y-0 border border-stone-800"
        aria-label="View Version History"
      >
        <History className="w-4 h-4" />
        <span className="text-sm font-medium">v{versionsData[0].version}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
                  <History className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Version History</h2>
                  <p className="text-sm text-stone-500">Changelog and release notes</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-10 pageselector-scrollbar">
              {versionsData.map((release, idx) => (
                <div key={release.version} className="relative">
                  {idx !== versionsData.length - 1 && (
                    <div className="absolute left-[11px] top-8 bottom-[-40px] w-0.5 bg-stone-100" />
                  )}

                  <div className="flex items-start gap-4">
                    <div className="relative z-10 flex flex-col items-center mt-1.5">
                      <div className="w-[24px] h-[24px] rounded-full bg-white border-4 border-red-100 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-600" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-4">
                        <h3 className="text-xl font-bold text-stone-900">
                          v{release.version}
                        </h3>
                        <span className="text-sm font-medium text-stone-500">
                          {release.date}
                        </span>
                      </div>

                      <div className="space-y-6">
                        {release.changes.map((changeGroup, i) => (
                          <div key={i}>
                            <h4
                              className={`text-xs font-bold uppercase tracking-wider mb-2 ${changeGroup.type === "Added"
                                  ? "text-emerald-600"
                                  : changeGroup.type === "Changed"
                                    ? "text-blue-600"
                                    : changeGroup.type === "Fixed"
                                      ? "text-amber-600"
                                      : "text-stone-500"
                                }`}
                            >
                              {changeGroup.type}
                            </h4>
                            <ul className="space-y-2">
                              {changeGroup.items.map((item, j) => (
                                <li
                                  key={j}
                                  className="text-sm text-stone-600 leading-relaxed flex items-start gap-2"
                                >
                                  <span className="text-stone-300 mt-1.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
