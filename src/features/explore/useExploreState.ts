"use client";

import { useMemo, useState } from "react";
import { CITIES, RESTAURANT_CATEGORIES } from "@/src/data/restaurants.data";
import type { ExploreState, ExploreActions, ExploreView } from "@/src/types";
import appConfig from "@/src/config/app.config.json";

const { defaultCityId, defaultCatFilter } = appConfig.explore;

export function useExploreState(): ExploreState & ExploreActions {
  const [view,      setView]      = useState<ExploreView>("browse");
  const [cityId,    setCityId]    = useState(defaultCityId);
  const [storeId,   setStoreId]   = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState(defaultCatFilter);
  const [selected,  setSelected]  = useState<Set<string>>(new Set());

  // ── Derived state (all at top-level, Rules of Hooks) ─────────────────
  const city = useMemo(
    () => CITIES.find(c => c.id === cityId) ?? CITIES[0],
    [cityId]
  );

  const store = useMemo(
    () => (storeId ? (city.stores.find(s => s.id === storeId) ?? null) : null),
    [city, storeId]
  );

  const availableCats = useMemo(() => {
    if (!store) return [];
    const catIds = new Set(store.restaurants.map(r => r.category));
    return RESTAURANT_CATEGORIES.filter(c => catIds.has(c.id));
  }, [store]);

  const filtered = useMemo(() => {
    if (!store) return [];
    return catFilter === defaultCatFilter
      ? store.restaurants
      : store.restaurants.filter(r => r.category === catFilter);
  }, [store, catFilter]);

  const allChecked   = filtered.length > 0 && filtered.every(r => selected.has(r.name));
  const someChecked  = selected.size > 0 && !allChecked;
  const selectedList = [...selected];
  const actionNames  = selectedList.length ? selectedList : filtered.map(r => r.name);

  // ── Actions ────────────────────────────────────────────────────────────
  const handleCityChange = (id: string) => {
    setCityId(id);
    setStoreId(null);
    setView("browse");
    setCatFilter(defaultCatFilter);
    setSelected(new Set());
  };

  const handleSelectStore = (id: string) => {
    setStoreId(id);
    setCatFilter(defaultCatFilter);
    setSelected(new Set());
    setView("store");
  };

  const handleBack = () => {
    setView("browse");
    setStoreId(null);
    setCatFilter(defaultCatFilter);
    setSelected(new Set());
  };

  const toggle = (name: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const selectAll     = () => setSelected(new Set(filtered.map(r => r.name)));
  const clearSelected = () => setSelected(new Set());

  return {
    // state
    view, cityId, storeId, catFilter, selected,
    // derived
    city, store, availableCats, filtered,
    allChecked, someChecked, selectedList, actionNames,
    // actions
    handleCityChange, handleSelectStore, handleBack,
    setCatFilter, toggle, selectAll, clearSelected,
  };
}
