import { BookletInfo, ImpositionSheet } from "@/types/pdf";

/**
 * Pads a page count up to the nearest multiple of 4.
 */
export function padToMultipleOf4(pageCount: number): number {
  const remainder = pageCount % 4;
  if (remainder === 0) return pageCount;
  return pageCount + (4 - remainder);
}

/**
 * Calculates the booklet imposition order.
 *
 * For a booklet with N pages (N must be divisible by 4), the algorithm works as follows:
 * - Each physical sheet contributes 4 logical pages (front-left, front-right, back-left, back-right).
 * - Sheet 1 Front: [N, 1]      → right side is page 1, left side is page N
 * - Sheet 1 Back:  [2, N-1]    → left side is page 2, right side is page N-1
 * - Sheet 2 Front: [N-2, 3]    → right side is page 3, left side is page N-2
 * - Sheet 2 Back:  [4, N-3]    → left side is page 4, right side is page N-3
 * ...and so on.
 *
 * In printing terms: When you duplex-print and fold, the pages read sequentially.
 */
export function calculateImpositionOrder(totalPages: number): ImpositionSheet[] {
  if (totalPages % 4 !== 0) {
    throw new Error("Total pages must be divisible by 4");
  }

  const sheets: ImpositionSheet[] = [];
  const sheetCount = totalPages / 4;

  let lo = 1; // lowest page number (starts at 1)
  let hi = totalPages; // highest page number

  for (let sheet = 1; sheet <= sheetCount; sheet++) {
    // Front of sheet: right page is lo, left page is hi
    const frontRight = lo;
    const frontLeft = hi;
    lo++;
    hi--;

    // Back of sheet: left page is lo, right page is hi
    const backLeft = lo;
    const backRight = hi;
    lo++;
    hi--;

    sheets.push({
      sheetNumber: sheet,
      front: { left: frontLeft, right: frontRight },
      back: { left: backLeft, right: backRight },
    });
  }

  return sheets;
}

/**
 * Computes full booklet information from an original page count.
 */
export function computeBookletInfo(originalPages: number): BookletInfo {
  const finalPages = padToMultipleOf4(originalPages);
  const addedBlankPages = finalPages - originalPages;
  const sheetCount = finalPages / 4;
  const impositionOrder = calculateImpositionOrder(finalPages);

  return {
    originalPages,
    addedBlankPages,
    finalPages,
    sheetCount,
    impositionOrder,
  };
}

/**
 * Generates a flat array of page indices for PDF generation.
 * Each element is either a 1-based page number (from the original PDF)
 * or 0 meaning a blank page.
 * Order: for each sheet, front-left, front-right, back-left, back-right.
 * This matches the PDF generation order needed by pdf-lib.
 */
export function generateImpositionSequence(
  impositionOrder: ImpositionSheet[]
): number[] {
  const sequence: number[] = [];
  for (const sheet of impositionOrder) {
    // Front: left then right
    sequence.push(sheet.front.left);
    sequence.push(sheet.front.right);
    // Back: left then right
    sequence.push(sheet.back.left);
    sequence.push(sheet.back.right);
  }
  return sequence;
}
