import { createContext, useCallback, useEffect, useReducer } from "react";
import { SelectionContextReducer } from "./selectionContextReducer";
import {
  SelectionContextAction,
  SelectionContextData,
  SelectionContextType,
  SelectionItem,
  UseSelectionContextProps,
  UseSelectionContextType
} from "src/redux/types/ui/dataExplorer";

const createInitialState = <T>(): SelectionContextType<T> => ({
  selectionStart: null,
  items: [],
  itemsRaw: [],
  location: null,
  enabled: false,
  allItems: [],
  allItemsRaw: []
});

export const SelectionContext = createContext<SelectionContextData<unknown>>(null!);

export const useSelectionContext: UseSelectionContextType = <T>({
  enabled,
  location,
  matcher
}: UseSelectionContextProps<T>) => {
  const [state, dispatch] = useReducer(SelectionContextReducer<T>, createInitialState());

  useEffect(() => {
    if (state.location !== location || state.enabled !== enabled)
      dispatch({ type: "initialise", payload: { location, enabled } });
  }, [location, enabled, state]);

  const isMultipleSelected = useCallback(
    (draggedItem: SelectionItem<T> | undefined) =>
      state && state.allItems.filter((item) => item.selected || (draggedItem && matcher(item, draggedItem))).length > 1,
    [matcher, state]
  );

  const getSelectedItems = useCallback(
    () => (state ? state.allItems.filter((item) => item.selected).map((item) => item.item) : null),
    [state]
  );

  const getSelectedItemCount = useCallback(
    (draggedItem: SelectionItem<T> | undefined) =>
      state && state.allItems.filter((item) => item.selected || (draggedItem && matcher(item, draggedItem))).length,
    [matcher, state]
  );

  return {
    ...state,
    isMultipleSelected,
    getSelectedItemCount,
    getSelectedItems,
    dispatch: (value: SelectionContextAction<T>) => {
      if (state && state.location) {
        if (value.type === "selectItem" && !state.enabled) return;
        dispatch(value);
      }
    },
    matcher
  };
};
