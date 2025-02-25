import { TablePagination } from "./TablePagination";
import { useTable } from "./hooks/useTable";
import { TableBase } from "./TableBase";
import HistogramTableFooter from "./HistogramTableFooter";
import HistogramTableHeader from "./HistogramTableHeader";
import Box from "@mui/material/Box";

export const Table = () => {
  const { displayHistogramTable, histogramTableInfo, tableData, tablePaginationData, onDragOver, onDrop } = useTable();

  return (
    <Box width={1} height={1} onDrop={onDrop} onDragOver={onDragOver}>
      {displayHistogramTable ? (
        <TableBase
          tableData={tableData}
          Footer={<HistogramTableFooter histogramTableInfo={histogramTableInfo} />}
          Header={<HistogramTableHeader histogramTableInfo={histogramTableInfo} />}
        />
      ) : (
        <TableBase tableData={tableData} Footer={<TablePagination {...tablePaginationData} />} />
      )}
    </Box>
  );
};
