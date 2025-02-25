import { Box, CircularProgress, Typography } from "@mui/material";
import { appLabels } from "src/consts/labels";

const labels = appLabels.ColumnDetailsMessage;

export const ColumnDetailsMessage = ({
  columnDetailsError,
  showSpinner
}: {
  columnDetailsError: string | null;
  showSpinner?: boolean;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, justifyContent: "center" }}>
      {showSpinner && <CircularProgress size="3rem" />}
      <Typography sx={{ paddingTop: "20px" }} data-testid={`columnDetails--message`}>
        {columnDetailsError ?? labels.retrievingColumnDetails}
      </Typography>
    </Box>
  );
};
