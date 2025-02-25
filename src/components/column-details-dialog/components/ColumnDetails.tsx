import { Box } from "@mui/material";
import { ConvertedColumnDetails } from "src/redux/types/schemas/dataExplorer";
import { DetailsGridItem } from "src/redux/types/ui/detailsGrid";
import { ColumnDetailsGrids } from "./ColumnDetailsGrids";
import { DetailsGrid } from "src/components/detailsGrid/DetailsGrid";
import { getTextWidth } from "src/components/inline-edit/text-utils";

export const ColumnDetails = ({
  columnDetails,
  headerItems
}: {
  columnDetails: ConvertedColumnDetails[];
  headerItems: DetailsGridItem[][];
}) => {
  const maxNameWidth = columnDetails.reduce((acc, current) => {
    return Math.max(
      acc,
      current.dataColumns.reduce((namAcc, column) => {
        return Math.max(namAcc, (getTextWidth(column.name, "12px Arial") ?? 0) + 25);
      }, 0)
    );
  }, 0);
  return (
    <Box
      sx={{
        backgroundColor: "#F6F6F6",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        height: "100%",
        overflowX: "hidden",
        marginRight: "-8px"
      }}
    >
      <Box sx={{ display: "flex", width: "100%", flexDirection: "row" }}>
        <DetailsGrid
          itemsArray={headerItems}
          testIdPrefix="column-details-header"
          sx={{
            width: "100%",
            marginBottom: "-30px",
            gridGap: "3px",
            columnGap: "6px",
            gridTemplateColumns:
              "fit-content(100%) fit-content(100%) fit-content(100%) fit-content(100%) fit-content(100%) fit-content(100%)"
          }}
        />
      </Box>
      <ColumnDetailsGrids columnDetails={columnDetails} maxNameWidth={maxNameWidth} />
    </Box>
  );
};
