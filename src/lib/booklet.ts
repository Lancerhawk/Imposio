import { BookletInfo, ImpositionSheet } from "@/types/pdf";

export function padToMultipleOf4(pageCount: number): number {
  const remainder = pageCount % 4;
  if (remainder === 0) return pageCount;
  return pageCount + (4 - remainder);
}

export function calculateImpositionOrder(totalPages: number): ImpositionSheet[] {
  if (totalPages % 4 !== 0) {
    throw new Error("Total pages must be divisible by 4");
  }

  const sheets: ImpositionSheet[] = [];
  const sheetCount = totalPages / 4;

  let lo = 1;
  let hi = totalPages;

  for (let sheet = 1; sheet <= sheetCount; sheet++) {
    const frontRight = lo;
    const frontLeft = hi;
    lo++;
    hi--;

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

export function generateImpositionSequence(
  impositionOrder: ImpositionSheet[]
): number[] {
  const sequence: number[] = [];
  for (const sheet of impositionOrder) {
    sequence.push(sheet.front.left);
    sequence.push(sheet.front.right);
    sequence.push(sheet.back.left);
    sequence.push(sheet.back.right);
  }
  return sequence;
}
