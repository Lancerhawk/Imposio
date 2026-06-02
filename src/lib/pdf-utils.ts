import { PDFDocument } from "pdf-lib";
import { PdfInfo } from "@/types/pdf";
import { computeBookletInfo, generateImpositionSequence } from "./booklet";

/**
 * Analyzes a PDF file and returns its metadata.
 */
export async function analyzePdf(file: File): Promise<PdfInfo> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: false,
  });

  return {
    fileName: file.name,
    fileSize: file.size,
    pageCount: pdfDoc.getPageCount(),
    file,
  };
}

/**
 * Generates a booklet PDF from the source file.
 * Returns a Uint8Array of the resulting PDF bytes.
 *
 * Algorithm:
 * 1. Load the source PDF.
 * 2. Calculate imposition order.
 * 3. Create a new PDF where each page is landscape (2× original width).
 * 4. For each slot in the imposition sequence, embed the original page (or blank).
 * 5. Pair slots into output sheets: 2 slots per output page.
 */
export async function generateBookletPdf(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer);
  const srcPages = srcPdf.getPages();
  const originalPageCount = srcPages.length;

  onProgress?.(10);

  const bookletInfo = computeBookletInfo(originalPageCount);
  const sequence = generateImpositionSequence(bookletInfo.impositionOrder);

  onProgress?.(20);

  // Use the dimensions of the first page as reference
  const refPage = srcPages[0];
  const { width: pageW, height: pageH } = refPage.getSize();

  // Output page is landscape: two source pages side-by-side
  const outW = pageW * 2;
  const outH = pageH;

  // Create output PDF
  const outPdf = await PDFDocument.create();

  const totalOutputPages = sequence.length / 2; // 2 slots per output page
  let processed = 0;

  for (let i = 0; i < sequence.length; i += 2) {
    const leftSlot = sequence[i]; // 1-based page number or 0 for blank
    const rightSlot = sequence[i + 1];

    const outPage = outPdf.addPage([outW, outH]);

    // Embed left page
    if (leftSlot > 0 && leftSlot <= originalPageCount) {
      const [embeddedLeft] = await outPdf.embedPages([srcPages[leftSlot - 1]]);
      const srcSize = srcPages[leftSlot - 1].getSize();
      // Scale to fit
      const scaleX = pageW / srcSize.width;
      const scaleY = pageH / srcSize.height;
      const scale = Math.min(scaleX, scaleY);
      const drawW = srcSize.width * scale;
      const drawH = srcSize.height * scale;
      const xOffset = (pageW - drawW) / 2;
      const yOffset = (outH - drawH) / 2;
      outPage.drawPage(embeddedLeft, {
        x: xOffset,
        y: yOffset,
        width: drawW,
        height: drawH,
      });
    }

    // Embed right page
    if (rightSlot > 0 && rightSlot <= originalPageCount) {
      const [embeddedRight] = await outPdf.embedPages([
        srcPages[rightSlot - 1],
      ]);
      const srcSize = srcPages[rightSlot - 1].getSize();
      const scaleX = pageW / srcSize.width;
      const scaleY = pageH / srcSize.height;
      const scale = Math.min(scaleX, scaleY);
      const drawW = srcSize.width * scale;
      const drawH = srcSize.height * scale;
      const xOffset = pageW + (pageW - drawW) / 2;
      const yOffset = (outH - drawH) / 2;
      outPage.drawPage(embeddedRight, {
        x: xOffset,
        y: yOffset,
        width: drawW,
        height: drawH,
      });
    }

    processed++;
    const progressPct = 20 + Math.round((processed / totalOutputPages) * 75);
    onProgress?.(progressPct);
  }

  onProgress?.(98);
  const bytes = await outPdf.save();
  onProgress?.(100);
  return bytes;
}

/**
 * Formats file size in human-readable form.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Returns output filename for the booklet PDF.
 */
export function getBookletFileName(originalName: string): string {
  const dotIndex = originalName.lastIndexOf(".");
  if (dotIndex === -1) return `${originalName}-Booklet.pdf`;
  return `${originalName.substring(0, dotIndex)}-Booklet.pdf`;
}

/**
 * Triggers a browser download of the given Uint8Array as a PDF.
 */
export function downloadPdf(bytes: Uint8Array, fileName: string): void {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
