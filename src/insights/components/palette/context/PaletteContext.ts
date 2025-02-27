import { createContext } from "react";
import { LocalStorage } from "../../../enums/enums";
import {
  PaletteContextData,
  PaletteContextInitialStateParams,
  PaletteContextState
} from "src/insights/redux/types/ui/palette";

export const PaletteContext = createContext<PaletteContextData>(null!);

export const createInitialState = ({
  nodesPaletteData,
  visualizationsPaletteData,
  type
}: PaletteContextInitialStateParams): PaletteContextState => {
  const isNodeContent = type === "NodeContent";
  const idPart = isNodeContent ? "AI-nodes" : "AI-visualizations";
  const displayModeKey = `${idPart}${LocalStorage.PaletteDisplaySuffix}`;
  const openGroupsKey = `${idPart}${LocalStorage.PaletteOpenGroupsSuffix}`;
  const storedDisplayMode = localStorage.getItem(displayModeKey);
  const storedOpenGroups = localStorage.getItem(openGroupsKey);
  return {
    isNodeContent,
    idPart: isNodeContent ? "AI-nodes" : "AI-visualizations",
    displayModeKey,
    openGroupsKey,
    searchText: "",
    searchItems: [],
    openGroups: storedOpenGroups ? JSON.parse(storedOpenGroups) : [],
    displayMode: storedDisplayMode ? JSON.parse(storedDisplayMode) : "titles",
    ...(isNodeContent
      ? {
          title: "Nodes",
          dataFormat: "application/ai/nodedef",
          paletteData: nodesPaletteData,
          itemLabel: "node",
          itemLabelPlural: "nodes",
          type
        }
      : {
          title: "Visualizations",
          dataFormat: "application/ai/visualizationdef",
          paletteData: visualizationsPaletteData,
          itemLabel: "visualization",
          itemLabelPlural: "visualizations",
          type
        })
  };
};
