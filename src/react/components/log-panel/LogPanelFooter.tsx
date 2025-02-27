import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { GridPagination } from "@mui/x-data-grid/components/GridPagination";
import { useClearLogMessagesMutation } from "src/react/redux/api/appApi";
import { useAppSelector } from "src/react/redux/hooks/hooks";
import { selectStore_UI_LogPanel_LogMessages } from "src/react/redux/slices/ui/logPanel/logPanelSlice";

const LogPanelFooter = () => {
  const logMessages = useAppSelector(selectStore_UI_LogPanel_LogMessages);
  const [clearLogMessagesMutation] = useClearLogMessagesMutation();

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#FFF",
        alignItems: "center",
        height: "42px"
      }}
    >
      <Box sx={{ display: "flex", padding: "5px" }}>
        <Button
          data-testid={`AI-log-panel-clear-all-button`}
          variant="text"
          onClick={() => clearLogMessagesMutation()}
          sx={{
            display: logMessages.length === 0 ? "none" : "flex",
            minWidth: 0,
            textTransform: "none",
            flexDirection: "row",
            height: "32px",
            alignItems: "center",
            border: "1px solid #DDD",
            whiteSpace: "nowrap"
          }}
        >
          Clear All
        </Button>
      </Box>
      <GridPagination />
    </Box>
  );
};

export default LogPanelFooter;
