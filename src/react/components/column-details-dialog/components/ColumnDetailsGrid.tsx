import { DataGrid, GridRowClassNameParams, useGridApiRef } from "@mui/x-data-grid";
import { DataGridProps } from "@mui/x-data-grid/internals";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGridSync } from "../hooks/useGridSync";
import { ColumnDetailsGridToolbar } from "./ColumnDetailsGridToolbar";
import { getColumnDetailsDefinitions } from "../utils/getColumnDetailsDefinitions";
import { getColumnDetailsGridSx } from "../utils/getColumnDetailsGridSx";
import { ColumnDetailsIndexInfo } from "./ColumnDetailsIndexInfo";
import { ColumnDetailsGridParams, GridType } from "src/react/redux/types/ui/dataExplorer";
import { copyTableContentsHandler } from "../utils/copyTableContentsHandler";
import Box from "@mui/material/Box";

export const ColumnDetailsGrid = (props: ColumnDetailsGridParams<GridType>) => {
  const { apiRefs, currentIndex, unitValues, typeValues, maxNameWidth, type } = props;
  const apiRef = useGridApiRef();
  useGridSync(
    type === "dataColumns"
      ? {
          apiRefs,
          currentIndex,
          indexDetails: props.columnDetails.index,
          type,
          apiRef
        }
      : { apiRefs, currentIndex, type, apiRef }
  );
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const dataGridProps = useMemo(() => {
    const index = type === "dataColumns" ? props.columnDetails.index : null;
    const dataColumns = type === "dataColumns" ? props.columnDetails.dataColumns : [];
    const dataGridProps: DataGridProps = {
      columns: getColumnDetailsDefinitions(unitValues, typeValues, maxNameWidth, apiRefs),
      rows: dataColumns.map((dataColumn, dataColumnIndex) => ({
        ...dataColumn,
        id: dataColumnIndex
      })),
      getRowClassName: (params: GridRowClassNameParams) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? "odd" : "even",
      slots: {
        pinnedRows: () => <ColumnDetailsIndexInfo currentIndex={currentIndex} index={index} />,
        noResultsOverlay: () => null,
        ...(type === "columnsHeader" ? { toolbar: ColumnDetailsGridToolbar } : {})
      },
      slotProps:
        type === "columnsHeader"
          ? {
              panel: {
                anchorEl: filterButtonEl,
                placement: "bottom-end" as const
              },
              toolbar: {
                setFilterButtonEl,
                copyTableContentsHandler: () => copyTableContentsHandler(apiRefs)
              }
            }
          : {},
      hideFooterPagination: true,
      hideFooter: true,
      pageSizeOptions: [dataColumns.length],
      initialState: {
        pagination: { paginationModel: { pageSize: dataColumns.length } }
      },
      localeText: {
        toolbarFilters: ""
      },
      sx: getColumnDetailsGridSx(currentIndex)
    };
    return dataGridProps;
  }, [apiRefs, currentIndex, filterButtonEl, maxNameWidth, props, type, typeValues, unitValues]);
  const filterMonitor = useRef<null | (() => void)>(null);
  const [filteredLabel, setfilteredLabel] = useState("");
  const [noEntries, setNoEntries] = useState(false);
  useEffect(() => {
    filterMonitor.current = apiRef.current.subscribeEvent("filteredRowsSet", () => {
      const rowCount = apiRef.current.state.rows.totalRowCount;
      const visibleRowCount = Object.keys(apiRef.current.state.filter.filteredRowsLookup).reduce((acc, key) => {
        return acc + (apiRef.current.state.filter.filteredRowsLookup[key] ? 1 : 0);
      }, 0);
      if (visibleRowCount === 0 && rowCount > 0) {
        setfilteredLabel("No entries match the specified filter");
        setNoEntries(true);
      } else if (visibleRowCount !== rowCount) {
        setfilteredLabel(`${visibleRowCount} of ${rowCount} entries match the specified filter`);
        setNoEntries(false);
      } else {
        setfilteredLabel("");
        setNoEntries(false);
      }
    });

    return () => {
      if (filterMonitor.current) {
        filterMonitor.current();
      }
    };
  }, [apiRef]);
  return (
    <Box
      className={`column-details ${type === "scroller" ? "" : "hide-scroll"} ${noEntries ? "no-entries" : ""}`}
      data-testid={`column-details-${type === "columnsHeader" ? "fixed" : currentIndex}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        borderBottom: currentIndex > -1 ? "1px solid #A0A0A0" : "0px",
        marginBottom: currentIndex !== -1 ? "-1px" : "0px"
      }}
    >
      <span style={{ maxHeight: "100%", minHeight: "0px" }}>
        <DataGrid
          apiRef={apiRef}
          columnHeaderHeight={30}
          rowHeight={24}
          disableColumnMenu={true}
          showCellVerticalBorder={false}
          disableRowSelectionOnClick={true}
          disableColumnSorting={true}
          disableColumnSelector={true}
          {...dataGridProps}
        />
      </span>
      {filteredLabel !== "" && type === "dataColumns" && (
        <Box
          sx={{
            height: "30px",
            alignContent: "center",
            backgroundColor: "#FFF",
            textAlign: "center",
            fontSize: "12px",
            borderTop: currentIndex > -1 ? "1px solid #A0A0A0" : "0px",
            borderBottom: "0px"
          }}
        >
          {filteredLabel}
        </Box>
      )}
    </Box>
  );
};
