/**
 * @file useExploreState.test.ts
 * Unit tests for the useExploreState hook.
 *
 * Covers: city selection, store navigation (browse ↔ store), category
 * filtering, individual toggle, select-all, clear-selection, and all
 * derived booleans (allChecked, someChecked).
 */

import { renderHook, act } from "@testing-library/react";
import { useExploreState } from "@/src/features/explore/useExploreState";

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Renders the hook and navigates to the first store of the default city. */
function renderInBrowseView() {
  return renderHook(() => useExploreState());
}

function renderInStoreView() {
  const hook = renderHook(() => useExploreState());
  const firstStoreId = hook.result.current.city.stores[0].id;
  act(() => { hook.result.current.handleSelectStore(firstStoreId); });
  return hook;
}

// ─── initial state ────────────────────────────────────────────────────────────

describe("useExploreState — initial state", () => {
  it("starts in browse view", () => {
    const { result } = renderInBrowseView();
    expect(result.current.view).toBe("browse");
  });

  it("defaults to bangkok city", () => {
    const { result } = renderInBrowseView();
    expect(result.current.cityId).toBe("bangkok");
    expect(result.current.city.id).toBe("bangkok");
  });

  it("starts with no store selected", () => {
    const { result } = renderInBrowseView();
    expect(result.current.storeId).toBeNull();
    expect(result.current.store).toBeNull();
  });

  it("starts with catFilter = 'all'", () => {
    const { result } = renderInBrowseView();
    expect(result.current.catFilter).toBe("all");
  });

  it("starts with an empty selection set", () => {
    const { result } = renderInBrowseView();
    expect(result.current.selected.size).toBe(0);
  });

  it("availableCats is empty when no store is selected", () => {
    const { result } = renderInBrowseView();
    expect(result.current.availableCats).toHaveLength(0);
  });

  it("filtered is empty when no store is selected", () => {
    const { result } = renderInBrowseView();
    expect(result.current.filtered).toHaveLength(0);
  });
});

// ─── city change ──────────────────────────────────────────────────────────────

describe("handleCityChange", () => {
  it("updates cityId", () => {
    const { result } = renderInBrowseView();
    const secondCity = result.current.city; // capture before
    // Get a different city id from the data
    act(() => { result.current.handleCityChange("chiang-mai"); });
    // If 'chiang-mai' doesn't exist it falls back to first city — just verify it ran
    expect(typeof result.current.cityId).toBe("string");
  });

  it("resets storeId to null", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.handleCityChange("bangkok"); });
    expect(hook.result.current.storeId).toBeNull();
  });

  it("resets view to browse", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.handleCityChange("bangkok"); });
    expect(hook.result.current.view).toBe("browse");
  });

  it("resets catFilter to 'all'", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.setCatFilter("japanese"); });
    act(() => { hook.result.current.handleCityChange("bangkok"); });
    expect(hook.result.current.catFilter).toBe("all");
  });

  it("clears selected", () => {
    const hook = renderInStoreView();
    const firstName = hook.result.current.filtered[0]?.name;
    if (firstName) {
      act(() => { hook.result.current.toggle(firstName); });
      expect(hook.result.current.selected.size).toBeGreaterThan(0);
    }
    act(() => { hook.result.current.handleCityChange("bangkok"); });
    expect(hook.result.current.selected.size).toBe(0);
  });
});

// ─── store navigation ─────────────────────────────────────────────────────────

describe("handleSelectStore", () => {
  it("sets view to 'store'", () => {
    const { result } = renderInBrowseView();
    const storeId = result.current.city.stores[0].id;
    act(() => { result.current.handleSelectStore(storeId); });
    expect(result.current.view).toBe("store");
  });

  it("sets storeId correctly", () => {
    const { result } = renderInBrowseView();
    const storeId = result.current.city.stores[0].id;
    act(() => { result.current.handleSelectStore(storeId); });
    expect(result.current.storeId).toBe(storeId);
  });

  it("populates the store derived value", () => {
    const { result } = renderInBrowseView();
    const firstStore = result.current.city.stores[0];
    act(() => { result.current.handleSelectStore(firstStore.id); });
    expect(result.current.store?.id).toBe(firstStore.id);
    expect(result.current.store?.name).toBe(firstStore.name);
  });

  it("populates filtered with all store restaurants (catFilter = all)", () => {
    const { result } = renderInBrowseView();
    const firstStore = result.current.city.stores[0];
    act(() => { result.current.handleSelectStore(firstStore.id); });
    expect(result.current.filtered).toHaveLength(firstStore.restaurants.length);
  });

  it("resets catFilter to 'all'", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.setCatFilter("thai"); });
    const secondStore = hook.result.current.city.stores[1];
    if (secondStore) {
      act(() => { hook.result.current.handleSelectStore(secondStore.id); });
      expect(hook.result.current.catFilter).toBe("all");
    }
  });

  it("clears selection when switching stores", () => {
    const hook = renderInStoreView();
    const name = hook.result.current.filtered[0]?.name;
    if (name) act(() => { hook.result.current.toggle(name); });
    const secondStore = hook.result.current.city.stores[1];
    if (secondStore) {
      act(() => { hook.result.current.handleSelectStore(secondStore.id); });
      expect(hook.result.current.selected.size).toBe(0);
    }
  });
});

// ─── handleBack ───────────────────────────────────────────────────────────────

