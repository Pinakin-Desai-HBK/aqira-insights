import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { LocalStorage } from "../../../enums/enums";
import FileDialog from "../dialogs/FileDialog";
import AppTestWrapper from "vite-test/AppTestWrapper";
import { FileBrowserAction, FileSystemContentFileFilter } from "src/insights/redux/types/ui/fileBrowser";

const doRender = (
  action: FileBrowserAction = FileBrowserAction.OpenFile
): { container: HTMLElement; onCloseMock: Mock; onConfirmMock: Mock } => {
  const onCloseMock = vi.fn();
  const onConfirmMock = vi.fn();

  const { container } = render(
    <AppTestWrapper>
      <FileDialog
        action={action}
        confirmButtonText="Select"
        contentFileFilter={FileSystemContentFileFilter.DataExplorer}
        nameInputLabel="File name"
        title="Select file"
        onCancel={onCloseMock}
        onOk={onConfirmMock}
      />
    </AppTestWrapper>
  );

  return { container, onCloseMock, onConfirmMock };
};

describe("FileBrowser", () => {
  beforeEach(() => {
    localStorage.removeItem(LocalStorage.FileBrowserSelectedFolder);
  });

  describe("Title Bar", () => {
    let onCloseMock: Mock;

    beforeEach(async () => {
      await waitFor(() => {
        const data = doRender();
        onCloseMock = data.onCloseMock;
      });
    });

    it("should show the correct title", async () => {
      expect(screen.getByTestId("AI-file-dialog-title").innerHTML).toEqual("Select file");
    });

    it("should have a close button in the title bar", () => {
      expect(screen.getByTestId("AI-file-dialog-close-button")).not.toBeNull();
    });

    it("should call onClose when the close button is clicked", () => {
      const titleBarClose = screen.getByTestId("AI-file-dialog-close-button");
      fireEvent.click(titleBarClose, { bubbles: true, cancelable: true });

      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  describe("Address Bar", () => {
    it("should show the path to the selected folder", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-address-bar-item-C:")).toBeInTheDocument();

      const addressBarItemsText = screen
        .getAllByTestId(/AI-file-browser-address-bar-item-.*/)
        .map((item) => item.innerHTML);

      expect(addressBarItemsText).toEqual(["This PC", "C:"]);
    });

    it("should show the contents of an item when it is clicked", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-address-bar-item-C:")).toBeInTheDocument();

      const addressBarItem = screen.getByTestId("AI-file-browser-address-bar-item-This PC");
      fireEvent.click(addressBarItem, { bubbles: true, cancelable: true });

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-C:\\")).toBeInTheDocument();

      const fileListItemsText = screen
        .getAllByTestId(/AI-file-browser-file-list-item-label-.*/)
        .map((item) => item.innerHTML);

      expect(fileListItemsText).toEqual(["C:\\", "K:\\"]);
    });
  });

  describe("Navigation Pane", () => {
    it("should initially show the folders in the root", async () => {
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-navigation-pane-item-label-C:\\")).toBeInTheDocument();

      const navigationPaneItemsText = screen
        .getAllByTestId(/AI-navigation-pane-item-label-.*/)
        .map((item) => item.innerHTML);

      expect(navigationPaneItemsText).toEqual(["This PC", "C:\\", "K:\\"]);
    });

    it("should initially show the folders in the last selected folder", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-navigation-pane-item-label-HBK")).toBeInTheDocument();

      const navigationPaneItemsText = screen
        .queryAllByTestId(/AI-navigation-pane-item-label-.*/)
        .map((item) => item.innerHTML);

      expect(navigationPaneItemsText).toEqual(["This PC", "C:\\", "HBK", "MDM", "K:\\"]);
    });

    it("should initially show the folders in the root after last selected folder renamed", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\Renamed");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-navigation-pane-item-label-C:\\")).toBeInTheDocument();

      const navigationPaneItemsText = screen
        .getAllByTestId(/AI-navigation-pane-item-label-.*/)
        .map((item) => item.innerHTML);

      expect(navigationPaneItemsText).toEqual(["This PC", "C:\\", "K:\\"]);
    });

    it("should initially show the folders in the root after last selected folder deleted", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\Deleted");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-navigation-pane-item-label-C:\\")).toBeInTheDocument();

      const navigationPaneItemsText = screen
        .getAllByTestId(/AI-navigation-pane-item-label-.*/)
        .map((item) => item.innerHTML);

      expect(navigationPaneItemsText).toEqual(["This PC", "C:\\", "K:\\"]);
    });

    it("should not update the name input after selecting a folder in file action mode", async () => {
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-navigation-pane-item-label-C:\\")).toBeInTheDocument();

      const folder = screen.getByTestId("AI-navigation-pane-item-label-C:\\");
      await act(async () => {
        fireEvent.click(folder, { bubbles: true, cancelable: true });
      });

      const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;
      expect(nameInput.value).toEqual("");
    });

    it("should update the name input after selecting a folder in folder action mode", async () => {
      await waitFor(() => doRender(FileBrowserAction.OpenFolder));

      expect(await screen.findByTestId("AI-navigation-pane-item-label-C:\\")).toBeInTheDocument();

      const folder = screen.getByTestId("AI-navigation-pane-item-label-C:\\");
      await act(async () => {
        fireEvent.click(folder, { bubbles: true, cancelable: true });
      });

      const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;
      expect(nameInput.value).toEqual("C:");
    });

    it("should show child folders after expanding a folder", async () => {
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-navigation-pane-item-label-C:\\")).toBeInTheDocument();

      const folderExpand = screen.getByTestId("AI-navigation-pane-item-expand-C:\\");
      fireEvent.click(folderExpand, { bubbles: true, cancelable: true });

      expect(await screen.findByTestId("AI-navigation-pane-item-label-HBK")).toBeInTheDocument();

      const navigationPaneItemsText = screen
        .getAllByTestId(/AI-navigation-pane-item-label-.*/)
        .map((item) => item.innerHTML);

      expect(navigationPaneItemsText).toEqual(["This PC", "C:\\", "HBK", "MDM", "K:\\"]);
    });
  });

  describe("File list", () => {
    it("should initially show the correct files", async () => {
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-C:\\")).toBeInTheDocument();

      const fileListItemsText = screen
        .getAllByTestId(/AI-file-browser-file-list-item-label-.*/)
        .map((item) => item.innerHTML);

      expect(fileListItemsText).toEqual(["C:\\", "K:\\"]);
    });

    it("should initially show the files in the last selected folder", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-HBK")).toBeInTheDocument();

      const fileListItemsText = screen
        .getAllByTestId(/AI-file-browser-file-list-item-label-.*/)
        .map((item) => item.innerHTML);

      expect(fileListItemsText).toEqual(["HBK", "MDM", "abc.apj", "xyz.apj"]);
    });

    it("should show the correct files if the last selected folder is renamed", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\Renamed");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-C:\\")).toBeInTheDocument();

      const fileListItemsText = screen
        .getAllByTestId(/AI-file-browser-file-list-item-label-.*/)
        .map((item) => item.innerHTML);

      expect(fileListItemsText).toEqual(["C:\\", "K:\\"]);
    });

    it("should show the correct files if the last selected folder is deleted", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\Deleted");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-C:\\")).toBeInTheDocument();

      const fileListItemsText = screen
        .getAllByTestId(/AI-file-browser-file-list-item-label-.*/)
        .map((item) => item.innerHTML);

      expect(fileListItemsText).toEqual(["C:\\", "K:\\"]);
    });

    it("should update the name input after selecting a file", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-abc.apj")).toBeInTheDocument();

      const file = screen.getByTestId("AI-file-browser-file-list-item-label-abc.apj");
      await act(async () => {
        fireEvent.click(file, { bubbles: true, cancelable: true });
      });

      const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;
      expect(nameInput.value).toEqual("abc.apj");
    });

    it("should call onClose after double clicking a file", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      const { onCloseMock } = await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-abc.apj")).toBeInTheDocument();

      const file = screen.getByTestId("AI-file-browser-file-list-item-label-abc.apj");
      fireEvent.dblClick(file, { bubbles: true, cancelable: true });

      expect(onCloseMock).toHaveBeenCalled();
    });

    it("should not update the name input after selecting a folder in file action mode", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-HBK")).toBeInTheDocument();

      const file = screen.getByTestId("AI-file-browser-file-list-item-label-HBK");
      await act(async () => {
        fireEvent.click(file, { bubbles: true, cancelable: true });
      });

      const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;
      expect(nameInput.value).toEqual("");
    });

    it("should update the name input after selecting a folder in folder action mode", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      await waitFor(() => doRender(FileBrowserAction.OpenFolder));

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-HBK")).toBeInTheDocument();

      const file = screen.getByTestId("AI-file-browser-file-list-item-label-HBK");
      await act(async () => fireEvent.click(file, { bubbles: true, cancelable: true }));

      const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;
      expect(nameInput.value).toEqual("HBK");
    });

    it("should call onClose after double clicking a folder", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      const { onCloseMock } = await waitFor(() => doRender(FileBrowserAction.OpenFolder));

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-HBK")).toBeInTheDocument();

      const file = screen.getByTestId("AI-file-browser-file-list-item-label-HBK");
      await act(async () => fireEvent.dblClick(file, { bubbles: true, cancelable: true }));

      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  describe("Name textfield", () => {
    it("should show an error message for an unknown file name when opening", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-abc.apj")).toBeInTheDocument();

      const file = screen.getByTestId("AI-file-browser-file-list-item-label-abc.apj");
      fireEvent.click(file, { bubbles: true, cancelable: true });

      const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;
      fireEvent.change(nameInput, { target: { value: "abcd.apj" } });

      const errorMessage = screen.getByTestId("AI-file-browser-name-textfield").querySelector("p")!;
      expect(errorMessage.innerHTML).toEqual("File (abcd.apj) does not exist");
    });
  });

  describe("Buttons", () => {
    it("should have Cancel button always enabled", async () => {
      await waitFor(() => doRender());

      const cancelButton = screen.getByTestId("AI-file-dialog-cancel-button");
      expect(cancelButton).not.toHaveAttribute("disabled");
    });

    it("should call onClose after clicking Cancel", async () => {
      const { onCloseMock } = await waitFor(() => doRender());
      const cancelButton = screen.getByTestId("AI-file-dialog-cancel-button");
      fireEvent.click(cancelButton);
      expect(onCloseMock).toHaveBeenCalled();
    });

    it("should have Confirm button disabled if the name input is empty", async () => {
      await waitFor(() => doRender());
      const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;
      fireEvent.change(nameInput, { target: { value: "" } });

      const confirmButton = screen.getByTestId("AI-file-dialog-confirm-button");
      expect(confirmButton).toHaveAttribute("disabled");
    });

    it("should have Confirm button enabled if the name input is not empty and there is no error", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-abc.apj")).toBeInTheDocument();

      const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;
      fireEvent.change(nameInput, { target: { value: "abc.apj" } });

      const confirmButton = screen.getByTestId("AI-file-dialog-confirm-button");
      expect(confirmButton).not.toHaveAttribute("disabled");
    });

    it("should call onConfirm after clicking Confirm", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      const { onConfirmMock } = await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-abc.apj")).toBeInTheDocument();

      const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;
      fireEvent.change(nameInput, { target: { value: "abc.apj" } });

      const confirmButton = screen.getByTestId("AI-file-dialog-confirm-button");
      fireEvent.click(confirmButton);
      expect(onConfirmMock).toHaveBeenCalled();
    });

    it("should have the correct Confirm button text", async () => {
      await waitFor(() => doRender());
      const confirmButton = screen.getByTestId("AI-file-dialog-confirm-button");
      expect(confirmButton.innerHTML).toEqual("Select");
    });

    it("should have Confirm button disabled if there is an input error", async () => {
      localStorage.setItem(LocalStorage.FileBrowserSelectedFolder, "C:\\");
      await waitFor(() => doRender());

      expect(await screen.findByTestId("AI-file-browser-file-list-item-label-abc.apj")).toBeInTheDocument();

      const nameInput = screen.getByTestId("AI-file-browser-name-textfield").querySelector("input")!;
      fireEvent.change(nameInput, { target: { value: "abc.apja" } });

      const confirmButton = screen.getByTestId("AI-file-dialog-confirm-button");
      expect(confirmButton).toHaveAttribute("disabled");
    });

    it("should have the correct name input label", async () => {
      await waitFor(() => doRender());
      const nameInputLabel = screen.getByTestId("AI-file-browser-name-input-label");
      expect(nameInputLabel.innerHTML).toEqual("File name:");
    });
  });
});
