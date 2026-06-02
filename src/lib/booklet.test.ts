import { describe, it, expect } from "vitest";
import {
  padToMultipleOf4,
  calculateImpositionOrder,
  computeBookletInfo,
  generateImpositionSequence,
} from "./booklet";

describe("Booklet Imposition Utilities", () => {
  describe("padToMultipleOf4", () => {
    it("should return the same count if already a multiple of 4", () => {
      expect(padToMultipleOf4(0)).toBe(0);
      expect(padToMultipleOf4(4)).toBe(4);
      expect(padToMultipleOf4(8)).toBe(8);
      expect(padToMultipleOf4(12)).toBe(12);
    });

    it("should round up to the nearest multiple of 4 if not already a multiple", () => {
      expect(padToMultipleOf4(1)).toBe(4);
      expect(padToMultipleOf4(2)).toBe(4);
      expect(padToMultipleOf4(3)).toBe(4);
      expect(padToMultipleOf4(5)).toBe(8);
      expect(padToMultipleOf4(6)).toBe(8);
      expect(padToMultipleOf4(7)).toBe(8);
    });
  });

  describe("calculateImpositionOrder", () => {
    it("should throw an error if the page count is not divisible by 4", () => {
      expect(() => calculateImpositionOrder(3)).toThrow();
      expect(() => calculateImpositionOrder(5)).toThrow();
    });

    it("should correctly impose a 4-page booklet", () => {
      const sheets = calculateImpositionOrder(4);
      expect(sheets).toHaveLength(1);
      expect(sheets[0]).toEqual({
        sheetNumber: 1,
        front: { left: 4, right: 1 },
        back: { left: 2, right: 3 },
      });
    });

    it("should correctly impose an 8-page booklet", () => {
      const sheets = calculateImpositionOrder(8);
      expect(sheets).toHaveLength(2);
      expect(sheets[0]).toEqual({
        sheetNumber: 1,
        front: { left: 8, right: 1 },
        back: { left: 2, right: 7 },
      });
      expect(sheets[1]).toEqual({
        sheetNumber: 2,
        front: { left: 6, right: 3 },
        back: { left: 4, right: 5 },
      });
    });
  });

  describe("computeBookletInfo", () => {
    it("should compute booklet stats correctly for clean page counts", () => {
      const info = computeBookletInfo(8);
      expect(info.originalPages).toBe(8);
      expect(info.addedBlankPages).toBe(0);
      expect(info.finalPages).toBe(8);
      expect(info.sheetCount).toBe(2);
      expect(info.impositionOrder).toHaveLength(2);
    });

    it("should compute booklet stats correctly for page counts needing blank pages", () => {
      const info = computeBookletInfo(5);
      expect(info.originalPages).toBe(5);
      expect(info.addedBlankPages).toBe(3);
      expect(info.finalPages).toBe(8);
      expect(info.sheetCount).toBe(2);
      expect(info.impositionOrder).toHaveLength(2);
    });
  });

  describe("generateImpositionSequence", () => {
    it("should flatten sheet layouts into a linear page slot sequence", () => {
      const sheets = calculateImpositionOrder(4);
      const seq = generateImpositionSequence(sheets);
      expect(seq).toEqual([4, 1, 2, 3]);
    });

    it("should flatten multi-sheet layouts correctly", () => {
      const sheets = calculateImpositionOrder(8);
      const seq = generateImpositionSequence(sheets);
      expect(seq).toEqual([8, 1, 2, 7, 6, 3, 4, 5]);
    });
  });
});
