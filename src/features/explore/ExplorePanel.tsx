"use client";

import { useExploreState } from "./useExploreState";
import { CITIES } from "@/src/data/restaurants.data";
import StoreBrowseView from "./StoreBrowseView";
import StoreDetailView from "./StoreDetailView";

interface Props {
  onUse: (places: string[]) => void;
  onAdd: (places: string[]) => void;
}

export default function ExplorePanel({ onUse, onAdd }: Props) {
  const {
    view, city, store,
    availableCats, filtered, selected,
    catFilter, allChecked, someChecked,
    handleCityChange, handleSelectStore, handleBack,
    setCatFilter, toggle, selectAll, clearSelected,
  } = useExploreState();

  if (view === "store" && store) {
    return (
      <StoreDetailView
        store={store}
        categories={availableCats}
        catFilter={catFilter}
        filtered={filtered}
        selected={selected}
        allChecked={allChecked}
        someChecked={someChecked}
        onBack={handleBack}
        onFilterChange={setCatFilter}
        onToggle={toggle}
        onSelectAll={selectAll}
        onClearSelection={clearSelected}
        onAdd={onAdd}
        onUse={names => { onUse(names); clearSelected(); }}
      />
    );
  }

  return (
    <StoreBrowseView
      cities={CITIES}
      cityId={city.id}
      onCityChange={handleCityChange}
      onSelectStore={handleSelectStore}
    />
  );
}
