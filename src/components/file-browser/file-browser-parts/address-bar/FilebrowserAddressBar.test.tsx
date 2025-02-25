import { Mock, describe, expect, it, vi } from "vitest";
import { FileBrowserAddressBar } from "./FileBrowserAddressBar";
import { mockNavigationPaneData } from "../../../../../vite-test/mock-data/mock-navigation-pane-tree-data";
import { fireEvent, render, screen } from "@testing-library/react";
import { themeAILight } from "../../../../redux/types/ui/themes";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

const doRender = (): { container: HTMLElement; handleNewPath: Mock; handlePathPartSelection: Mock } => {
  const handlePathPartSelection = vi.fn();
  const handleNewPath = vi.fn();

  const { container } = render(
    <ThemeProvider theme={themeAILight}>
      <FileBrowserAddressBar
        selectedFolder={{ folder: mockNavigationPaneData, path: ["This PC", "C:"] }}
        handlePathPartSelection={handlePathPartSelection}
        handleNewPath={handleNewPath}
      ></FileBrowserAddressBar>
    </ThemeProvider>
  );

  return {
    container,
    handleNewPath,
    handlePathPartSelection
  };
};

describe("FileBrowserAddressBar", () => {
  it("should call handlePathPartSelection when a path item is clicked", () => {
    const { handlePathPartSelection } = doRender();

    const addressBarItem = screen.getByTestId("AI-file-browser-address-bar-item-This PC");
    fireEvent.click(addressBarItem, { bubbles: true, cancelable: true });

    expect(handlePathPartSelection).toHaveBeenCalledWith(0);
  });

  it("should show the new path input when clicking in the address bar", () => {
    doRender();

    const addressBar = screen.getByTestId("AI-file-browser-address-bar");
    fireEvent.click(addressBar, { bubbles: true, cancelable: true });

    expect(screen.getByTestId("AI-file-browser-path-input")).not.toBeUndefined();
  });

  it("should set new path input with the correct value when clicking in the address bar", () => {
    doRender();

    const addressBar = screen.getByTestId("AI-file-browser-address-bar");
    fireEvent.click(addressBar, { bubbles: true, cancelable: true });

    const pathInput = screen.getByTestId("AI-file-browser-path-input");
    expect(pathInput).toHaveValue("C:");
  });

  it("should show the address bar after clicking away from the new path input", () => {
    doRender();

    const addressBar = screen.getByTestId("AI-file-browser-address-bar");
    fireEvent.click(addressBar, { bubbles: true, cancelable: true });

    const pathInput = screen.getByTestId("AI-file-browser-path-input");
    fireEvent.blur(pathInput);

    expect(screen.getByTestId("AI-file-browser-address-bar")).not.toBeUndefined();
  });

  it("should call handleNewPath when a new path is entered", () => {
    const { handleNewPath } = doRender();

    const addressBar = screen.getByTestId("AI-file-browser-address-bar");
    fireEvent.click(addressBar, { bubbles: true, cancelable: true });

    const pathInput = screen.getByTestId("AI-file-browser-path-input");
    fireEvent.keyDown(pathInput, { key: "Enter", code: "Enter", charCode: 13 });

    expect(handleNewPath).toHaveBeenCalledWith("C:");
  });
});
