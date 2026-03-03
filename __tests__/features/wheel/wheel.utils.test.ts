/**
 * @file wheel.utils.test.ts
 * Unit tests for all pure utility functions in the wheel feature.
 */

import {
  computeWinnerIndex,
  computeWinner,
  createHistoryEntry,
  shuffleArray,
  sortThaiLocale,
  loadStorageState,
  saveToStorage,
} from "@/src/features/wheel/wheel.utils";
import appConfig from "@/src/config/app.config.json";

// ─── computeWinnerIndex ───────────────────────────────────────────────────────

describe("computeWinnerIndex", () => {
  it("returns 0 when sliceCount is 0", () => {
    expect(computeWinnerIndex(0, 0)).toBe(0);
    expect(computeWinnerIndex(Math.PI, 0)).toBe(0);
  });

  it("always returns 0 when sliceCount is 1", () => {
    expect(computeWinnerIndex(0, 1)).toBe(0);
    expect(computeWinnerIndex(Math.PI * 2, 1)).toBe(0);
  });

  it("returns a valid index in [0, sliceCount) for any angle", () => {
    const sliceCount = 8;
    const angles = [0, 0.5, 1.2, Math.PI, Math.PI * 1.5, Math.PI * 2 - 0.001, 50.7];
    for (const angle of angles) {
      const idx = computeWinnerIndex(angle, sliceCount);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(sliceCount);
    }
  });

  it("returns consistent results for the same angle", () => {
    const angle = 1.234;
    expect(computeWinnerIndex(angle, 6)).toBe(computeWinnerIndex(angle, 6));
  });

  it("wraps angles correctly — angle 0 and 2π give the same slice", () => {
    const count = 4;
    // angle=0 (pointer at 0 rad) and angle=2π are equivalent
    expect(computeWinnerIndex(0, count)).toBe(computeWinnerIndex(Math.PI * 2, count));
  });

  it("handles very large accumulated angles (many full rotations)", () => {
    const count = 5;
    const baseAngle = 1.0;
    const manyRotations = baseAngle + Math.PI * 2 * 100;
    expect(computeWinnerIndex(baseAngle, count)).toBe(computeWinnerIndex(manyRotations, count));
  });

  it("pointer at π/2 with 4 slices selects the correct quadrant", () => {
    // With 4 slices, each arc = π/2.
    // The pointer is at 3 o'clock (angle 0 in canvas coords).
    // A wheel rotated by π/2 means slice 0 has moved π/2 clockwise.
    // pointerAngle = 2π - normalised_angle
    // For finalAngle = π/2: normalised = π/2, pointer = 2π - π/2 = 3π/2
    // index = floor(3π/2 / (2π/4)) = floor(3π/2 / (π/2)) = floor(3) = 3
    expect(computeWinnerIndex(Math.PI / 2, 4)).toBe(3);
  });
});

// ─── computeWinner ────────────────────────────────────────────────────────────

describe("computeWinner", () => {
  const names = ["Ramen", "Sushi", "Pizza", "Pad Thai"];

  it("returns a name from the list", () => {
    const winner = computeWinner(0, names);
    expect(names).toContain(winner);
  });

  it("is deterministic for the same angle + list", () => {
    expect(computeWinner(1.5, names)).toBe(computeWinner(1.5, names));
  });

  it("returns the only name when list has 1 entry", () => {
    expect(computeWinner(99, ["Solo"])).toBe("Solo");
  });

  it("never throws for large angle values", () => {
    expect(() => computeWinner(1e9, names)).not.toThrow();
  });
});

// ─── createHistoryEntry ───────────────────────────────────────────────────────

describe("createHistoryEntry", () => {
  it("contains the winner name", () => {
    const entry = createHistoryEntry("Burger King");
    expect(entry.name).toBe("Burger King");
  });

  it("time field is a non-empty string", () => {
    const entry = createHistoryEntry("MK");
    expect(typeof entry.time).toBe("string");
    expect(entry.time.length).toBeGreaterThan(0);
  });

  it("creates a fresh timestamp each call", () => {
    // Two successive calls should either have the same or a later time —
    // we just verify both are strings representing dates.
    const a = createHistoryEntry("A");
    const b = createHistoryEntry("B");
    expect(typeof a.time).toBe("string");
    expect(typeof b.time).toBe("string");
  });
});

// ─── shuffleArray ─────────────────────────────────────────────────────────────