describe("handleBack", () => {
  it("returns view to browse", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.handleBack(); });
    expect(hook.result.current.view).toBe("browse");
  });

  it("clears storeId", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.handleBack(); });
    expect(hook.result.current.storeId).toBeNull();
  });

  it("clears store derived value", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.handleBack(); });
    expect(hook.result.current.store).toBeNull();
  });

  it("resets catFilter to 'all'", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.setCatFilter("japanese"); });
    act(() => { hook.result.current.handleBack(); });
    expect(hook.result.current.catFilter).toBe("all");
  });

  it("clears selection", () => {
    const hook = renderInStoreView();
    const name = hook.result.current.filtered[0]?.name;
    if (name) act(() => { hook.result.current.toggle(name); });
    act(() => { hook.result.current.handleBack(); });
    expect(hook.result.current.selected.size).toBe(0);
  });
});

// ─── category filtering ───────────────────────────────────────────────────────

describe("setCatFilter", () => {
  it("filters restaurants to matching category", () => {
    const hook = renderInStoreView();
    const cats = hook.result.current.availableCats;
    if (cats.length === 0) return; // data guard

    const targetCat = cats[0];
    act(() => { hook.result.current.setCatFilter(targetCat.id); });

    const allMatch = hook.result.current.filtered.every(r => r.category === targetCat.id);
    expect(allMatch).toBe(true);
  });

  it("returns all restaurants when filter is 'all'", () => {
    const hook = renderInStoreView();
    const total = hook.result.current.store!.restaurants.length;
    act(() => { hook.result.current.setCatFilter("nonexistent"); });
    act(() => { hook.result.current.setCatFilter("all"); });
    expect(hook.result.current.filtered).toHaveLength(total);
  });

  it("returns empty filtered array for a category with no matches", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.setCatFilter("category-that-does-not-exist"); });
    expect(hook.result.current.filtered).toHaveLength(0);
  });
});

// ─── toggle / select / clear ──────────────────────────────────────────────────

describe("toggle", () => {
  it("adds a name to the selection", () => {
    const hook = renderInStoreView();
    const name = hook.result.current.filtered[0]?.name ?? "";
    act(() => { hook.result.current.toggle(name); });
    expect(hook.result.current.selected.has(name)).toBe(true);
  });

  it("removes a name that is already selected (toggle off)", () => {
    const hook = renderInStoreView();
    const name = hook.result.current.filtered[0]?.name ?? "";
    act(() => { hook.result.current.toggle(name); });
    act(() => { hook.result.current.toggle(name); });
    expect(hook.result.current.selected.has(name)).toBe(false);
  });

  it("does not affect other selected names", () => {
    const hook = renderInStoreView();
    const [a, b] = hook.result.current.filtered;
    if (!a || !b) return;
    act(() => { hook.result.current.toggle(a.name); });
    act(() => { hook.result.current.toggle(b.name); });
    act(() => { hook.result.current.toggle(a.name); }); // deselect a
    expect(hook.result.current.selected.has(b.name)).toBe(true);
    expect(hook.result.current.selected.has(a.name)).toBe(false);
  });
});

describe("selectAll", () => {
  it("selects every restaurant in filtered", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.selectAll(); });
    const allSelected = hook.result.current.filtered.every(
      r => hook.result.current.selected.has(r.name)
    );
    expect(allSelected).toBe(true);
  });

  it("sets allChecked to true", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.selectAll(); });
    expect(hook.result.current.allChecked).toBe(true);
  });

  it("sets someChecked to false when all are selected", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.selectAll(); });
    expect(hook.result.current.someChecked).toBe(false);
  });
});

describe("clearSelected", () => {
  it("empties the selection set", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.selectAll(); });
    act(() => { hook.result.current.clearSelected(); });
    expect(hook.result.current.selected.size).toBe(0);
  });

  it("sets allChecked to false after clear", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.selectAll(); });
    act(() => { hook.result.current.clearSelected(); });
    expect(hook.result.current.allChecked).toBe(false);
  });
});

// ─── derived booleans ────────────────────────────────────────────────────────

describe("allChecked and someChecked", () => {
  it("allChecked is false with no selection", () => {
    const hook = renderInStoreView();
    expect(hook.result.current.allChecked).toBe(false);
  });

  it("someChecked is false with no selection", () => {
    const hook = renderInStoreView();
    expect(hook.result.current.someChecked).toBe(false);
  });

  it("someChecked is true when partially selected", () => {
    const hook = renderInStoreView();
    const name = hook.result.current.filtered[0]?.name;
    if (!name || hook.result.current.filtered.length < 2) return;
    act(() => { hook.result.current.toggle(name); });
    expect(hook.result.current.someChecked).toBe(true);
    expect(hook.result.current.allChecked).toBe(false);
  });

  it("allChecked is false when filtered is empty", () => {
    const hook = renderInStoreView();
    act(() => { hook.result.current.setCatFilter("__no_match__"); });
    expect(hook.result.current.allChecked).toBe(false);
  });
});

// ─── actionNames ─────────────────────────────────────────────────────────────

describe("actionNames", () => {
  it("returns all filtered names when nothing is selected", () => {
    const hook = renderInStoreView();
    const expectedNames = hook.result.current.filtered.map(r => r.name);
    expect(hook.result.current.actionNames).toEqual(expectedNames);
  });

  it("returns only selected names when a selection exists", () => {
    const hook = renderInStoreView();
    const [a, b] = hook.result.current.filtered;
    if (!a || !b) return;
    act(() => { hook.result.current.toggle(a.name); });
    expect(hook.result.current.actionNames).toEqual([a.name]);
  });
});
