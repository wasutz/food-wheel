import type { City, DepartmentStore, Restaurant, RestaurantCategory } from "./restaurant.types";

/** Which view the Explore panel is currently showing. */
export type ExploreView = "browse" | "store";

/** All reactive state owned by the useExploreState hook. */
export interface ExploreState {
  view: ExploreView;
  cityId: string;
  storeId: string | null;
  catFilter: string;
  selected: Set<string>;
  // derived
  city: City;
  store: DepartmentStore | null;
  availableCats: RestaurantCategory[];
  filtered: Restaurant[];
  allChecked: boolean;
  someChecked: boolean;
  selectedList: string[];
  actionNames: string[];
}

/** All actions exposed by the useExploreState hook. */
export interface ExploreActions {
  handleCityChange: (id: string) => void;
  handleSelectStore: (id: string) => void;
  handleBack: () => void;
  setCatFilter: (cat: string) => void;
  toggle: (name: string) => void;
  selectAll: () => void;
  clearSelected: () => void;
}
