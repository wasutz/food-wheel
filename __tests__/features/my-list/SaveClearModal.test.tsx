/**
 * @file SaveClearModal.test.tsx
 * Unit tests for the SaveClearModal component.
 *
 * Covers: render per modal type, callbacks (onSaveConfirm, onClearConfirm,
 * onClose), keyboard interactions (Enter / Escape), and the Rules-of-Hooks
 * fix (modal=null should not crash).
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SaveClearModal from "@/src/features/my-list/SaveClearModal";
import type { ModalState } from "@/src/types";

const defaultProps = {
  itemCount:     3,
  inputValue:    "My List",
  onInputChange: jest.fn(),
  onSaveConfirm: jest.fn(),
  onClearConfirm: jest.fn(),
  onClose:       jest.fn(),
};

beforeEach(() => jest.clearAllMocks());

describe("SaveClearModal — modal=null", () => {
  it("renders nothing when modal is null", () => {
    const { container } = render(<SaveClearModal {...defaultProps} modal={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("does not throw when modal is null (Rules-of-Hooks fix)", () => {
    expect(() =>
      render(<SaveClearModal {...defaultProps} modal={null} />)
    ).not.toThrow();
  });
});

describe("SaveClearModal — save-prompt", () => {
  const modal: ModalState = { type: "save-prompt" };

  it("renders the title 'Save this list'", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.getByText("Save this list")).toBeInTheDocument();
  });

  it("renders the item count in the subtitle", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.getByText(/3 restaurants will be saved/i)).toBeInTheDocument();
  });

  it("renders the name input", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders Cancel and Save list buttons", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save list")).toBeInTheDocument();
  });

  it("calls onSaveConfirm with inputValue when Save list is clicked", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} inputValue="Friday Picks" />);
    fireEvent.click(screen.getByText("Save list"));
    expect(defaultProps.onSaveConfirm).toHaveBeenCalledWith("Friday Picks");
  });

  it("calls onClose when Cancel is clicked", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("Save list button is disabled when inputValue is empty", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} inputValue="" />);
    expect(screen.getByText("Save list").closest("button")).toBeDisabled();
  });

  it("Save list button is disabled when inputValue is whitespace only", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} inputValue="   " />);
    expect(screen.getByText("Save list").closest("button")).toBeDisabled();
  });
});

describe("SaveClearModal — save-success", () => {
  const modal: ModalState = { type: "save-success", listName: "Friday Picks" };

  it("renders 'List saved!' title", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.getByText("List saved!")).toBeInTheDocument();
  });

  it("includes the list name in the subtitle", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.getByText(/"Friday Picks" saved to your collection./)).toBeInTheDocument();
  });

  it("renders 'Done' button", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("calls onClose when Done is clicked", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    fireEvent.click(screen.getByText("Done"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render Cancel button", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
  });
});

describe("SaveClearModal — clear-confirm", () => {
  const modal: ModalState = { type: "clear-confirm" };

  it("renders 'Clear all restaurants?' title", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.getByText("Clear all restaurants?")).toBeInTheDocument();
  });

  it("renders the item count in the subtitle", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} itemCount={5} />);
    expect(screen.getByText(/remove all 5 restaurants/i)).toBeInTheDocument();
  });

  it("renders Cancel and 'Yes, clear all' buttons", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Yes, clear all")).toBeInTheDocument();
  });

  it("calls onClearConfirm when 'Yes, clear all' is clicked", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    fireEvent.click(screen.getByText("Yes, clear all"));
    expect(defaultProps.onClearConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Cancel is clicked", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});

describe("SaveClearModal — clear-success", () => {
  const modal: ModalState = { type: "clear-success" };

  it("renders 'Wheel cleared' title", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.getByText("Wheel cleared")).toBeInTheDocument();
  });

  it("renders 'Got it' button", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    expect(screen.getByText("Got it")).toBeInTheDocument();
  });

  it("calls onClose when Got it is clicked", () => {
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    fireEvent.click(screen.getByText("Got it"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});

describe("SaveClearModal — keyboard interactions", () => {
  it("calls onClose on Escape key press", () => {
    const modal: ModalState = { type: "save-prompt" };
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onSaveConfirm on Enter key when type=save-prompt", () => {
    const modal: ModalState = { type: "save-prompt" };
    render(<SaveClearModal {...defaultProps} modal={modal} inputValue="My Picks" />);
    fireEvent.keyDown(window, { key: "Enter" });
    expect(defaultProps.onSaveConfirm).toHaveBeenCalledWith("My Picks");
  });

  it("does NOT call onSaveConfirm on Enter when type=clear-confirm", () => {
    const modal: ModalState = { type: "clear-confirm" };
    render(<SaveClearModal {...defaultProps} modal={modal} />);
    fireEvent.keyDown(window, { key: "Enter" });
    expect(defaultProps.onSaveConfirm).not.toHaveBeenCalled();
  });
});
