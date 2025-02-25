import { RefObject } from 'react';
import { ApiRefs } from 'src/redux/types/ui/dataExplorer';

export const copyColumnContentsHandler = (
  column: string,
  apiRefs: RefObject<ApiRefs>,
) => {
  const result = apiRefs.current.reduce((acc, apiRef) => {
    if (apiRef.type !== 'dataColumns') {
      return acc;
    }
    const api = apiRef.api;

    if (api.state.filter.filterModel.items.length > 0) {
      const filteredRowsLookup = api.getFilterState(
        api.state.filter.filterModel,
      ).filteredRowsLookup;
      const rows = Object.keys(filteredRowsLookup).reduce(
        (acc, filteredRowId) => {
          return filteredRowsLookup[filteredRowId]
            ? [...acc, api.getRow(filteredRowId)]
            : acc;
        },
        [] as string[],
      );
      const rowsValues =
        rows.length > 0 ? rows.map((row) => row[column] ?? '-') : null;
      return [...acc, ...(rowsValues ? rowsValues : [])];
    } else {
      const rowsValues: string[] = [];
      for (let i = 0; i < api.getRowsCount(); i++) {
        const row = api.getRow(i);
        rowsValues.push(row[column] ?? '-');
      }
      return [...acc, ...(rowsValues ? rowsValues : [])];
    }
  }, [] as string[]);
  navigator.clipboard.writeText(result.join(','));
  console.log('Copied clipboard', result.join(','));
};
