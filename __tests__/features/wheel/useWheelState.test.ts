/**
 * @file useWheelState.test.ts
 * Unit tests for the useWheelState hook.
 *
 * Covers: initial state, localStorage hydration, persistence, spin/spinEnd,
 * winner lifecycle, save/remove, shuffle/sort, and tab navigation.
 */

import { renderHook, act } from "@testing-library/react";
import { useWheelState } from "@/src/features/wheel/useWheelState";

// ─── localStorage mock ────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

// ─── helpers ──────────────────────────────────────────────────────────────────

function renderAndMount() {
  const hook = renderHook(() => useWheelState());
  // Flush the hydration useEffect
  act(() => { jest.runAllTimers(); });
  return hook;
}

// ─── initial / hydration state ────────────────────────────────────────────────

describe("useWheelState — initial state", () => {
  it("becomes mounted after hydration effect", () => {
    const hook = renderAndMount();
    expect(hook.result.current.mounted).toBe(true);
  });

  it("loads default restaurants when localStorage is empty", () => {
    const hook = renderAndMount();
    expect(hook.result.current.names.length).toBeGreaterThan(0);
  });

  it("loads names from localStorage if present", () => {
    localStorage.setItem("spineat-names", JSON.stringify(["Ramen", "Sushi"]));
    const hook = renderAndMount();
    expect(hook.result.current.names).toEqual(["Ramen", "Sushi"]);
  });

  it("loads history from localStorage", () => {
    const history = [{ name: "Burger", time: "12:00" }];
    localStorage.setItem("spineat-history", JSON.stringify(history));
    const hook = renderAndMount();
    expect(hook.result.current.history).toEqual(history);
  });

  it("loads saved lists from localStorage", () => {
    const saved = [{ name: "Faves", names: ["A"], date: "01/01/2025" }];
    localStorage.setItem("spineat-saved", JSON.stringify(saved));
    const hook = renderAndMount();
    expect(hook.result.current.savedLists).toEqual(saved);
  });

  it("starts with no winner", () => {
    const hook = renderAndMount();
    expect(hook.result.current.winner).toBeNull();
    expect(hook.result.current.showWinner).toBe(false);
  });

  it("starts not spinning", () => {
    const hook = renderAndMount();
    expect(hook.result.current.isSpinning).toBe(false);
  });

  it("starts with activeTab = 'my-list'", () => {
    const hook = renderAndMount();
    expect(hook.result.current.activeTab).toBe("my-list");
  });
});

// ─── handleSpin ───────────────────────────────────────────────────────────────

describe("handleSpin", () => {
  it("sets isSpinning to true when names.length >= 2", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B"]); });
    act(() => { hook.result.current.handleSpin(); });
    expect(hook.result.current.isSpinning).toBe(true);
  });

  it("does not spin when names.length < 2", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["Only One"]); });
    act(() => { hook.result.current.handleSpin(); });
    expect(hook.result.current.isSpinning).toBe(false);
  });

  it("does not spin when names is empty", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => []); });
    act(() => { hook.result.current.handleSpin(); });
    expect(hook.result.current.isSpinning).toBe(false);
  });

  it("does not spin when already spinning", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B"]); });
    act(() => { hook.result.current.handleSpin(); });
    // Call again while spinning — should remain true but not error
    act(() => { hook.result.current.handleSpin(); });
    expect(hook.result.current.isSpinning).toBe(true);
  });
});

// ─── handleSpinEnd ────────────────────────────────────────────────────────────

describe("handleSpinEnd", () => {
  it("sets a winner from the names list", () => {
    const names = ["Ramen", "Sushi", "Pizza", "Burger"];
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => names); });
    act(() => { hook.result.current.handleSpinEnd(0); });
    expect(names).toContain(hook.result.current.winner);
  });

  it("sets showWinner to true", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B"]); });
    act(() => { hook.result.current.handleSpinEnd(0); });
    expect(hook.result.current.showWinner).toBe(true);
  });

  it("sets showConfetti to true", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B"]); });
    act(() => { hook.result.current.handleSpinEnd(0); });
    expect(hook.result.current.showConfetti).toBe(true);
  });

  it("stops spinning (isSpinning = false)", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B"]); });
    act(() => { hook.result.current.handleSpin(); });
    act(() => { hook.result.current.handleSpinEnd(0); });
    expect(hook.result.current.isSpinning).toBe(false);
  });

  it("appends a history entry with the winner name", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["Ramen", "Sushi"]); });
    act(() => { hook.result.current.handleSpinEnd(0); });
    expect(hook.result.current.history.length).toBeGreaterThan(0);
    const winnerName = hook.result.current.winner;
    expect(hook.result.current.history[0].name).toBe(winnerName);
  });

  it("does nothing when names list is empty", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => []); });
    act(() => { hook.result.current.handleSpinEnd(0); });
    expect(hook.result.current.winner).toBeNull();
  });

  it("clears confetti after timeout", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B"]); });
    act(() => { hook.result.current.handleSpinEnd(0); });
    expect(hook.result.current.showConfetti).toBe(true);
    act(() => { jest.advanceTimersByTime(5000); });
    expect(hook.result.current.showConfetti).toBe(false);
  });
});

