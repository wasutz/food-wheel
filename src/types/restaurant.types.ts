export interface Restaurant {
  name: string;
  /** Must match a RestaurantCategory id */
  category: string;
  /** Floor label e.g. "G", "4", "B1" */
  floor?: string;
}

export interface DepartmentStore {
  id: string;
  name: string;
  emoji: string;
  description: string;
  restaurants: Restaurant[];
}

export interface City {
  id: string;
  name: string;
  emoji: string;
  stores: DepartmentStore[];
}

export interface RestaurantCategory {
  id: string;
  label: string;
  emoji: string;
}
