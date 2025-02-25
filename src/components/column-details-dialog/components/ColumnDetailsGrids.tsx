import { ColumnDetailsGrid } from "./ColumnDetailsGrid";
import { useRef } from "react";
import { ConvertedColumnDetails } from "src/redux/types/schemas/dataExplorer";
import { getFilterValues } from "../utils/getFilterValues";
import { ApiRefs } from "src/redux/types/ui/dataExplorer";
import Box from "@mui/material/Box";

export const ColumnDetailsGrids = ({
  columnDetails,
  maxNameWidth
}: {
  columnDetails: ConvertedColumnDetails[];
  maxNameWidth: number;
}) => {
  const apiRefs = useRef<ApiRefs>([]);
  const { typeValues, unitValues } = getFilterValues({ columnDetails });
  return (
    <>
      <Box
        className="column-details-columns-header"
        data-testid="column-details-columns-header"
        key={`column-details-columns-header`}
        sx={{
          display: "flex",
          flexDirection: "column",
          marginRight: "8px",
          "& .MuiDataGrid-main": { borderRight: "1px solid #929292D4", borderLeft: "1px solid #929292D4" }
        }}
      >
        <ColumnDetailsGrid
          apiRefs={apiRefs}
          currentIndex={-1}
          unitValues={unitValues}
          typeValues={typeValues}
          maxNameWidth={maxNameWidth}
          type={"columnsHeader"}
        />
      </Box>
      <Box
        id={`column-details-scroller`}
        className={`column-details-scroller`}
        sx={{
          display: "flex",
          flexDirection: "column",
          overflowY: "scroll",
          width: "auto",
          flexGrow: 1,
          marginBottom: "-1px",
          borderTop: "0px"
        }}
      >
        {columnDetails.map((currentColumnDetails, currentIndex) => {
          return (
            <Box
              key={`column-details-Block-${currentIndex}`}
              data-testid={`column-details-Block-${currentIndex}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #A0A0A0",
                borderTop: "0px",
                borderBottom: currentIndex === columnDetails.length - 1 ? "0px" : "1px solid #929292D4"
              }}
            >
              <ColumnDetailsGrid
                apiRefs={apiRefs}
                columnDetails={currentColumnDetails}
                currentIndex={currentIndex}
                unitValues={unitValues}
                typeValues={typeValues}
                maxNameWidth={maxNameWidth}
                type="dataColumns"
              />
            </Box>
          );
        })}
        <Box sx={{ flexGrow: "1", borderLeft: "1px solid #929292D4", borderRight: "1px solid #929292D4" }}></Box>
      </Box>
      <Box
        key={`column-details-scroll-footer`}
        sx={{
          display: "flex",
          flexDirection: "column",
          marginRight: "8px",
          borderTop: "2px solid #929292D4"
        }}
      >
        <ColumnDetailsGrid
          apiRefs={apiRefs}
          currentIndex={-2}
          unitValues={unitValues}
          typeValues={typeValues}
          maxNameWidth={maxNameWidth}
          type="scroller"
        />
      </Box>
    </>
  );
};
