import { Mock, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FileBrowserFileList } from "./FileBrowserFileList";
import { mockNavigationPaneData } from "../../../../../vite-test/mock-data/mock-navigation-pane-tree-data";

const doRender = (): { container: HTMLElement; handleClick: Mock; handleDoubleClick: Mock } => {
  const handleClick = vi.fn();
  const handleDoubleClick = vi.fn();

  const { container } = render(
    <FileBrowserFileList
      selectedIndex={0}
      selectedFolder={{ folder: mockNavigationPaneData, path: ["This PC"] }}
      handleClick={handleClick}
      handleDoubleClick={handleDoubleClick}
    />
  );

  return {
    container,
    handleClick,
    handleDoubleClick
  };
};

describe("FileBrowserFileList", () => {
  it("should call handleClick when an item is clicked", () => {
    const { handleClick } = doRender();

    const item = screen.getByTestId("AI-file-browser-file-list-item-label-C:\\");
    fireEvent.click(item, { bubbles: true, cancelable: true });

    expect(handleClick).toHaveBeenCalled();
  });

  it("should call handleDoubleClick when an item is double clicked", () => {
    const { handleDoubleClick } = doRender();

    const item = screen.getByTestId("AI-file-browser-file-list-item-label-C:\\");
    fireEvent.dblClick(item, { bubbles: true, cancelable: true });

    expect(handleDoubleClick).toHaveBeenCalled();
  });
});
