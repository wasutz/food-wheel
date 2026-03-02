/**
 * @file explore-subcomponents.test.tsx
 * Unit tests for small, presentational Explore sub-components:
 *   ExploreCheckbox, FilterPill, RestaurantRow, NamePill
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExploreCheckbox from "@/src/features/explore/ExploreCheckbox";
import FilterPill from "@/src/features/explore/FilterPill";
import RestaurantRow from "@/src/features/explore/RestaurantRow";
import NamePill from "@/src/features/my-list/NamePill";
import type { Restaurant, RestaurantCategory } from "@/src/types";

// ─── ExploreCheckbox ──────────────────────────────────────────────────────────

describe("ExploreCheckbox", () => {
  it("renders a checkmark when checked=true", () => {
    render(<ExploreCheckbox checked onChange={jest.fn()} />);
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("renders an indeterminate dash when indeterminate=true and checked=false", () => {
    render(<ExploreCheckbox checked={false} indeterminate onChange={jest.fn()} />);
    expect(screen.getByText("–")).toBeInTheDocument();
  });

  it("renders empty content when unchecked and not indeterminate", () => {
    render(<ExploreCheckbox checked={false} onChange={jest.fn()} />);
    expect(screen.queryByText("✓")).not.toBeInTheDocument();
    expect(screen.queryByText("–")).not.toBeInTheDocument();
  });

  it("calls onChange when clicked", () => {
    const onChange = jest.fn();
    render(<ExploreCheckbox checked={false} onChange={onChange} />);
    const el = screen.getByRole("checkbox");
    fireEvent.click(el);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("has aria-checked='true' when checked", () => {
    render(<ExploreCheckbox checked onChange={jest.fn()} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });

  it("has aria-checked='mixed' when indeterminate", () => {
    render(<ExploreCheckbox checked={false} indeterminate onChange={jest.fn()} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "mixed");
  });

  it("has aria-checked='false' when unchecked", () => {
    render(<ExploreCheckbox checked={false} onChange={jest.fn()} />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "false");
  });
});

// ─── FilterPill ───────────────────────────────────────────────────────────────

describe("FilterPill", () => {
  const defaultProps = {
    active: false,
    onClick: jest.fn(),
    label: "Japanese",
    emoji: "🍜",
    count: 5,
  };

  it("renders the label", () => {
    render(<FilterPill {...defaultProps} />);
    expect(screen.getByText("Japanese")).toBeInTheDocument();
  });

  it("renders the emoji", () => {
    render(<FilterPill {...defaultProps} />);
    expect(screen.getByText("🍜")).toBeInTheDocument();
  });

  it("renders the count", () => {
    render(<FilterPill {...defaultProps} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<FilterPill {...defaultProps} onClick={onClick} />);
    fireEvent.click(screen.getByText("Japanese"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies active styling classes when active=true", () => {
    const { container } = render(<FilterPill {...defaultProps} active />);
    const button = container.querySelector("button")!;
    expect(button.className).toContain("text-orange-400");
  });

  it("applies inactive styling when active=false", () => {
    const { container } = render(<FilterPill {...defaultProps} active={false} />);
    const button = container.querySelector("button")!;
    expect(button.className).toContain("text-muted-foreground");
  });
});

// ─── RestaurantRow ────────────────────────────────────────────────────────────

describe("RestaurantRow", () => {
  const restaurant: Restaurant = { name: "Sushi Bar", category: "japanese", floor: "3" };
  const category: RestaurantCategory = { id: "japanese", label: "Japanese", emoji: "🍣" };

  it("renders the restaurant name", () => {
    render(<RestaurantRow restaurant={restaurant} category={category} checked={false} onToggle={jest.fn()} />);
    expect(screen.getByText("Sushi Bar")).toBeInTheDocument();
  });

  it("renders the floor label when floor is set", () => {
    render(<RestaurantRow restaurant={restaurant} category={category} checked={false} onToggle={jest.fn()} />);
    expect(screen.getByText("3F")).toBeInTheDocument();
  });

  it("does not render floor label when floor is undefined", () => {
    const noFloor: Restaurant = { name: "No Floor", category: "thai" };
    render(<RestaurantRow restaurant={noFloor} category={category} checked={false} onToggle={jest.fn()} />);
    expect(screen.queryByText(/F$/)).not.toBeInTheDocument();
  });

  it("renders the category emoji", () => {
    render(<RestaurantRow restaurant={restaurant} category={category} checked={false} onToggle={jest.fn()} />);
    expect(screen.getByText("🍣")).toBeInTheDocument();
  });

  it("calls onToggle when row is clicked", () => {
    const onToggle = jest.fn();
    render(<RestaurantRow restaurant={restaurant} category={category} checked={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByText("Sushi Bar"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renders the checkbox in checked state", () => {
    render(<RestaurantRow restaurant={restaurant} category={category} checked onToggle={jest.fn()} />);
    expect(screen.getByText("✓")).toBeInTheDocument();
  });
});

// ─── NamePill ─────────────────────────────────────────────────────────────────

describe("NamePill", () => {
  it("renders the name text", () => {
    render(<NamePill name="Pad Thai" onRemove={jest.fn()} />);
    expect(screen.getByText("Pad Thai")).toBeInTheDocument();
  });

  it("renders the remove button", () => {
    render(<NamePill name="Pad Thai" onRemove={jest.fn()} />);
    expect(screen.getByTitle("Remove Pad Thai")).toBeInTheDocument();
  });

  it("calls onRemove when × is clicked", () => {
    const onRemove = jest.fn();
    render(<NamePill name="Pad Thai" onRemove={onRemove} />);
    fireEvent.click(screen.getByTitle("Remove Pad Thai"));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("sets title attribute on name span for truncated long names", () => {
    render(<NamePill name="A Very Long Restaurant Name Indeed" onRemove={jest.fn()} />);
    expect(screen.getByTitle("A Very Long Restaurant Name Indeed")).toBeInTheDocument();
  });
});
