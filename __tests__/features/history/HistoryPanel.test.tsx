/**
 * @file HistoryPanel.test.tsx
 * Unit tests for the HistoryPanel component.
 *
 * Covers: empty state, populated state (medal rendering, entry content),
 * Clear button visibility, and clearing callback.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import HistoryPanel from "@/src/features/history/HistoryPanel";
import type { HistoryEntry } from "@/src/types";

const makeHistory = (count = 3): HistoryEntry[] =>
  Array.from({ length: count }, (_, i) => ({
    name: `Restaurant ${i + 1}`,
    time: `0${i + 1}/01/2025, 12:00:00`,
  }));

describe("HistoryPanel — empty state", () => {
  it("renders the empty state message when history is empty", () => {
    render(<HistoryPanel history={[]} onClear={jest.fn()} />);
    expect(screen.getByText(/No history yet/i)).toBeInTheDocument();
  });

  it("does not render the Clear button when history is empty", () => {
    render(<HistoryPanel history={[]} onClear={jest.fn()} />);
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });
});

describe("HistoryPanel — populated state", () => {
  it("renders the correct number of history entries", () => {
    const history = makeHistory(4);
    render(<HistoryPanel history={history} onClear={jest.fn()} />);
    history.forEach(h => {
      expect(screen.getByText(h.name)).toBeInTheDocument();
    });
  });

  it("renders medal emojis for first three entries", () => {
    const history = makeHistory(3);
    render(<HistoryPanel history={history} onClear={jest.fn()} />);
    expect(screen.getByText("🥇")).toBeInTheDocument();
    expect(screen.getByText("🥈")).toBeInTheDocument();
    expect(screen.getByText("🥉")).toBeInTheDocument();
  });

  it("renders the time string for each entry", () => {
    const history = makeHistory(2);
    render(<HistoryPanel history={history} onClear={jest.fn()} />);
    history.forEach(h => {
      expect(screen.getByText(h.time)).toBeInTheDocument();
    });
  });

  it("shows the Clear button when history is non-empty", () => {
    render(<HistoryPanel history={makeHistory(1)} onClear={jest.fn()} />);
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("calls onClear when the Clear button is clicked", () => {
    const onClear = jest.fn();
    render(<HistoryPanel history={makeHistory(2)} onClear={onClear} />);
    fireEvent.click(screen.getByText("Clear"));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("renders numbered rank labels (#1, #2 …)", () => {
    const history = makeHistory(3);
    render(<HistoryPanel history={history} onClear={jest.fn()} />);
    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
    expect(screen.getByText("#3")).toBeInTheDocument();
  });

  it("renders heading 'Past picks'", () => {
    render(<HistoryPanel history={makeHistory(1)} onClear={jest.fn()} />);
    expect(screen.getByText("Past picks")).toBeInTheDocument();
  });
});
