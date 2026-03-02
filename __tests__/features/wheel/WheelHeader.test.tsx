/**
 * @file WheelHeader.test.tsx
 * Unit tests for the WheelHeader component.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WheelHeader from "@/src/features/wheel/WheelHeader";

describe("WheelHeader", () => {
  it("renders the app title from config", () => {
    render(<WheelHeader onSort={jest.fn()} onShuffle={jest.fn()} />);
    // Title is loaded from app.config.json
    expect(screen.getByText("กินอะไรดี?")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<WheelHeader onSort={jest.fn()} onShuffle={jest.fn()} />);
    expect(screen.getByText(/Spin to Eat/i)).toBeInTheDocument();
  });

  it("renders the A–Z sort button", () => {
    render(<WheelHeader onSort={jest.fn()} onShuffle={jest.fn()} />);
    expect(screen.getByText(/A–Z/)).toBeInTheDocument();
  });

  it("renders the Mix shuffle button", () => {
    render(<WheelHeader onSort={jest.fn()} onShuffle={jest.fn()} />);
    expect(screen.getByText(/Mix/)).toBeInTheDocument();
  });

  it("calls onSort when A–Z is clicked", () => {
    const onSort = jest.fn();
    render(<WheelHeader onSort={onSort} onShuffle={jest.fn()} />);
    fireEvent.click(screen.getByText(/A–Z/));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it("calls onShuffle when Mix is clicked", () => {
    const onShuffle = jest.fn();
    render(<WheelHeader onSort={jest.fn()} onShuffle={onShuffle} />);
    fireEvent.click(screen.getByText(/Mix/));
    expect(onShuffle).toHaveBeenCalledTimes(1);
  });
});