// ─── closeWinner / removeWinner ───────────────────────────────────────────────

describe("closeWinner", () => {
  it("clears winner and hides modal", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B"]); });
    act(() => { hook.result.current.handleSpinEnd(0); });
    act(() => { hook.result.current.closeWinner(); });
    expect(hook.result.current.winner).toBeNull();
    expect(hook.result.current.showWinner).toBe(false);
  });
});

describe("removeWinner", () => {
  it("removes the winner from the names list", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B", "C"]); });
    act(() => { hook.result.current.handleSpinEnd(0); });
    const winner = hook.result.current.winner!;
    act(() => { hook.result.current.removeWinner(); });
    expect(hook.result.current.names).not.toContain(winner);
  });

  it("closes the modal after removal", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B"]); });
    act(() => { hook.result.current.handleSpinEnd(0); });
    act(() => { hook.result.current.removeWinner(); });
    expect(hook.result.current.showWinner).toBe(false);
    expect(hook.result.current.winner).toBeNull();
  });
});

// ─── handleSaveConfirmed ──────────────────────────────────────────────────────

describe("handleSaveConfirmed", () => {
  it("adds a new saved list", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["Sushi", "Ramen"]); });
    act(() => { hook.result.current.handleSaveConfirmed("My Picks"); });
    const saved = hook.result.current.savedLists;
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe("My Picks");
    expect(saved[0].names).toEqual(["Sushi", "Ramen"]);
  });

  it("does nothing when names is empty", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => []); });
    act(() => { hook.result.current.handleSaveConfirmed("Empty"); });
    expect(hook.result.current.savedLists).toHaveLength(0);
  });

  it("does nothing when listName is empty string", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A"]); });
    act(() => { hook.result.current.handleSaveConfirmed(""); });
    expect(hook.result.current.savedLists).toHaveLength(0);
  });

  it("accumulates multiple saved lists", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B"]); });
    act(() => { hook.result.current.handleSaveConfirmed("List 1"); });
    act(() => { hook.result.current.handleSaveConfirmed("List 2"); });
    expect(hook.result.current.savedLists).toHaveLength(2);
  });
});

// ─── shuffle / sort ───────────────────────────────────────────────────────────

describe("shuffle", () => {
  it("preserves all elements", () => {
    const original = ["A", "B", "C", "D", "E", "F"];
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => [...original]); });
    act(() => { hook.result.current.shuffle(); });
    expect([...hook.result.current.names].sort()).toEqual([...original].sort());
  });

  it("preserves length", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B", "C"]); });
    act(() => { hook.result.current.shuffle(); });
    expect(hook.result.current.names).toHaveLength(3);
  });
});

describe("sort", () => {
  it("sorts ASCII strings alphabetically", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["Sushi", "Burger", "Ramen"]); });
    act(() => { hook.result.current.sort(); });
    expect(hook.result.current.names).toEqual(["Burger", "Ramen", "Sushi"]);
  });

  it("does not mutate — returns new array", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["B", "A"]); });
    const before = hook.result.current.names;
    act(() => { hook.result.current.sort(); });
    // State should have changed (sorted), original ref not reused
    expect(hook.result.current.names).toEqual(["A", "B"]);
    expect(before).toEqual(["B", "A"]);
  });
});

// ─── setActiveTab ─────────────────────────────────────────────────────────────

describe("setActiveTab", () => {
  it("changes the active tab", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setActiveTab("explore"); });
    expect(hook.result.current.activeTab).toBe("explore");
  });

  it("can switch between all valid tabs", () => {
    const hook = renderAndMount();
    for (const tab of ["my-list", "explore", "saved", "history"] as const) {
      act(() => { hook.result.current.setActiveTab(tab); });
      expect(hook.result.current.activeTab).toBe(tab);
    }
  });
});

// ─── setHistory ───────────────────────────────────────────────────────────────

describe("setHistory", () => {
  it("clears history when called with empty array updater", () => {
    const hook = renderAndMount();
    act(() => { hook.result.current.setNames(() => ["A", "B"]); });
    act(() => { hook.result.current.handleSpinEnd(0); });
    expect(hook.result.current.history.length).toBeGreaterThan(0);
    act(() => { hook.result.current.setHistory(() => []); });
    expect(hook.result.current.history).toHaveLength(0);
  });
});
