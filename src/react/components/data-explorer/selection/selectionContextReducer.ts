import { SelectionContextAction, SelectionContextType } from "src/react/redux/types/ui/dataExplorer";

export const SelectionContextReducer = <T>(
  state: SelectionContextType<T>,
  action: SelectionContextAction<T>
): SelectionContextType<T> => {
  switch (action.type) {
    case "setAllItems": {
      const {
        payload: { allItems, matcher }
      } = action;
      return {
        ...state,
        matcher,
        allItemsRaw: allItems,
        allItems: allItems.map((itemA) => ({
          item: itemA,
          selected: false
        }))
      };
    }
    case "setItems": {
      const {
        payload: { items }
      } = action;
      const matcher = state.matcher;
      return {
        ...state,
        itemsRaw: items,
        items: items.map((itemA) => ({
          item: itemA,
          selected:
            state.allItems.find((itemB) => {
              return matcher && matcher({ item: itemA, selected: false }, itemB);
            })?.selected || false
        }))
      };
    }

    case "initialise": {
      const {
        payload: { location, enabled }
      } = action;
      if (state.location === location && state.enabled === enabled) {
        return state;
      }
      return {
        selectionStart: null,
        items: [],
        itemsRaw: [],
        location,
        enabled,
        allItems: [],
        allItemsRaw: []
      };
    }

    case "selectItem": {
      const {
        payload: { index, shiftKey, ctrlKey }
      } = action;
      const matcher = state.matcher;
      const item = state.items[index];
      if (!item) {
        return state;
      }
      const { selected } = item;
      const newItems = state.items.map((item, i) => {
        if (i === index) {
          return { ...item, selected: !selected };
        }
        if (shiftKey && state.selectionStart !== null) {
          const [start, end] = [state.selectionStart, index].sort((a, b) => a - b);
          if (start === undefined || end === undefined) {
            return item;
          }
          return { ...item, selected: i >= start && i <= end };
        }
        return ctrlKey ? item : { ...item, selected: false };
      });
      const newAllItems = state.allItems.map((itemA) => {
        const found = newItems.find((itemB) => {
          return matcher && matcher(itemA, itemB);
        });
        return { ...itemA, selected: found ? found.selected : ctrlKey || shiftKey ? itemA.selected : false };
      });
      return {
        ...state,
        items: newItems,
        allItems: newAllItems,
        selectionStart: shiftKey ? state.selectionStart : index
      };
    }

    default:
      return state;
  }
};
