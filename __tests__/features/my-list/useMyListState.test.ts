/**
 * @file useMyListState.test.ts
 * Unit tests for the useMyListState hook.
 */

import { renderHook, act } from "@testing-library/react";
import { useMyListState } from "@/src/features/my-list/useMyListState";

const makeParams = (overrides?: Partial<Parameters<typeof useMyListState>[0]>) => ({
  names: ["Ramen", "Sushi", "Pizza"],
  setNames: jest.fn(),
  onSaveConfirmed: jest.fn(),
  ...overrides,
});

describe("useMyListState", () => {
  // ── initial state ──────────────────────────────────────────────────────

  it("initialises text from names joined by newlines", () => {
    const { result } = renderHook(() => useMyListState(makeParams()));
    expect(result.current.text).toBe("Ramen\nSushi\nPizza");
  });

  it("initialises with null modal", () => {
    const { result } = renderHook(() => useMyListState(makeParams()));
    expect(result.current.modal).toBeNull();
  });

  it("initialises with empty saveInput", () => {
    const { result } = renderHook(() => useMyListState(makeParams()));
    expect(result.current.saveInput).toBe("");
  });

  // ── handleTextChange ───────────────────────────────────────────────────

  it("handleTextChange updates text state", () => {
    const params = makeParams();
    const { result } = renderHook(() => useMyListState(params));
    act(() => { result.current.handleTextChange("Burger\nNoodle"); });
    expect(result.current.text).toBe("Burger\nNoodle");
  });

  it("handleTextChange calls setNames with parsed lines, trimmed and filtered", () => {
    const params = makeParams();
    const { result } = renderHook(() => useMyListState(params));
    act(() => { result.current.handleTextChange("  Burger  \n\nNoodle\n  "); });
    expect(params.setNames).toHaveBeenCalledWith(expect.any(Function));
    // Invoke the updater to check its output
    const updater = params.setNames.mock.calls.at(-1)![0] as (prev: string[]) => string[];
    expect(updater([])).toEqual(["Burger", "Noodle"]);
  });

  it("handleTextChange with empty string calls setNames with []", () => {
    const params = makeParams();
    const { result } = renderHook(() => useMyListState(params));
    act(() => { result.current.handleTextChange(""); });
    const updater = params.setNames.mock.calls.at(-1)![0] as (prev: string[]) => string[];
    expect(updater([])).toEqual([]);
  });

  // ── removeName ────────────────────────────────────────────────────────

  it("removeName removes the entry at the given index", () => {
    const params = makeParams({ names: ["A", "B", "C"] });
    const { result } = renderHook(() => useMyListState(params));
    act(() => { result.current.removeName(1); }); // remove "B"
    const updater = params.setNames.mock.calls.at(-1)![0] as (prev: string[]) => string[];
    expect(updater([])).toEqual(["A", "C"]);
  });

  it("removeName updates text to match remaining names", () => {
    const params = makeParams({ names: ["A", "B", "C"] });
    const { result } = renderHook(() => useMyListState(params));
    act(() => { result.current.removeName(0); }); // remove "A"
    expect(result.current.text).toBe("B\nC");
  });

  // ── modal management ───────────────────────────────────────────────────

  it("openSaveModal sets modal to save-prompt", () => {
    const { result } = renderHook(() => useMyListState(makeParams()));
    act(() => { result.current.openSaveModal(); });
    expect(result.current.modal?.type).toBe("save-prompt");
  });

  it("openSaveModal sets a non-empty saveInput", () => {
    const { result } = renderHook(() => useMyListState(makeParams()));
    act(() => { result.current.openSaveModal(); });
    expect(result.current.saveInput.length).toBeGreaterThan(0);
  });

  it("openClearModal sets modal to clear-confirm", () => {
    const { result } = renderHook(() => useMyListState(makeParams()));
    act(() => { result.current.openClearModal(); });
    expect(result.current.modal?.type).toBe("clear-confirm");
  });

  it("setModal(null) dismisses the modal", () => {
    const { result } = renderHook(() => useMyListState(makeParams()));
    act(() => { result.current.openSaveModal(); });
    act(() => { result.current.setModal(null); });
    expect(result.current.modal).toBeNull();
  });

  // ── confirmSave ────────────────────────────────────────────────────────

  it("confirmSave calls onSaveConfirmed with trimmed name", () => {
    const params = makeParams();
    const { result } = renderHook(() => useMyListState(params));
    act(() => { result.current.confirmSave("  Friday Picks  "); });
    expect(params.onSaveConfirmed).toHaveBeenCalledWith("Friday Picks");
  });

  it("confirmSave advances modal to save-success", () => {
    const { result } = renderHook(() => useMyListState(makeParams()));
    act(() => { result.current.confirmSave("My List"); });
    expect(result.current.modal?.type).toBe("save-success");
    if (result.current.modal?.type === "save-success") {
      expect(result.current.modal.listName).toBe("My List");
    }
  });

  it("confirmSave does NOT call onSaveConfirmed for blank name", () => {
    const params = makeParams();
    const { result } = renderHook(() => useMyListState(params));
    act(() => { result.current.confirmSave("   "); });
    expect(params.onSaveConfirmed).not.toHaveBeenCalled();
  });

  // ── confirmClear ───────────────────────────────────────────────────────

  it("confirmClear calls setNames with an empty array", () => {
    const params = makeParams();
    const { result } = renderHook(() => useMyListState(params));
    act(() => { result.current.confirmClear(); });
    const updater = params.setNames.mock.calls.at(-1)![0] as (prev: string[]) => string[];
    expect(updater(["anything"])).toEqual([]);
  });

  it("confirmClear advances modal to clear-success", () => {
    const { result } = renderHook(() => useMyListState(makeParams()));
    act(() => { result.current.confirmClear(); });
    expect(result.current.modal?.type).toBe("clear-success");
  });

  it("confirmClear resets text to empty string", () => {
    const params = makeParams({ names: ["A", "B"] });
    const { result } = renderHook(() => useMyListState(params));
    act(() => { result.current.confirmClear(); });
    expect(result.current.text).toBe("");
  });
});
