import { GridColDef } from "@mui/x-data-grid";
import { DetailsDataColumns } from "src/react/redux/types/schemas/dataExplorer";
import { appLabels } from "src/react/consts/labels";
import { prepareColumnDefinitions } from "./prepareColumnDefinitions";
import { COLUMN_DEFINITIONS_DEFAULT_COLUMN_WIDTH } from "src/react/consts/consts";
import { ApiRefs } from "src/react/redux/types/ui/dataExplorer";
import { RefObject } from "react";

const labels = appLabels.getColumnDetailsDefinitions;

export const getColumnDetailsDefinitions = (
  unitValues: string[],
  typeValues: string[],
  maxNameWidth: number,
  apiRefs: RefObject<ApiRefs>
) => {
  const columnDetailsDefinitions: GridColDef<DetailsDataColumns>[] = prepareColumnDefinitions(
    [
      {
        field: "name",
        headerName: labels.name,
        type: "string",
        minWidth:
          maxNameWidth > COLUMN_DEFINITIONS_DEFAULT_COLUMN_WIDTH
            ? maxNameWidth
            : COLUMN_DEFINITIONS_DEFAULT_COLUMN_WIDTH
      },
      {
        field: "units",
        headerName: labels.units,
        valueOptions: unitValues,
        type: "singleSelect"
      },
      {
        field: "type",
        headerName: labels.type,
        valueOptions: typeValues,
        type: "singleSelect"
      },
      {
        field: "min",
        headerName: labels.min,
        type: "number"
      },
      {
        field: "max",
        headerName: labels.max,
        type: "number"
      },
      {
        field: "mean",
        headerName: labels.mean,
        type: "number"
      },
      {
        field: "rootMeanSquare",
        headerName: labels.rootMeanSquare,
        type: "number"
      },
      {
        field: "standardDeviation",
        headerName: labels.standardDeviation,
        type: "number"
      }
    ],
    apiRefs
  );
  return columnDetailsDefinitions;
};
