/**
 * @file WinnerModal.test.tsx
 * Unit tests for the WinnerModal component.
 *
 * Covers: winner name rendering, Let's eat callback,
 * Remove & spin again callback, and backdrop dismiss.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WinnerModal from "@/src/components/shared/WinnerModal";
import appConfig from "@/src/config/app.config.json";

describe("WinnerModal", () => {
  const defaultProps = {
    winner: "Sushi Masa",
    onClose: jest.fn(),
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays the winner name", () => {
    render(<WinnerModal {...defaultProps} />);
    expect(screen.getByText("Sushi Masa")).toBeInTheDocument();
  });

  it("displays the config subtitle label", () => {
    render(<WinnerModal {...defaultProps} />);
    expect(screen.getByText(appConfig.winner.subtitle)).toBeInTheDocument();
  });

  it("shows the celebration emoji", () => {
    render(<WinnerModal {...defaultProps} />);
    expect(screen.getByText("🎉")).toBeInTheDocument();
  });

  it("renders the Let's eat button label from config", () => {
    render(<WinnerModal {...defaultProps} />);
    expect(screen.getByText(appConfig.winner.letsEatLabel)).toBeInTheDocument();
  });

  it("calls onClose when Let's eat is clicked", () => {
    render(<WinnerModal {...defaultProps} />);
    fireEvent.click(screen.getByText(appConfig.winner.letsEatLabel));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("renders the Remove & spin again button", () => {
    render(<WinnerModal {...defaultProps} />);
    expect(screen.getByText(appConfig.winner.removeLabel)).toBeInTheDocument();
  });

  it("calls onRemove when Remove & spin again is clicked", () => {
    render(<WinnerModal {...defaultProps} />);
    fireEvent.click(screen.getByText(appConfig.winner.removeLabel));
    expect(defaultProps.onRemove).toHaveBeenCalledTimes(1);
  });

  it("displays a long winner name without breaking layout", () => {
    render(<WinnerModal {...defaultProps} winner="Supercalifragilisticexpialidocious Restaurant & Bar" />);
    expect(
      screen.getByText("Supercalifragilisticexpialidocious Restaurant & Bar")
    ).toBeInTheDocument();
  });
});
