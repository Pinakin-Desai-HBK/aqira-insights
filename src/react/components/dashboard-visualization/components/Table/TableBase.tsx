import { useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TABLE_VIS_HEADER_CLASS_NAME, TABLE_VIS_HEADER_FONT } from "src/react/consts/consts";
import Stack from "@mui/material/Stack";
import { TableData } from "src/react/redux/types/ui/table";
import useTheme from "@mui/material/styles/useTheme";

type TableBaseProps = {
  tableData: TableData;
  Footer?: React.ReactNode;
  Header?: React.ReactNode;
};

export const TableBase = ({ tableData, Footer, Header }: TableBaseProps) => {
  const theme = useTheme();

  return (
    <Stack
      display="flex"
      sx={{
        height: "100%",
        width: "100%",
        pointerEvents: "auto",
        "& .MuiDataGrid-virtualScroller": { marginTop: "-1px", marginRight: "1px" }, // To fix bits of row text appearing outside the table
        [`& .${TABLE_VIS_HEADER_CLASS_NAME}`]: {
          background: theme.palette.tableVisComp.headerBackground,
          color: theme.palette.text.secondary,
          font: TABLE_VIS_HEADER_FONT
        }, // Header colors
        userSelect: "text"
      }}
      overflow="hidden"
    >
      {Header}
      <DataGrid
        rows={tableData?.tableRows || []}
        columns={tableData?.tableColumns || []}
        initialState={{
          pagination: { paginationModel: { pageSize: tableData.rowsPerPage } }
        }}
        checkboxSelection={false}
        disableRowSelectionOnClick
        disableMultipleRowSelection
        disableColumnSorting
        disableColumnFilter
        disableColumnMenu
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
        paginationModel={{ page: 0, pageSize: tableData.rowsPerPage }}
        slots={{
          noRowsOverlay: useCallback(() => <div style={{ position: "relative", top: "-40px" }}>No data</div>, []),
          footer: () => null
        }}
        sx={{
          "& .MuiDataGrid-cell": {
            padding: "0 10px"
          },
          width: "100%"
        }}
      />
      {Footer}
    </Stack>
  );
};
