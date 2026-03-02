/**
 * @file explore-views.test.tsx
 * Unit tests for StoreBrowseView and StoreDetailView.
 *
 * Covers: city/store rendering, navigation callbacks,
 * filter UI, selection management, and action buttons.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StoreBrowseView from "@/src/features/explore/StoreBrowseView";
import StoreDetailView from "@/src/features/explore/StoreDetailView";
import type { City, DepartmentStore, RestaurantCategory } from "@/src/types";

// ─── shared fixtures ──────────────────────────────────────────────────────────

const CATEGORIES: RestaurantCategory[] = [
  { id: "thai",     label: "Thai",     emoji: "🍛" },
  { id: "japanese", label: "Japanese", emoji: "🍣" },
];

const STORE: DepartmentStore = {
  id:          "central-world",
  name:        "CentralWorld",
  emoji:       "🏬",
  description: "Largest mall in Bangkok",
  restaurants: [
    { name: "Pad Thai Place",   category: "thai",     floor: "5" },
    { name: "Ramen Ichiban",    category: "japanese", floor: "6" },
    { name: "Sushi Taro",       category: "japanese", floor: "6" },
  ],
};

const CITIES: City[] = [
  {
    id: "bangkok", name: "Bangkok", emoji: "🏙️",
    stores: [STORE, { ...STORE, id: "siam-paragon", name: "Siam Paragon", description: "Luxury mall" }],
  },
  {
    id: "chiang-mai", name: "Chiang Mai", emoji: "🌿",
    stores: [{ ...STORE, id: "promenada", name: "Promenada", description: "Northern mall" }],
  },
];

// ─── StoreBrowseView ──────────────────────────────────────────────────────────

describe("StoreBrowseView", () => {
  const defaultProps = {
    cities: CITIES,
    cityId: "bangkok",
    onCityChange: jest.fn(),
    onSelectStore: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders all stores for the selected city", () => {
    render(<StoreBrowseView {...defaultProps} />);
    expect(screen.getByText("CentralWorld")).toBeInTheDocument();
    expect(screen.getByText("Siam Paragon")).toBeInTheDocument();
  });

  it("renders store restaurant counts", () => {
    render(<StoreBrowseView {...defaultProps} />);
    // Both stores have the same 3-restaurant fixture
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(2);
  });

  it("calls onSelectStore with the store id when a store card is clicked", () => {
    const onSelectStore = jest.fn();
    render(<StoreBrowseView {...defaultProps} onSelectStore={onSelectStore} />);
    fireEvent.click(screen.getByText("CentralWorld"));
    expect(onSelectStore).toHaveBeenCalledWith("central-world");
  });

  it("calls onCityChange when the select value changes", () => {
    const onCityChange = jest.fn();
    render(<StoreBrowseView {...defaultProps} onCityChange={onCityChange} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "chiang-mai" } });
    expect(onCityChange).toHaveBeenCalledWith("chiang-mai");
  });
});

// ─── StoreDetailView ─────────────────────────────────────────────────────────

describe("StoreDetailView", () => {
  const defaultProps = {
    store:       STORE,
    categories:  CATEGORIES,
    catFilter:   "all",
    filtered:    STORE.restaurants,
    selected:    new Set<string>(),
    allChecked:  false,
    someChecked: false,
    onBack:           jest.fn(),
    onFilterChange:   jest.fn(),
    onToggle:         jest.fn(),
    onSelectAll:      jest.fn(),
    onClearSelection: jest.fn(),
    onAdd:            jest.fn(),
    onUse:            jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  it("renders the store name in the header", () => {
    render(<StoreDetailView {...defaultProps} />);
    expect(screen.getByText("CentralWorld")).toBeInTheDocument();
  });

  it("renders the back arrow button", () => {
    render(<StoreDetailView {...defaultProps} />);
    expect(screen.getByLabelText("Back to store list")).toBeInTheDocument();
  });

  it("calls onBack when the back button is clicked", () => {
    const onBack = jest.fn();
    render(<StoreDetailView {...defaultProps} onBack={onBack} />);
    fireEvent.click(screen.getByLabelText("Back to store list"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders all restaurants in the list", () => {
    render(<StoreDetailView {...defaultProps} />);
    STORE.restaurants.forEach(r => {
      expect(screen.getByText(r.name)).toBeInTheDocument();
    });
  });

  it("renders category filter pills for each category", () => {
    render(<StoreDetailView {...defaultProps} />);
    expect(screen.getByText("Thai")).toBeInTheDocument();
    expect(screen.getByText("Japanese")).toBeInTheDocument();
  });

  it("renders the 'All' filter pill", () => {
    render(<StoreDetailView {...defaultProps} />);
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  it("calls onFilterChange when a category pill is clicked", () => {
    const onFilterChange = jest.fn();
    render(<StoreDetailView {...defaultProps} onFilterChange={onFilterChange} />);
    fireEvent.click(screen.getByText("Thai"));
    expect(onFilterChange).toHaveBeenCalledWith("thai");
  });

  it("shows filtered restaurant count", () => {
    render(<StoreDetailView {...defaultProps} />);
    expect(screen.getByText("3 restaurants")).toBeInTheDocument();
  });

  it("shows 'No restaurants in this category' when filtered is empty", () => {
    render(<StoreDetailView {...defaultProps} filtered={[]} />);
    expect(screen.getByText("No restaurants in this category")).toBeInTheDocument();
  });

  it("calls onAdd with all filtered names when Add button clicked (no selection)", () => {
    const onAdd = jest.fn();
    render(<StoreDetailView {...defaultProps} onAdd={onAdd} />);
    fireEvent.click(screen.getByText(/\+ Add all/));
    expect(onAdd).toHaveBeenCalledWith(STORE.restaurants.map(r => r.name));
  });

  it("calls onUse with all filtered names when Spin button clicked (no selection)", () => {
    const onUse = jest.fn();
    render(<StoreDetailView {...defaultProps} onUse={onUse} />);
    fireEvent.click(screen.getByText(/Spin 3/));
    expect(onUse).toHaveBeenCalledWith(STORE.restaurants.map(r => r.name));
  });

  it("calls onSelectAll when Select all is clicked", () => {
    const onSelectAll = jest.fn();
    render(<StoreDetailView {...defaultProps} onSelectAll={onSelectAll} />);
    fireEvent.click(screen.getByText("Select all"));
    expect(onSelectAll).toHaveBeenCalledTimes(1);
  });

  it("shows selected count when some are selected", () => {
    render(<StoreDetailView
      {...defaultProps}
      selected={new Set(["Pad Thai Place"])}
      someChecked
    />);
    expect(screen.getByText("1 selected")).toBeInTheDocument();
  });

  it("shows Clear button when some items are selected", () => {
    render(<StoreDetailView
      {...defaultProps}
      selected={new Set(["Pad Thai Place"])}
      someChecked
    />);
    // "Clear" button appears in the selection header
    const clearButtons = screen.getAllByText("Clear");
    expect(clearButtons.length).toBeGreaterThan(0);
  });

  it("calls onClearSelection when Clear is clicked", () => {
    const onClearSelection = jest.fn();
    render(<StoreDetailView
      {...defaultProps}
      selected={new Set(["Pad Thai Place"])}
      someChecked
      onClearSelection={onClearSelection}
    />);
    const clearButtons = screen.getAllByText("Clear");
    fireEvent.click(clearButtons[0]);
    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });

  it("shows '+ Add N selected' when items are selected", () => {
    render(<StoreDetailView
      {...defaultProps}
      selected={new Set(["Ramen Ichiban", "Sushi Taro"])}
      someChecked
    />);
    expect(screen.getByText(/\+ Add 2 selected/)).toBeInTheDocument();
  });
});
