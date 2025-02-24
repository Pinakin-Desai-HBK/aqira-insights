import { useEffect, useState } from "react";
import Papa from "papaparse";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";

// const rows: GridRowsProp = [
//   { id: 1, col1: "Hello", col2: "World" },
//   { id: 2, col1: "DataGridPro", col2: "is Awesome" },
//   { id: 3, col1: "MUI", col2: "is Amazing" },
// ];

// const columns: GridColDef[] = [
//   { field: "col1", headerName: "Column 1", width: 150 },
//   { field: "col2", headerName: "Column 2", width: 150 },
// ];

const MyReactComponent = ({ csvData }: { csvData: string }) => {
  const [tableData, setTableData] = useState<string[][]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<GridRowsProp>([]);

  useEffect(() => {
    if (!csvData) return;
    console.log(Papa.parse(csvData).data);
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
        <DataGrid rows={rows} columns={columns} />
      </div>
    </div>
  );
};

export default MyReactComponent;
