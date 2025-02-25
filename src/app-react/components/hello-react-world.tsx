import { useEffect, useState } from "react";
import Papa from "papaparse";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

const MyReactComponent = ({
  csvData,
  onCellClick,
}: {
  csvData: string;
  onCellClick: (value: string) => void;
}) => {
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    if (!csvData) return;
    const parsedData = Papa.parse(csvData).data as string[][];

    // Columns
    const index = parsedData.findIndex((row) => row[0].includes("#KEYWORDS"));
    const columns = parsedData[index + 1].map((col) => ({
      field: col,
      headerName: col,
      width: 150,
    }));
    setColumns(columns);

    // Rows
    const index1 = parsedData.findIndex((row) =>
      row[0].includes("#SECTIONDATA")
    );
    const index2 = parsedData.findIndex((row) =>
      row[0].includes("#SECTIONEND")
    );
    let allRows = [];
    for (let i = index1 + 1; i < index2; i++) {
      const row: any = { id: i };
      for (let j = 0; j < columns.length; j++) {
        row[columns[j].field] = parsedData[i][j];
      }
      allRows.push(row);
    }
    setRows(allRows);
  }, [csvData]);

  return (
    <div
      style={{
        padding: "20px",
        margin: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        backgroundColor: "white",
      }}
    >
      <h1>React</h1>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          onCellClick={(event) => onCellClick(event.value as string)}
        />
      </div>
    </div>
  );
};

export default MyReactComponent;
