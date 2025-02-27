import {
  DataGroupItem,
  SelectionContextData,
  SelectionContextProviderProps
} from "src/react/redux/types/ui/dataExplorer";
import { SelectionContext, useSelectionContext } from "../selection/SelectionContext";

export const DataSelectionContextProvider = ({
  children,
  enabled,
  location,
  matcher
}: SelectionContextProviderProps<DataGroupItem>) => {
  const selectionContextData = useSelectionContext({
    enabled,
    location,
    matcher
  });
  return (
    <SelectionContext.Provider value={selectionContextData as SelectionContextData<unknown>}>
      {children}
    </SelectionContext.Provider>
  );
};
