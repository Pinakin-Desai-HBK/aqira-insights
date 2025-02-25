import { TablePageChangeType } from "src/redux/types/ui/table";

export const getNewPageNumber = (
  pageChangeType: TablePageChangeType,
  currentPageNumber: number,
  totalNumberOfItems: number,
  rowsPerPage: number
): number => {
  let newPageNumber;
  switch (pageChangeType) {
    case "first":
      newPageNumber = 1;
      break;
    case "last":
      newPageNumber = Math.floor(totalNumberOfItems / rowsPerPage) + (totalNumberOfItems % rowsPerPage > 0 ? 1 : 0);
      break;
    case "next":
      newPageNumber = currentPageNumber + 1;
      break;
    case "prev":
      newPageNumber = currentPageNumber - 1;
      break;
    default:
      newPageNumber = 1;
      break;
  }
  return newPageNumber;
};
