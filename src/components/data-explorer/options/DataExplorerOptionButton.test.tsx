import { render, screen, fireEvent } from "@testing-library/react";
import { DataExplorerOptionButton } from "./DataExplorerOptionButton";
import { describe, expect, it, vi } from "vitest";

const ariaLabel = "Refresh";
const id = "Refresh";

describe("DataExplorerOptionButton", () => {
  it("renders button with correct aria label", () => {
    render(
      <DataExplorerOptionButton ariaLabel={ariaLabel} id={id} onClick={vi.fn()}>
        Refresh
      </DataExplorerOptionButton>
    );

    const button = screen.getByRole("button", { name: ariaLabel });
    expect(button).toBeInTheDocument();
  });

  it("renders button with correct data testid", () => {
    render(
      <DataExplorerOptionButton ariaLabel={ariaLabel} id={id} onClick={vi.fn()}>
        Refresh
      </DataExplorerOptionButton>
    );

    const button = screen.getByTestId(`AI-data-explorer-option-${id}`);
    expect(button).toBeInTheDocument();
  });

  it("calls onClick handler when button is clicked", () => {
    const onClick = vi.fn();
    render(
      <DataExplorerOptionButton ariaLabel={ariaLabel} id={id} onClick={onClick}>
        Refresh
      </DataExplorerOptionButton>
    );

    const button = screen.getByRole("button", { name: ariaLabel });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
