import type { DepartmentStore, Restaurant, RestaurantCategory } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import FilterPill from "./FilterPill";
import RestaurantRow from "./RestaurantRow";
import ExploreCheckbox from "./ExploreCheckbox";
import SectionLabel from "@/src/components/shared/SectionLabel";
import appConfig from "@/src/config/app.config.json";

const {
  allCategoryOption, restaurantListMaxHeight,
  categoryLabel, backAriaLabel,
  selectAllLabel, clearSelectionLabel,
  noRestaurantsLabel, addButtonPrefix, addAllSuffix,
  addSelectedSuffix, spinButtonSuffix,
} = appConfig.explore;

interface Props {
  store: DepartmentStore;
  categories: RestaurantCategory[];
  catFilter: string;
  filtered: Restaurant[];
  selected: Set<string>;
  allChecked: boolean;
  someChecked: boolean;
  onBack: () => void;
  onFilterChange: (cat: string) => void;
  onToggle: (name: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onAdd: (names: string[]) => void;
  onUse: (names: string[]) => void;
}

export default function StoreDetailView({
  store, categories, catFilter, filtered, selected,
  allChecked, someChecked,
  onBack, onFilterChange, onToggle, onSelectAll, onClearSelection,
  onAdd, onUse,
}: Props) {
  const selectedList = [...selected];
  const actionNames  = selectedList.length ? selectedList : filtered.map(r => r.name);

  return (
    <div className="flex flex-col gap-4 animate-fade-up">
      {/* Back + store header */}
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground hover:border-white/25 transition-colors shrink-0 text-base"
          aria-label={backAriaLabel}
        >
          ←
        </button>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{store.emoji}</span>
            <h3 className="font-bold text-base text-foreground leading-tight">{store.name}</h3>
          </div>
          <p className="text-[0.68rem] text-muted-foreground mt-0.5">{store.description}</p>
        </div>
      </div>

      {/* Category filter pills */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <SectionLabel>{categoryLabel}</SectionLabel>
          <span className="text-[0.67rem] text-muted-foreground">{filtered.length} restaurants</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <FilterPill
            active={catFilter === allCategoryOption.id}
            onClick={() => onFilterChange(allCategoryOption.id)}
            label={allCategoryOption.label}
            emoji={allCategoryOption.emoji}
            count={store.restaurants.length}
          />
          {categories.map(cat => (
            <FilterPill
              key={cat.id}
              active={catFilter === cat.id}
              onClick={() => onFilterChange(cat.id)}
              label={cat.label}
              emoji={cat.emoji}
              count={store.restaurants.filter(r => r.category === cat.id).length}
            />
          ))}
        </div>
      </section>

      {/* Restaurant list */}
      <section className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
        {/* Select-all header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.06]">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={allChecked ? onClearSelection : onSelectAll}
          >
            <ExploreCheckbox
              checked={allChecked}
              indeterminate={someChecked}
              onChange={allChecked ? onClearSelection : onSelectAll}
            />
            <span className="text-[0.71rem] text-muted-foreground select-none">
              {selected.size > 0 ? `${selected.size} ${addSelectedSuffix}` : selectAllLabel}
            </span>
          </div>
          {selected.size > 0 && (
            <button
              onClick={onClearSelection}
              className="text-[0.68rem] text-muted-foreground border border-white/10 rounded-md px-2 py-0.5 hover:border-white/20 transition-colors"
            >
              {clearSelectionLabel}
            </button>
          )}
        </div>

        {/* Rows */}
        <div className="overflow-y-auto" style={{ maxHeight: restaurantListMaxHeight }}>
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground text-sm">
              {noRestaurantsLabel}
            </div>
          ) : (
            filtered.map(r => (
              <RestaurantRow
                key={r.name}
                restaurant={r}
                category={categories.find(c => c.id === r.category)}
                checked={selected.has(r.name)}
                onToggle={() => onToggle(r.name)}
              />
            ))
          )}
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 text-sm"
          disabled={filtered.length === 0}
          onClick={() => onAdd(actionNames)}
        >
          {addButtonPrefix} {selectedList.length ? `${selectedList.length} ${addSelectedSuffix}` : addAllSuffix}
        </Button>
        <Button
          className="flex-1 text-sm bg-gradient-to-br from-orange-600 to-amber-500 text-white hover:opacity-90 shadow-lg shadow-orange-500/20"
          disabled={filtered.length === 0}
          onClick={() => onUse(actionNames)}
        >
          Spin {actionNames.length} {spinButtonSuffix}
        </Button>
      </div>
    </div>
  );
}
