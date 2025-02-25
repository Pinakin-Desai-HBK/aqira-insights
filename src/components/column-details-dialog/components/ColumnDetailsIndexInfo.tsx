import { DetailsGrid } from "src/components/detailsGrid/DetailsGrid";
import { ConvertedColumnDetails } from "src/redux/types/schemas/dataExplorer";
import { DetailsGridItem } from "src/redux/types/ui/detailsGrid";
import { getIndexDetailsItems } from "../utils/getIndexDetailsItems";
import Box from "@mui/material/Box";

export const ColumnDetailsIndexInfo = ({
  index,
  currentIndex
}: {
  index: ConvertedColumnDetails["index"] | null;
  currentIndex: number;
}) => {
  const indexDetailsTableItems: DetailsGridItem[][] | null = getIndexDetailsItems({ index });
  return indexDetailsTableItems ? (
    <Box
      sx={{
        display: "flex",
        flexGrow: "1",
        flexDirection: "row",
        width: "fit-content",
        backgroundColor: "#eaeaea"
      }}
    >
      <DetailsGrid
        itemsArray={indexDetailsTableItems}
        testIdPrefix={`index-details-${currentIndex}`}
        sx={{
          backgroundColor: "#eaeaea",
          gridGap: "3px",
          columnGap: "6px",
          gridTemplateColumns: "fit-content 100px fit-content 100px fit-content 100px auto"
        }}
      />
    </Box>
  ) : null;
};
