import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Close from "@mui/icons-material/Close";
import { useAppDispatch } from "src/react/redux/hooks/hooks";
import { uiLogPanel_toggle } from "src/react/redux/slices/ui/logPanel/logPanelSlice";

const LogPanelTitleBar = () => {
  const appDispatch = useAppDispatch();

  return (
    <Box
      id="AI-log-header"
      style={{
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        minHeight: "32px"
      }}
    >
      <Typography
        variant="h6"
        style={{
          textAlign: "left",
          flexGrow: "1",
          justifyContent: "flex-start",
          display: "flex",
          alignItems: "center"
        }}
      >
        Log
      </Typography>
      <IconButton
        data-testid={`AI-log-panel-close-button`}
        sx={{ color: "text.primary", padding: "0", width: "24px", height: "24px", top: "4px" }}
        onClick={() => appDispatch(uiLogPanel_toggle())}
      >
        <Close sx={{ color: "#00457B" }} />
      </IconButton>
    </Box>
  );
};

export default LogPanelTitleBar;
