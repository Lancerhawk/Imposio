export interface PdfInfo {
  fileName: string;
  fileSize: number;
  pageCount: number;
  file: File;
}

export interface BookletInfo {
  originalPages: number;
  addedBlankPages: number;
  finalPages: number;
  sheetCount: number;
  impositionOrder: ImpositionSheet[];
}

export interface ImpositionSheet {
  sheetNumber: number;
  front: { left: number; right: number };
  back: { left: number; right: number };
}

export type ProcessingStep =
  | "idle"
  | "analyzing"
  | "calculating"
  | "generating"
  | "ready"
  | "error";

export interface ProcessingState {
  step: ProcessingStep;
  progress: number;
  error?: string;
}
