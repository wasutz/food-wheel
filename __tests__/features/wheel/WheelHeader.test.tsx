/**
 * @file WheelHeader.test.tsx
 * Unit tests for the WheelHeader component.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WheelHeader from "@/src/features/wheel/WheelHeader";
import appConfig from "@/src/config/app.config.json";


describe("WheelHeader", () => {
  it("renders the app title from config", () => {
    render(<WheelHeader onSort={jest.fn()} onShuffle={jest.fn()} />);
    // Title is loaded from app.config.json
    expect(screen.getByText(appConfig.app.title)).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<WheelHeader onSort={jest.fn()} onShuffle={jest.fn()} />);
    expect(screen.getByText(appConfig.app.subtitle)).toBeInTheDocument();
  });

  it("renders the A–Z sort button", () => {
    render(<WheelHeader onSort={jest.fn()} onShuffle={jest.fn()} />);
    expect(screen.getByText(/Sort/)).toBeInTheDocument();
  });

  it("renders the Mix shuffle button", () => {
    render(<WheelHeader onSort={jest.fn()} onShuffle={jest.fn()} />);
    expect(screen.getByText(/Shuffle/)).toBeInTheDocument();
  });

  it("calls onSort when A–Z is clicked", () => {
    const onSort = jest.fn();
    render(<WheelHeader onSort={onSort} onShuffle={jest.fn()} />);
    fireEvent.click(screen.getByText(/Sort/));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it("calls onShuffle when Mix is clicked", () => {
    const onShuffle = jest.fn();
    render(<WheelHeader onSort={jest.fn()} onShuffle={onShuffle} />);
    fireEvent.click(screen.getByText(/Shuffle/));
    expect(onShuffle).toHaveBeenCalledTimes(1);
  });
});
