import { GridColDef, GridFilterItem, GridRenderCellParams } from "@mui/x-data-grid";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import dayjs from "dayjs";
import { CommonDateOperatorDetails } from "./CommonDateOperatorDetails";
import { LogMessage, LogMessageLevel } from "src/react/redux/types/schemas/logMessage";
import Tooltip from "@mui/material/Tooltip";

const iconSx = { width: "20px", height: "20px" };

const renderIcon = (value: LogMessageLevel | undefined) => {
  switch (value) {
    case "Information":
      return <InfoIcon sx={{ color: "#00B1E1", ...iconSx }} />;
    case "Warning":
      return <WarningIcon sx={{ color: "#FFB137", ...iconSx }} />;
    case "Error":
      return <ErrorIcon sx={{ color: "#E32440", ...iconSx }} />;
    case "Success":
      return <CheckBoxIcon sx={{ color: "#00AA69", ...iconSx }} />;
    default:
      return <QuestionMarkIcon sx={{ ...iconSx }} />;
  }
};

const levelLabelMap = new Map<LogMessageLevel, string>([
  ["Information", "Information"],
  ["Warning", "Warning"],
  ["Error", "Error"],
  ["Success", "Success"]
]);

const getLevelTooltip = (value: LogMessageLevel | undefined) => (value ? levelLabelMap.get(value) || value : "Unknown");

function buildApplyFilterFn(filterItem: GridFilterItem, compareFn: (value1: number, value2: number) => boolean) {
  if (!filterItem.value) return null;
  const time = new Date(filterItem.value).getTime();
  return (value: Date) => {
    if (!value) return false;
    const valueToCheck = new Date(value.getTime());
    valueToCheck.setMilliseconds(0);
    return compareFn(valueToCheck.getTime(), time);
  };
}

const getGridDateOperators = () => [
  {
    value: "is",
    getApplyFilterFn: (filterItem: GridFilterItem) =>
      buildApplyFilterFn(filterItem, (value1: number, value2: number) => value1 === value2),
    ...CommonDateOperatorDetails
  },
  {
    value: "not",
    getApplyFilterFn: (filterItem: GridFilterItem) =>
      buildApplyFilterFn(filterItem, (value1: number, value2: number) => value1 !== value2),
    ...CommonDateOperatorDetails
  },
  {
    value: "after",
    getApplyFilterFn: (filterItem: GridFilterItem) =>
      buildApplyFilterFn(filterItem, (value1: number, value2: number) => value1 > value2),
    ...CommonDateOperatorDetails
  },
  {
    value: "onOrAfter",
    getApplyFilterFn: (filterItem: GridFilterItem) =>
      buildApplyFilterFn(filterItem, (value1: number, value2: number) => value1 >= value2),
    ...CommonDateOperatorDetails
  },
  {
    value: "before",
    getApplyFilterFn: (filterItem: GridFilterItem) =>
      buildApplyFilterFn(filterItem, (value1: number, value2: number) => value1 < value2),
    ...CommonDateOperatorDetails
  },
  {
    value: "onOrBefore",
    getApplyFilterFn: (filterItem: GridFilterItem) =>
      buildApplyFilterFn(filterItem, (value1: number, value2: number) => value1 <= value2),
    ...CommonDateOperatorDetails
  }
];

const logMessageColumns: GridColDef<LogMessage>[] = [
  /*
   *  Just in case we want to do something with the ID in future
   *  { field: "id", headerName: "ID", headerClassName: "AI-log-column-header", cellClassName: "AI-log-id-cell", width: 50 },
   */
  {
    field: "level",
    headerName: "Status",
    headerClassName: "AI-log-column-header AI-log-column-header-status",
    cellClassName: "AI-log-level-cell",
    width: 50,
    renderHeader: () => <div />,
    renderCell: ({ value }: GridRenderCellParams<LogMessage, LogMessageLevel>) => (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flexStart", marginTop: "-1px" }}>
        <Tooltip title={getLevelTooltip(value)}>{renderIcon(value)}</Tooltip>
      </div>
    ),
    valueOptions: Array.from(levelLabelMap.values()),
    type: "singleSelect",
    disableColumnMenu: true
  },
  {
    field: "timestamp",
    headerName: "Time",
    headerClassName: "AI-log-column-header",
    cellClassName: "AI-log-timestamp-cell",
    width: 160,
    type: "dateTime",
    valueGetter: (value) => dayjs(value).toDate(),
    renderCell: ({ value }) => dayjs(value).format("YYYY/MM/DD HH:mm:ss"),
    disableColumnMenu: true,
    valueFormatter: (value) => dayjs(value).format("YYYY/MM/DD HH:mm:ss"),
    filterOperators: getGridDateOperators()
  },
  {
    field: "source",
    headerName: "Location",
    headerClassName: "AI-log-column-header",
    cellClassName: "AI-log-source-cell",
    width: 160,
    disableColumnMenu: true
  },
  {
    field: "message",
    headerName: "Message",
    headerClassName: "AI-log-column-header",
    cellClassName: "AI-log-message-cell",
    description: "This column is not sortable.",
    sortable: false,
    width: 160,
    flex: 1,
    disableColumnMenu: true
  }
];

export default logMessageColumns;
