import { PDFDocument } from "pdf-lib";
import { PdfInfo } from "@/types/pdf";
import { computeBookletInfo, generateImpositionSequence } from "./booklet";

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

const GUTTER_PT = 28;

export async function generateBookletPdf(
  file: File,
  onProgress?: (progress: number) => void,
  selectedPages?: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const fullPdf = await PDFDocument.load(arrayBuffer);

  let srcPdf = fullPdf;
  if (selectedPages && selectedPages.length < fullPdf.getPageCount()) {
    srcPdf = await PDFDocument.create();
    const copied = await srcPdf.copyPages(
      fullPdf,
      selectedPages.map((p) => p - 1)
    );
    for (const page of copied) {
      srcPdf.addPage(page);
    }
  }

  const srcPages = srcPdf.getPages();
  const originalPageCount = srcPages.length;

  onProgress?.(10);

  const bookletInfo = computeBookletInfo(originalPageCount);
  const sequence = generateImpositionSequence(bookletInfo.impositionOrder);

  onProgress?.(20);

  const refPage = srcPages[0];
  const { width: pageW, height: pageH } = refPage.getSize();

  const outW = pageW * 2 + GUTTER_PT * 2;
  const outH = pageH;

  const halfZoneW = pageW;
  const contentW = pageW - GUTTER_PT;

  const outPdf = await PDFDocument.create();

  const totalOutputPages = sequence.length / 2;
  let processed = 0;

  for (let i = 0; i < sequence.length; i += 2) {
    const leftSlot = sequence[i];
    const rightSlot = sequence[i + 1];

    const outPage = outPdf.addPage([outW, outH]);

    if (leftSlot > 0 && leftSlot <= originalPageCount) {
      const [embeddedLeft] = await outPdf.embedPages([srcPages[leftSlot - 1]]);
      const srcSize = srcPages[leftSlot - 1].getSize();
      const scaleX = contentW / srcSize.width;
      const scaleY = outH / srcSize.height;
      const scale = Math.min(scaleX, scaleY);
      const drawW = srcSize.width * scale;
      const drawH = srcSize.height * scale;
      const xOffset = (contentW - drawW) / 2;
      const yOffset = (outH - drawH) / 2;
      outPage.drawPage(embeddedLeft, {
        x: xOffset,
        y: yOffset,
        width: drawW,
        height: drawH,
      });
    }

    if (rightSlot > 0 && rightSlot <= originalPageCount) {
      const [embeddedRight] = await outPdf.embedPages([
        srcPages[rightSlot - 1],
      ]);
      const srcSize = srcPages[rightSlot - 1].getSize();
      const scaleX = contentW / srcSize.width;
      const scaleY = outH / srcSize.height;
      const scale = Math.min(scaleX, scaleY);
      const drawW = srcSize.width * scale;
      const drawH = srcSize.height * scale;
      const rightZoneStart = halfZoneW + GUTTER_PT * 2;
      const xOffset = rightZoneStart + (contentW - drawW) / 2;
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

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getBookletFileName(originalName: string): string {
  const dotIndex = originalName.lastIndexOf(".");
  if (dotIndex === -1) return `${originalName}-Booklet.pdf`;
  return `${originalName.substring(0, dotIndex)}-Booklet.pdf`;
}

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
