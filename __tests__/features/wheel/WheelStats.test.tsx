/**
 * @file WheelStats.test.tsx
 * Unit tests for the WheelStats component.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import WheelStats from "@/src/features/wheel/WheelStats";
import type { HistoryEntry } from "@/src/types";

const makeHistory = (names: string[]): HistoryEntry[] =>
  names.map(name => ({ name, time: "12:00" }));

describe("WheelStats", () => {
  it("renders nothing when names list is empty", () => {
    const { container } = render(<WheelStats names={[]} history={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders when names list is non-empty", () => {
    render(<WheelStats names={["Ramen"]} history={[]} />);
    expect(screen.getByText("Choices")).toBeInTheDocument();
  });

  it("shows the correct choice count", () => {
    render(<WheelStats names={["A", "B", "C"]} history={[]} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows the correct spin count", () => {
    const history = makeHistory(["A", "B"]);
    render(<WheelStats names={["X"]} history={history} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows 'Last pick' label when history is non-empty", () => {
    render(<WheelStats names={["X"]} history={makeHistory(["Sushi"])} />);
    expect(screen.getByText("Last pick")).toBeInTheDocument();
    expect(screen.getByText("Sushi")).toBeInTheDocument();
  });

  it("does not show 'Last pick' when history is empty", () => {
    render(<WheelStats names={["X"]} history={[]} />);
    expect(screen.queryByText("Last pick")).not.toBeInTheDocument();
  });

  it("shows the most recent pick (first history entry)", () => {
    const history = makeHistory(["OldPick", "NewPick"]);
    // history[0] is the latest
    render(<WheelStats names={["X"]} history={history} />);
    expect(screen.getByText("OldPick")).toBeInTheDocument();
  });
});
