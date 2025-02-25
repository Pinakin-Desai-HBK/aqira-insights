import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Grid2";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import { DetailsGridProps } from "src/redux/types/ui/detailsGrid";

export const DetailsGrid = ({ itemsArray, testIdPrefix, sx }: DetailsGridProps) => {
  return (
    <Grid2
      data-testid={`${testIdPrefix}-container`}
      sx={{
        display: "grid",
        gridTemplateColumns: "fit-content(100%) auto",
        padding: "6px",
        backgroundColor: "#F6F6F6",
        color: "#8F9198",
        fontSize: "12px",
        userSelect: "text",
        ...sx
      }}
    >
      {itemsArray.map((items) => {
        return items.map((item, index) => {
          if (item.type === "label") {
            const { label, sxLabel, key } = item;
            return (
              <React.Fragment key={index}>
                <Box
                  data-testid={`${testIdPrefix}-${key}-label`}
                  sx={{
                    padding: "3px",
                    ...sxLabel
                  }}
                  key={index}
                >
                  {label}
                </Box>
              </React.Fragment>
            );
          }
          const { key, label, value, sxLabel, sxValue } = item;
          return (
            <React.Fragment key={index}>
              <Box
                data-testid={`${testIdPrefix}-${key}-label`}
                sx={{
                  padding: "3px",
                  ...sxLabel
                }}
              >
                {label}
              </Box>
              <Box
                data-testid={`${testIdPrefix}-${key}-value`}
                sx={{
                  padding: "3px",
                  color: "#47505C",
                  ...sxValue
                }}
              >
                <Tooltip title={item.tooltip || ""} placement="top">
                  <span>{value}</span>
                </Tooltip>
              </Box>
            </React.Fragment>
          );
        });
      })}
    </Grid2>
  );
};
