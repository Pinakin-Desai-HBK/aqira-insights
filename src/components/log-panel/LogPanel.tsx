import { DataGrid, GridFilterAltIcon, GridToolbarContainer } from "@mui/x-data-grid";
import logMessageColumns from "./logMessageColumns";
import LogPanelColumnMenu from "./LogPanelColumnMenu";
import LogPanelTitleBar from "./LogPanelTitleBar";
import { useEffect } from "react";
import LogPanelFooter from "./LogPanelFooter";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAppSelector } from "src/redux/hooks/hooks";
import { selectStore_UI_LogPanel_LogMessages } from "src/redux/slices/ui/logPanel/logPanelSlice";
import { useGetLogMessagesQuery } from "src/redux/api/appApi";
import { GridToolbarFilterButton } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";

const LogPanel = () => {
  const theme = useTheme();
  const panelTheme = theme.palette.panelLog;
  //const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const { error: getLogMessagesError, isError: isGetLogMessagesError } = useGetLogMessagesQuery();
  const logMessages = useAppSelector(selectStore_UI_LogPanel_LogMessages);

  useEffect(() => {
    if (isGetLogMessagesError) {
      console.log(`getLogMessagesError: ${getLogMessagesError}`);
    }
  }, [getLogMessagesError, isGetLogMessagesError]);

  return (
    <Box
      id="AI-log"
      style={{
        backgroundColor: panelTheme.background,
        height: "100%",
        width: "100%",
        overflow: "hidden",
        padding: "5px",
        paddingTop: "0px",
        border: "1px solid #00457B",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <LogPanelTitleBar />
      <div style={{ height: "100%", width: "100%", minHeight: "0px", minWidth: "0px" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DataGrid
            localeText={{
              toolbarFilters: ""
            }}
            rows={logMessages}
            columns={logMessageColumns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 20
                }
              }
            }}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            checkboxSelection={false}
            disableRowSelectionOnClick={true}
            disableColumnSorting={false}
            disableColumnResize={false}
            rowHeight={25}
            scrollbarSize={5}
            columnHeaderHeight={30}
            showCellVerticalBorder={false}
            getRowHeight={() => "auto"}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even AI-log-row" : "odd AI-log-row"
            }
            slots={{
              columnMenu: LogPanelColumnMenu,
              footer: LogPanelFooter,
              toolbar: () => (
                <GridToolbarContainer>
                  <Box sx={{ flexGrow: 1 }} />
                  <GridToolbarFilterButton
                    slotProps={{
                      tooltip: { title: "Filter" },
                      button: {
                        color: "primary",
                        startIcon: <GridFilterAltIcon data-testid="AI-log-panel-filter-button" />,
                        sx: {
                          borderRadius: "50%",
                          minWidth: "28px",
                          "& .MuiTouchRipple-root": { width: "28px" },
                          "& span": { margin: 0 }
                        }
                      }
                    }}
                  />
                </GridToolbarContainer>
              ),
              noRowsOverlay: () => (
                <Box data-testid="AI-log-panel-no-messages" sx={{ height: "100%", alignContent: "center" }}>
                  No log messages
                </Box>
              ),
              noResultsOverlay: () => (
                <Box data-testid="AI-log-panel-no-results" sx={{ height: "100%", alignContent: "center" }}>
                  No log messages match the specified filters
                </Box>
              )
            }}
            slotProps={{
              panel: {
                placement: "bottom-end"
              }
            }}
          />
        </LocalizationProvider>
      </div>
    </Box>
  );
};

export default LogPanel;