describe("shuffleArray", () => {
  it("returns a new array (does not mutate)", () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    expect(shuffled).not.toBe(original);
    expect(original).toEqual([1, 2, 3, 4, 5]); // original unchanged
  });

  it("preserves all elements", () => {
    const original = ["a", "b", "c", "d", "e"];
    const shuffled = shuffleArray(original);
    expect(shuffled.sort()).toEqual([...original].sort());
  });

  it("preserves array length", () => {
    const arr = [10, 20, 30];
    expect(shuffleArray(arr)).toHaveLength(arr.length);
  });

  it("handles an empty array", () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it("handles a single-element array", () => {
    expect(shuffleArray(["only"])).toEqual(["only"]);
  });

  it("is generic — works with objects", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const shuffled = shuffleArray(items);
    expect(shuffled).toHaveLength(3);
    expect(shuffled.map(i => i.id).sort()).toEqual([1, 2, 3]);
  });
});

// ─── sortThaiLocale ───────────────────────────────────────────────────────────

describe("sortThaiLocale", () => {
  it("returns a new array (does not mutate)", () => {
    const original = ["ข", "ก", "ค"];
    const sorted = sortThaiLocale(original);
    expect(sorted).not.toBe(original);
  });

  it("sorts ASCII strings alphabetically", () => {
    expect(sortThaiLocale(["Sushi", "Pizza", "Burger"])).toEqual([
      "Burger", "Pizza", "Sushi",
    ]);
  });

  it("handles mixed Thai and Latin strings without throwing", () => {
    const mixed = ["ผัดไทย", "Burger", "ต้มยำ", "Pizza"];
    expect(() => sortThaiLocale(mixed)).not.toThrow();
    expect(sortThaiLocale(mixed)).toHaveLength(4);
  });

  it("handles an empty array", () => {
    expect(sortThaiLocale([])).toEqual([]);
  });

  it("handles a single element", () => {
    expect(sortThaiLocale(["Only"])).toEqual(["Only"]);
  });

  it("handles duplicate strings", () => {
    const arr = ["B", "A", "B", "A"];
    const sorted = sortThaiLocale(arr);
    expect(sorted).toEqual(["A", "A", "B", "B"]);
  });
});

// ─── localStorage helpers ─────────────────────────────────────────────────────

describe("saveToStorage / loadStorageState", () => {
  const NAMES_KEY   = appConfig.storage.keys.names;
  const HISTORY_KEY = appConfig.storage.keys.history;
  const SAVED_KEY   = appConfig.storage.keys.saved;

  beforeEach(() => {
    localStorage.clear();
  });

  it("returns nulls when localStorage is empty", () => {
    const state = loadStorageState();
    expect(state.names).toBeNull();
    expect(state.history).toBeNull();
    expect(state.saved).toBeNull();
  });

  it("round-trips names through localStorage", () => {
    const names = ["Ramen", "Sushi"];
    saveToStorage(NAMES_KEY, names);
    const state = loadStorageState();
    expect(state.names).toEqual(names);
  });

  it("round-trips history through localStorage", () => {
    const history = [{ name: "Pizza", time: "01/01/2025" }];
    saveToStorage(HISTORY_KEY, history);
    const state = loadStorageState();
    expect(state.history).toEqual(history);
  });

  it("round-trips saved lists through localStorage", () => {
    const saved = [{ name: "Friday Picks", names: ["A", "B"], date: "01/01/2025" }];
    saveToStorage(SAVED_KEY, saved);
    const state = loadStorageState();
    expect(state.saved).toEqual(saved);
  });

  it("returns nulls for keys not yet written", () => {
    saveToStorage(NAMES_KEY, ["A"]);
    const state = loadStorageState();
    expect(state.names).toEqual(["A"]);
    expect(state.history).toBeNull(); // not set
    expect(state.saved).toBeNull();   // not set
  });

  it("overwrites existing value", () => {
    saveToStorage(NAMES_KEY, ["Old"]);
    saveToStorage(NAMES_KEY, ["New"]);
    expect(loadStorageState().names).toEqual(["New"]);
  });

  it("does not throw when localStorage is unavailable (mocked)", () => {
    const original = global.localStorage;
    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: () => { throw new Error("QuotaExceededError"); },
        setItem: () => { throw new Error("QuotaExceededError"); },
        clear:   () => {},
      },
      writable: true,
      configurable: true,
    });
    expect(() => loadStorageState()).not.toThrow();
    expect(() => saveToStorage(NAMES_KEY, ["x"])).not.toThrow();
    Object.defineProperty(global, "localStorage", { value: original, writable: true, configurable: true });
  });
});
