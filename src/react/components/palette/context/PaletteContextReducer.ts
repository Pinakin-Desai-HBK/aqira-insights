import { PaletteContextAction, PaletteContextState, PaletteItemData } from "src/react/redux/types/ui/palette";

export const PaletteContextReducer = (
  state: PaletteContextState,
  action: PaletteContextAction
): PaletteContextState => {
  switch (action.type) {
    case "setDisplayMode": {
      const {
        payload: { displayMode }
      } = action;
      localStorage.setItem(state.displayModeKey, JSON.stringify(displayMode));
      return {
        ...state,
        displayMode
      };
    }
    case "toggleGroup": {
      const {
        payload: { expanded, group }
      } = action;
      const newOpenGroups = expanded
        ? [...state.openGroups, group]
        : state.openGroups.filter((currentGroup) => currentGroup !== group);
      if (newOpenGroups.length) localStorage.setItem(state.openGroupsKey, JSON.stringify(newOpenGroups));
      else localStorage.removeItem(state.openGroupsKey);
      return {
        ...state,
        openGroups: newOpenGroups
      };
    }
    case "setSearchText": {
      const {
        payload: { searchText }
      } = action;
      return {
        ...state,
        searchText,
        searchItems: state.paletteData.itemsArray.reduce<PaletteItemData[]>((result, item) => {
          const matches = (item.name || item.type).toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) !== -1;
          return matches ? [...result, item] : result;
        }, [] as PaletteItemData[])
      };
    }
    default:
      return state;
  }
};
