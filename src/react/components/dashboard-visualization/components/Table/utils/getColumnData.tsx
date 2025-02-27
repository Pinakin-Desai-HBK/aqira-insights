import { GridColDef } from "@mui/x-data-grid";
import { getTextWidth } from "src/react/components/inline-edit/text-utils";
import {
  TABLE_VIS_DEFAULT_COLUMN_WIDTH,
  TABLE_VIS_HEADER_CLASS_NAME,
  TABLE_VIS_HEADER_FONT_CALC
} from "src/react/consts/consts";

export const getColumnData = (field: string, name: string, units: string) => {
  const width = getTextWidth(`${name} (${units})`, TABLE_VIS_HEADER_FONT_CALC);
  return {
    type: "string" as Required<GridColDef>["type"],
    field,
    headerName: name,
    minWidth: width && width > TABLE_VIS_DEFAULT_COLUMN_WIDTH ? width : TABLE_VIS_DEFAULT_COLUMN_WIDTH,
    headerClassName: TABLE_VIS_HEADER_CLASS_NAME,
    flex: 1,
    renderHeader: () => (
      <div>
        {name}
        {units ? <span style={{ opacity: 0.5 }}> ({units})</span> : null}
      </div>
    )
  };
};
