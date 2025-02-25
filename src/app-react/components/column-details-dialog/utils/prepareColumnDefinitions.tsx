import { GridColDef } from "@mui/x-data-grid";
import { DetailsDataColumns } from "src/redux/types/schemas/dataExplorer";
import { getTextWidth } from "../../inline-edit/text-utils";
import {
  COLUMN_DEFINITIONS_COPY_COLUMN_ICON_WIDTH,
  COLUMN_DEFINITIONS_DEFAULT_COLUMN_WIDTH,
  COLUMN_DEFINITIONS_HEADER_FONT_CALC
} from "src/consts/consts";
import { ApiRefs } from "src/redux/types/ui/dataExplorer";
import { ColumnDetailsColumnHeader } from "../components/ColumnDetailsColumnHeader";
import { Tooltip } from "@mui/material";
import { formatChartNumber } from "src/helpers/format-number/format-number";
import { RefObject } from "react";

export const formatNumber = (value: unknown) => {
  const result = formatChartNumber(value);
  return result || null;
};

export const prepareColumnDefinitions = (
  columnDefinitions: GridColDef<DetailsDataColumns>[],
  apiRefs: RefObject<ApiRefs>
) => {
  return columnDefinitions.map((columnDefinition) => {
    const textWidth = getTextWidth(`${columnDefinition.headerName}`, COLUMN_DEFINITIONS_HEADER_FONT_CALC);
    const width = textWidth ? textWidth + COLUMN_DEFINITIONS_COPY_COLUMN_ICON_WIDTH * 2 : null;
    const updated: GridColDef<DetailsDataColumns> = {
      minWidth:
        width && width > COLUMN_DEFINITIONS_DEFAULT_COLUMN_WIDTH ? width : COLUMN_DEFINITIONS_DEFAULT_COLUMN_WIDTH,
      ...columnDefinition,
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const noVal = params.value === null || params.value === undefined || params.value === "";
        if (noVal) {
          return "-";
        }
        if (typeof params.value === "string") {
          return params.value;
        }
        const cell = formatNumber(params.value) || params.value.toString();
        const tooltip = params.value;
        return (
          <Tooltip title={tooltip.toString()}>
            <span>{cell}</span>
          </Tooltip>
        );
      },
      valueFormatter: (value) => {
        if (value === null || value === undefined || value === "") {
          return "-";
        }
        return value;
      },
      renderHeader: () => (
        <ColumnDetailsColumnHeader
          headerLabel={columnDefinition.headerName}
          field={columnDefinition.field}
          apiRefs={apiRefs}
        />
      )
    };
    return updated;
  });
};
