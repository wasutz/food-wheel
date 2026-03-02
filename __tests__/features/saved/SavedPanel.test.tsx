/**
 * @file SavedPanel.test.tsx
 * Unit tests for the SavedPanel component.
 *
 * Covers: empty state, list rendering, loading a list (onLoad), and
 * deleting a list (setSavedLists).
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SavedPanel from "@/src/features/saved/SavedPanel";
import type { SavedList } from "@/src/types";

const LISTS: SavedList[] = [
  { name: "Friday Picks", names: ["Ramen", "Sushi"], date: "01/01/2025" },
  { name: "Weekend Eats", names: ["Pizza", "Burger", "Tacos"], date: "07/01/2025" },
];

describe("SavedPanel — empty state", () => {
  it("shows empty state message when no saved lists", () => {
    render(<SavedPanel savedLists={[]} setSavedLists={jest.fn()} onLoad={jest.fn()} />);
    expect(screen.getByText(/No saved lists yet/i)).toBeInTheDocument();
  });

  it("shows the 'Saved lists' heading", () => {
    render(<SavedPanel savedLists={[]} setSavedLists={jest.fn()} onLoad={jest.fn()} />);
    expect(screen.getByText("Saved lists")).toBeInTheDocument();
  });
});

describe("SavedPanel — populated state", () => {
  it("renders all saved list names", () => {
    render(<SavedPanel savedLists={LISTS} setSavedLists={jest.fn()} onLoad={jest.fn()} />);
    expect(screen.getByText("Friday Picks")).toBeInTheDocument();
    expect(screen.getByText("Weekend Eats")).toBeInTheDocument();
  });

  it("shows restaurant count and date for each list", () => {
    render(<SavedPanel savedLists={LISTS} setSavedLists={jest.fn()} onLoad={jest.fn()} />);
    expect(screen.getByText(/2 restaurants.*01\/01\/2025/)).toBeInTheDocument();
    expect(screen.getByText(/3 restaurants.*07\/01\/2025/)).toBeInTheDocument();
  });

  it("calls onLoad with the correct list when a card is clicked", () => {
    const onLoad = jest.fn();
    render(<SavedPanel savedLists={LISTS} setSavedLists={jest.fn()} onLoad={onLoad} />);
    fireEvent.click(screen.getByText("Friday Picks"));
    expect(onLoad).toHaveBeenCalledWith(LISTS[0]);
  });

  it("calls setSavedLists when the delete (✕) button is clicked", () => {
    const setSavedLists = jest.fn();
    render(<SavedPanel savedLists={LISTS} setSavedLists={setSavedLists} onLoad={jest.fn()} />);
    const deleteButtons = screen.getAllByText("✕");
    fireEvent.click(deleteButtons[0]);
    expect(setSavedLists).toHaveBeenCalledTimes(1);
    // Verify the updater removes the first item
    const updater = setSavedLists.mock.calls[0][0] as (prev: SavedList[]) => SavedList[];
    expect(updater(LISTS)).toEqual([LISTS[1]]);
  });

  it("does NOT call onLoad when delete button is clicked (event propagation stopped)", () => {
    const onLoad = jest.fn();
    render(<SavedPanel savedLists={LISTS} setSavedLists={jest.fn()} onLoad={onLoad} />);
    const deleteButtons = screen.getAllByText("✕");
    fireEvent.click(deleteButtons[0]);
    expect(onLoad).not.toHaveBeenCalled();
  });
});
