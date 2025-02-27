import { Mock, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { themeAILight } from "../../../../redux/types/ui/themes";
import { FileBrowserNavigationPane } from "./FileBrowserNavigationPane";
import { mockNavigationPaneData } from "../../../../../vite-test/mock-data/mock-navigation-pane-tree-data";
import { TreeViewBaseItem } from "@mui/x-tree-view";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

const doRender = (): { container: HTMLElement; handleItemExpansion: Mock; handleItemSelection: Mock } => {
  const handleItemExpansion = vi.fn();
  const handleItemSelection = vi.fn();

  const items: TreeViewBaseItem = mockNavigationPaneData;
  items.children![0]!.children![0]!.id! = "c8695c02-34d1-473d-8a60-e75a0a390565"; // Change this id so keys are different

  const { container } = render(
    <ThemeProvider theme={themeAILight}>
      <FileBrowserNavigationPane
        handleItemExpansion={handleItemExpansion}
        handleItemSelection={handleItemSelection}
        items={mockNavigationPaneData}
        expandedItems={["This PC"]}
        selectedItems={"This PC"}
      />
    </ThemeProvider>
  );

  return {
    container,
    handleItemExpansion,
    handleItemSelection
  };
};

describe("FileBrowserNavigationPane", () => {
  it("should call handleItemSelection with the correct value when an item is clicked", () => {
    const { handleItemSelection } = doRender();

    const folder = screen.getByTestId("AI-navigation-pane-item-label-C:\\");
    fireEvent.click(folder, { bubbles: true, cancelable: true });

    expect(handleItemSelection).toHaveBeenNthCalledWith(1, expect.anything(), "This PC", false);
    expect(handleItemSelection).toHaveBeenNthCalledWith(2, expect.anything(), "C:\\", true);
  });

  it("should call handleItemExpansion with the correct value when an item is clicked", () => {
    const { handleItemExpansion } = doRender();

    const folderExpand = screen.getByTestId("AI-navigation-pane-item-expand-C:\\");
    fireEvent.click(folderExpand, { bubbles: true, cancelable: true });

    expect(handleItemExpansion).toHaveBeenCalledWith(expect.anything(), "C:\\", true);
  });
});
