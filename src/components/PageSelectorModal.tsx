"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Check } from "lucide-react";

interface PageSelectorModalProps {
  file: File;
  pageCount: number;
  onDone: (selectedPages: number[]) => void;
}

const THUMBNAIL_WIDTH = 180;
const RENDER_BATCH = 6;

export default function PageSelectorModal({
  file,
  pageCount,
  onDone,
}: PageSelectorModalProps) {
  const [selected, setSelected] = useState<Set<number>>(() => {
    const s = new Set<number>();
    for (let i = 1; i <= pageCount; i++) s.add(i);
    return s;
  });
  const [thumbnails, setThumbnails] = useState<Map<number, string>>(new Map());
  const [rendering, setRendering] = useState(true);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const cancelRef = useRef(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    cancelRef.current = false;
    let doc: import("pdfjs-dist").PDFDocumentProxy | null = null;
    let loadingTask: import("pdfjs-dist").PDFDocumentLoadingTask | null = null;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");

        if (!pdfjs.GlobalWorkerOptions.workerSrc) {
          pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        }

        const _warn = console.warn;
        console.warn = (...args: unknown[]) => {
          if (typeof args[0] === "string" && args[0].includes("Dependent image")) return;
          _warn.apply(console, args);
        };

        const buf = await file.arrayBuffer();
        loadingTask = pdfjs.getDocument({ data: buf });
        doc = await loadingTask.promise;
        const total = doc.numPages;

        for (let start = 1; start <= total; start += RENDER_BATCH) {
          if (cancelRef.current) return;
          const end = Math.min(start + RENDER_BATCH - 1, total);

          await Promise.all(
            Array.from({ length: end - start + 1 }, (_, k) => start + k).map(
              async (num) => {
                if (cancelRef.current || !doc) return;
                const page = await doc.getPage(num);
                const vp0 = page.getViewport({ scale: 1 });
                const scale = THUMBNAIL_WIDTH / vp0.width;
                const vp = page.getViewport({ scale });

                const cvs = document.createElement("canvas");
                cvs.width = Math.floor(vp.width);
                cvs.height = Math.floor(vp.height);

                await page.render({
                  canvasContext: cvs.getContext("2d")!,
                  canvas: cvs,
                  viewport: vp,
                }).promise;

                if (cancelRef.current) return;

                setThumbnails((m) => new Map(m).set(num, cvs.toDataURL("image/jpeg", 0.7)));
              }
            )
          );

          setProgress(Math.round((end / total) * 100));
        }

        setRendering(false);
        console.warn = _warn;
      } catch (err) {
        console.error("Thumbnail render failed:", err);
        setRendering(false);
      }
    })();

    return () => {
      cancelRef.current = true;
      if (loadingTask) {
        loadingTask.destroy();
      }
    };
  }, [file]);

  const animateOut = useCallback(
    (pages: number[]) => {
      setVisible(false);
      setTimeout(() => onDone(pages), 220);
    },
    [onDone]
  );

  const allPages = useCallback(
    () => Array.from({ length: pageCount }, (_, i) => i + 1),
    [pageCount]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") animateOut(allPages());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [animateOut, allPages]);

  const toggle = useCallback((p: number) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(p)) {
        n.delete(p);
      } else {
        n.add(p);
      }
      return n;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(allPages()));
  }, [allPages]);

  const deselectAll = useCallback(() => setSelected(new Set()), []);

  const handleDone = useCallback(() => {
    animateOut(Array.from(selected).sort((a, b) => a - b));
  }, [selected, animateOut]);

  const backdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) animateOut(allPages());
    },
    [animateOut, allPages]
  );

  const count = selected.size;
  const pages = allPages();

  return (
    <div
      className={`pageselector-backdrop ${visible ? "pageselector-backdrop--visible" : ""}`}
      onClick={backdropClick}
    >
      <div className={`pageselector-modal ${visible ? "pageselector-modal--visible" : ""}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Select Pages</h3>
            <p className="text-sm text-stone-400 mt-0.5">
              <span className="font-semibold text-red-600">{count}</span>{" "}
              of {pageCount} pages selected
            </p>
          </div>
          <button
            onClick={() => animateOut(allPages())}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-red-100 flex items-center justify-center transition-colors group"
            aria-label="Close"
            id="page-selector-close-btn"
          >
            <X className="w-4.5 h-4.5 text-stone-400 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {rendering && (
          <div className="h-1 bg-stone-100 flex-shrink-0">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 pageselector-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((num) => {
              const thumb = thumbnails.get(num);
              const isSel = selected.has(num);

              return (
                <button
                  key={num}
                  onClick={() => toggle(num)}
                  id={`page-thumb-${num}`}
                  className={`
                    pageselector-card group relative rounded-xl overflow-hidden border-2
                    transition-all duration-200 text-left outline-none
                    focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
                    ${isSel
                      ? "border-red-500 shadow-md shadow-red-100"
                      : "border-stone-200 hover:border-stone-300"
                    }
                  `}
                >
                  <div className="relative bg-stone-100 aspect-[3/4] flex items-center justify-center overflow-hidden">
                    {thumb ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={thumb}
                        alt={`Page ${num}`}
                        className={`w-full h-full object-contain transition-all duration-200 ${
                          isSel ? "" : "opacity-35 grayscale"
                        }`}
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full animate-pulse bg-gradient-to-b from-stone-100 to-stone-200 flex items-center justify-center">
                        <div className="w-8 h-10 rounded bg-stone-300/50" />
                      </div>
                    )}

                    {!isSel && thumb && (
                      <div className="absolute inset-0 bg-white/40 pointer-events-none" />
                    )}

                    <div
                      className={`
                        absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center
                        transition-all duration-200 shadow-sm
                        ${isSel
                          ? "bg-red-600 scale-100"
                          : "bg-white/90 border-2 border-stone-300 scale-90 group-hover:scale-100 group-hover:border-red-300"
                        }
                      `}
                    >
                      {isSel && (
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      )}
                    </div>
                  </div>

                  <div
                    className={`
                      px-3 py-2 text-center text-xs font-semibold transition-colors duration-200
                      ${isSel ? "text-stone-700 bg-white" : "text-stone-400 bg-stone-50"}
                    `}
                  >
                    Page {num}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200 bg-white flex-shrink-0 gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              disabled={count === pageCount}
              id="page-selector-select-all"
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-200 text-stone-600
                         hover:bg-stone-50 hover:border-stone-300 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              disabled={count === 0}
              id="page-selector-deselect-all"
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-stone-200 text-stone-600
                         hover:bg-stone-50 hover:border-stone-300 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Deselect All
            </button>
          </div>

          <button
            onClick={handleDone}
            disabled={count === 0}
            id="page-selector-done-btn"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-stone-300
                       text-white text-sm font-semibold rounded-xl transition-all duration-200
                       shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:shadow-none
                       flex items-center gap-2"
          >
            <Check className="w-4 h-4" strokeWidth={2.5} />
            Done · {count} page{count !== 1 ? "s" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
