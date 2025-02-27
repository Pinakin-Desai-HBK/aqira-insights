import { RefObject } from "react";
import { appLabels } from "src/react/consts/labels";
import { ApiRefs } from "src/react/redux/types/ui/dataExplorer";

const getColumnDetailsDefinitionsLabels: { [key: string]: string } = appLabels.getColumnDetailsDefinitions;
const getIndexDetailsItemsLabels: { [key: string]: string } = appLabels.getIndexDetailsItems;

export const copyTableContentsHandler = (apiRefs: RefObject<ApiRefs>) => {
  const convertLabel = (value: string) =>
    value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

  const result = apiRefs.current.reduce<string[]>((acc, apiRef) => {
    if (apiRef.type !== "dataColumns") {
      return acc;
    }
    const api = apiRef.api;
    const indexDetails = apiRef.indexDetails;

    const rows: any[] = [];
    if (api.state.filter.filterModel.items.length > 0) {
      const filteredRowsLookup = api.getFilterState(api.state.filter.filterModel).filteredRowsLookup;

      rows.push(
        ...Object.keys(filteredRowsLookup).reduce((acc, filteredRowId) => {
          return filteredRowsLookup[filteredRowId] ? [...acc, api.getRow(filteredRowId)] : acc;
        }, [] as string[])
      );
    } else {
      for (let i = 0; i < api.getRowsCount(); i++) {
        const row = api.getRow(i);
        rows.push(row);
      }
    }

    const columns = api.getAllColumns();
    const dataColumnIds = columns.map((column) => column.field);
    const indexIds = [
      "name",
      "type",
      "length",
      "units",
      "numPoints",
      "isoBase",
      "isoIncrement",
      "firstValue",
      "lastValue"
    ];

    const indexLabels = indexIds.map((column) => {
      return "Index" + convertLabel(getIndexDetailsItemsLabels[column] ?? "");
    });
    const dataColumnLabels = dataColumnIds.map((column) =>
      convertLabel(getColumnDetailsDefinitionsLabels[column] ?? "")
    );
    const columnLabels = acc.length === 0 ? [...indexLabels, ...dataColumnLabels].join(",") : null;

    const indexValues = indexIds.map((column) =>
      column in indexDetails ? indexDetails[column as keyof typeof indexDetails].toString() : "-"
    );
    const rowsValues =
      rows.length > 0
        ? rows.map((row) =>
            [
              indexValues,
              dataColumnIds.map((column) => {
                return row[column] ?? "-";
              })
            ].join(",")
          )
        : null;

    return [...acc, ...(columnLabels ? [columnLabels] : []), ...(rowsValues ? rowsValues : [])];
  }, [] as string[]);
  navigator.clipboard.writeText(result.join("\n"));
  console.log("Copied clipboard", result.join("\n"));
};
