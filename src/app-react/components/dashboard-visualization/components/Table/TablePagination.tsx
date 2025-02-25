import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { TablePaginationData } from "src/redux/types/ui/table";

export const TablePagination = memo(
  ({
    firstItemIndex,
    lastItemIndex,
    nextisEnabled,
    prevIsEnabled,
    totalNumberOfItems,
    onPageChange
  }: TablePaginationData) => {
    //console.count("TableFooter");
    return (
      <Box
        height={40}
        sx={{ borderTop: "1px solid rgb(224, 224, 224)" }}
        justifyContent="end"
        display="flex"
        alignItems="center"
      >
        {totalNumberOfItems !== 0 && (
          <>
            {/* The special '-' character below is the one used in the default table footer */}
            <Typography fontSize={"0.875rem"} marginRight={"21px"}>
              {`${firstItemIndex}–${lastItemIndex} of ${totalNumberOfItems}`}
            </Typography>

            <IconButton data-testid="AI-table-first" disabled={!prevIsEnabled} onClick={() => onPageChange("first")}>
              <FirstPageIcon />
            </IconButton>

            <IconButton data-testid="AI-table-prev" disabled={!prevIsEnabled} onClick={() => onPageChange("prev")}>
              <ChevronLeftIcon />
            </IconButton>

            <IconButton data-testid="AI-table-next" disabled={!nextisEnabled} onClick={() => onPageChange("next")}>
              <ChevronRightIcon />
            </IconButton>

            <IconButton data-testid="AI-table-last" disabled={!nextisEnabled} onClick={() => onPageChange("last")}>
              <LastPageIcon />
            </IconButton>
          </>
        )}
      </Box>
    );
  }
);
TablePagination.displayName = "TablePagination";
