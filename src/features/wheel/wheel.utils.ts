import type { HistoryEntry } from "@/src/types";
import appConfig from "@/src/config/app.config.json";

/**
 * Determines the winning slice index from a final resting angle.
 * The pointer is fixed at the 3 o'clock position (angle = 0 in canvas coords).
 */
export function computeWinnerIndex(finalAngle: number, sliceCount: number): number {
  if (sliceCount === 0) return 0;
  const arc          = (Math.PI * 2) / sliceCount;
  const normalized   = ((finalAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const pointerAngle = (Math.PI * 2 - normalized) % (Math.PI * 2);
  return Math.floor(pointerAngle / arc) % sliceCount;
}

/**
 * Computes the winner name given a final angle and the current name list.
 */
export function computeWinner(finalAngle: number, names: string[]): string {
  return names[computeWinnerIndex(finalAngle, names.length)];
}

/**
 * Creates a history entry for the given winner name.
 */
export function createHistoryEntry(winnerName: string): HistoryEntry {
  return { name: winnerName, time: new Date().toLocaleString() };
}

/**
 * Fisher-Yates shuffle — returns a new array.
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Sorts an array of strings with Thai locale awareness.
 */
export function sortThaiLocale(arr: string[]): string[] {
  return [...arr].sort((a, b) => a.localeCompare(b, "th"));
}

/**
 * Reads all persisted wheel state from localStorage.
 * Returns null values if not found (caller provides defaults).
 */
export function loadStorageState(): {
  names: string[] | null;
  history: HistoryEntry[] | null;
  saved: Array<{ name: string; names: string[]; date: string }> | null;
} {
  const { keys } = appConfig.storage;
  try {
    return {
      names:   JSON.parse(localStorage.getItem(keys.names)   ?? "null"),
      history: JSON.parse(localStorage.getItem(keys.history) ?? "null"),
      saved:   JSON.parse(localStorage.getItem(keys.saved)   ?? "null"),
    };
  } catch {
    return { names: null, history: null, saved: null };
  }
}

/** Persists a value to localStorage. */
export function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore — quota exceeded or private browsing
  }
}
