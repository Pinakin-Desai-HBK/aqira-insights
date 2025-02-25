import { DataExplorerInformation } from "../information/DataExplorerInformation";
import { memo, useCallback, useMemo } from "react";
import { DataFileRow } from "../DataFileRow";
import { MatcherType } from "src/redux/types/ui/dataExplorer";
import { DataGroupItem } from "src/redux/types/ui/dataExplorer";
import { DataSelectionContextProvider } from "../group/DataSelectionContextProvider";
import { DataGroup } from "../group/DataGroup";
import { useDataItemActions } from "../group/useDataItemActions";
import { useAppSelector } from "src/redux/hooks/hooks";
import { make_selectStore_UI_DataPanel_ForDataFiles } from "src/redux/slices/ui/dataPanel/combinedSelectors";
import { useTheme } from "@mui/material";
import { DataExplorerOptionButton } from "../options/DataExplorerOptionButton";
import FolderIcon from "@mui/icons-material/Folder";
import { appLabels } from "src/consts/labels";
import useDataExplorer from "../useDataExplorer";
import { EmptySVG } from "./EmptySVG";

const enableContextMenu = false;

const labels = appLabels.DataExplorerOptions;

const DataExplorerDataFiles = memo(() => {
  const theme = useTheme();
  const dataFilesSelector = useMemo(make_selectStore_UI_DataPanel_ForDataFiles, []);
  const { noDataFilesInFolder, noFilteredDataFiles, folder, dataFilesGroupOpen, initialDataFiles, dataFiles } =
    useAppSelector(dataFilesSelector);

  const dataFileMatcher: MatcherType<DataGroupItem> = useCallback((itemA, itemB) => {
    if (itemA.item.type === "DataFile" && itemB.item.type === "DataFile") {
      return itemA.item.item.fullName === itemB.item.item.fullName;
    }
    return false;
  }, []);
  const { onSelectFolder } = useDataExplorer();

  const { menu, openMenu, openColumnDetails } = useDataItemActions({ folder });
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      return (
        <DataFileRow
          index={index}
          style={style}
          current={dataFiles[index]}
          openMenu={enableContextMenu ? openMenu : null}
          openColumnDetails={openColumnDetails}
        />
      );
    },
    [dataFiles, openMenu, openColumnDetails]
  );
  if (folder === "") {
    return (
      <div
        data-testid="AI-data-explorer-data-files-empty"
        style={{
          background: theme.palette.panelDataExplorer.itemsBackground,
          paddingTop: 10,
          paddingBottom: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          overflow: "auto",
          height: "100%"
        }}
      >
        <div style={{ minHeight: "195px", maxHeight: "300px", flexGrow: 1, flexShrink: 1 }}>
          <EmptySVG />
        </div>
        <DataExplorerInformation text="Please select a folder to import data files from" />
        <DataExplorerOptionButton id="empty-select" ariaLabel={labels.selectFolder} onClick={onSelectFolder}>
          <FolderIcon />
        </DataExplorerOptionButton>
      </div>
    );
  } else if (noDataFilesInFolder) {
    return <DataExplorerInformation text="No data files in folder" />;
  } else if (noFilteredDataFiles) {
    return <DataExplorerInformation text="No matching files" />;
  } else {
    return (
      <>
        <DataSelectionContextProvider enabled={true} location={folder} matcher={dataFileMatcher}>
          <DataGroup
            minHeight={Math.min(dataFiles.length, 1) * 30 + "px"}
            allGroupItems={initialDataFiles || []}
            groupItems={dataFiles}
            isOpen={dataFilesGroupOpen}
            Row={Row}
            testId="AI-data-explorer-group-dataFiles"
            listTestId="AI-data-explorer-files"
          />
        </DataSelectionContextProvider>
        {menu}
      </>
    );
  }
});

DataExplorerDataFiles.displayName = "DataExplorerDataFiles";

export default DataExplorerDataFiles;
