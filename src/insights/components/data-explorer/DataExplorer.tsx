import Panel from "../panel/ContentPanel";
import Search from "../search/Search";
import useDataExplorer from "./useDataExplorer";
import DataExplorerDataFiles from "./items/DataExplorerDataFiles";
import { useAppSelector } from "src/insights/redux/hooks/hooks";
import { DataExplorerOptions } from "./options/DataExplorerOptions";
import { DataGroupHeader } from "./group/DataGroupHeader";
import DataExplorerDisplayNodes from "./items/DataExplorerDisplayNodes";
import { make_selectStore_UI_DataPanel_ForDataExplorer } from "src/insights/redux/slices/ui/dataPanel/combinedSelectors";
import { useMemo } from "react";
import { appLabels } from "src/insights/consts/labels";
import useTheme from "@mui/material/styles/useTheme";
import Box from "@mui/material/Box";

const labels = appLabels.DataExplorer;

const DataExplorer = () => {
  const theme = useTheme();
  const dataPanelSelector = useMemo(make_selectStore_UI_DataPanel_ForDataExplorer, []);
  const { displayNodes, noFilteredDisplayNodes, initialDisplayNodes, dataFilesGroupOpen, displayNodesGroupOpen } =
    useAppSelector(dataPanelSelector);
  const { onSearchText, onRefresh, onSort, onSelectFolder, setOpenGroup } = useDataExplorer();

  return (
    <Panel
      title={labels.data}
      background={theme.palette.panelDataExplorer.background}
      titleColor="text.secondary"
      sx={{ paddingRight: "1px" }}
      options={
        <DataExplorerOptions
          onRefresh={onRefresh}
          onSort={onSort}
          onSelectFolder={onSelectFolder}
          showSelectFolder={dataFilesGroupOpen}
        />
      }
    >
      <Box width={1} height="calc(100% - 44px)" display="flex" flexDirection="column">
        <Box sx={{ margin: "0 4px 8px" }}>
          <Search
            onSearchTextChange={onSearchText}
            placeholder={labels.search}
            themeSearch={theme.palette.searchDataExplorer}
            type="data"
          />
        </Box>
        <Box
          className="AI-data-explorer-container"
          height="calc(100% - 38px)"
          margin={1}
          display={"flex"}
          flexDirection={"column"}
          gap={"5px"}
        >
          <Box
            display="flex"
            flexDirection="row"
            sx={{
              gap: "5px"
            }}
          >
            <DataGroupHeader
              testId="AI-data-explorer-group-button-dataFiles"
              isOpen={dataFilesGroupOpen}
              title={labels.dataFiles}
              setOpenGroup={() => setOpenGroup(0)}
            />
            <DataGroupHeader
              testId="AI-data-explorer-group-button-networkDisplayNodes"
              isOpen={displayNodesGroupOpen}
              title={labels.displayNodes}
              setOpenGroup={() => setOpenGroup(1)}
            />
          </Box>
          {dataFilesGroupOpen ? <DataExplorerDataFiles /> : null}
          {displayNodesGroupOpen ? (
            <DataExplorerDisplayNodes
              noFilteredDisplayNodes={noFilteredDisplayNodes}
              displayNodesGroupOpen={displayNodesGroupOpen}
              displayNodeItems={displayNodes}
              initialDisplayNodesData={initialDisplayNodes || []}
            />
          ) : null}
        </Box>
      </Box>
    </Panel>
  );
};

export default DataExplorer;
