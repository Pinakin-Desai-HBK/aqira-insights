import { FileBrowserAddressBar } from "../file-browser-parts/address-bar/FileBrowserAddressBar";
import { FileBrowserNavigationPane } from "../file-browser-parts/navigation-pane/FileBrowserNavigationPane";
import { FileBrowserFileList } from "../file-browser-parts/file-list/FileBrowserFileList";
import { FileBrowserNameInput } from "../file-browser-parts/name-input/FileBrowserNameInput";
import { DialogFileBrowserParams } from "src/redux/types/ui/fileBrowser";
import useTheme from "@mui/material/styles/useTheme";
import Stack from "@mui/material/Stack";

export const DialogFileBrowser = (props: DialogFileBrowserParams) => {
  const theme = useTheme();
  const {
    nameInputLabel,
    fileListSelectedIndex,
    nameInputErrorMessage,
    nameInputValue,
    navigationPaneTree,
    navigationPaneTreeExpanded,
    navigationPaneTreeSelectedFolder,
    selectedFolder,
    handleConfirm,
    handleFileListClick,
    handleFileListDoubleClick,
    handleInputValueChange,
    handleNavigationPaneItemExpansion,
    handleNavigationPaneItemSelection,
    handleNewPath,
    handlePathPartSelection
  } = props;
  return (
    <Stack data-testid="AI-dialog-file-browser" sx={{ height: "50vh", width: "100%" }}>
      <FileBrowserAddressBar
        selectedFolder={selectedFolder}
        handlePathPartSelection={handlePathPartSelection}
        handleNewPath={handleNewPath}
      />
      <Stack
        direction="row"
        borderTop={"1px solid"}
        borderBottom={"1px solid"}
        borderColor={theme.palette.fileBrowser.border}
        height={1}
        overflow="auto"
      >
        <FileBrowserNavigationPane
          items={navigationPaneTree}
          expandedItems={navigationPaneTreeExpanded}
          selectedItems={navigationPaneTreeSelectedFolder}
          handleItemExpansion={handleNavigationPaneItemExpansion}
          handleItemSelection={handleNavigationPaneItemSelection}
        />
        <FileBrowserFileList
          selectedIndex={fileListSelectedIndex}
          selectedFolder={selectedFolder}
          handleDoubleClick={handleFileListDoubleClick}
          handleClick={handleFileListClick}
        />
      </Stack>
      <FileBrowserNameInput
        errorMessage={nameInputErrorMessage}
        label={nameInputLabel}
        value={nameInputValue}
        handleConfirm={handleConfirm}
        onChange={handleInputValueChange}
      />
    </Stack>
  );
};
