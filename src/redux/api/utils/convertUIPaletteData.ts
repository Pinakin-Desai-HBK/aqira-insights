import { GroupColours, PaletteData, PaletteGroupData } from "src/redux/types/ui/palette";

export const convertUIPaletteData = (groups: PaletteGroupData[], groupColours: GroupColours): PaletteData => {
  const itemsMap: PaletteData["itemsMap"] = {};
  const itemsArray: PaletteData["itemsArray"] = [];
  const groupItemsMap: PaletteData["groupItemsMap"] = {};
  groups.forEach(({ groupName, items }) => {
    groupItemsMap[groupName] = items;
    items.forEach((item) => {
      itemsArray.push(item);
      itemsMap[item.type] = item;
    });
  });
  return {
    groups: groups.map(({ groupName }) => groupName),
    groupColours,
    groupItemsMap,
    itemsArray,
    itemsMap
  };
};
