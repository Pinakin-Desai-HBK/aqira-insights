import { DataFileItem } from "src/redux/types/ui/dataExplorer";

export const getSelectedItemsInfo = (
  current: DataFileItem,
  selectedItems: DataFileItem[] | null,
  isSelected: boolean
) => {
  return isSelected
    ? {
        string: JSON.stringify((selectedItems || []).map((row) => row.item.fullName.replaceAll("\\", "/"))),
        count: (selectedItems || []).length
      }
    : {
        string: JSON.stringify([current.item.fullName.replaceAll("\\", "/")]),
        count: 1
      };
};
