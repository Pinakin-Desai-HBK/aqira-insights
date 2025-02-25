import { PaletteContextData } from "src/redux/types/ui/palette";
import { PaletteContentType } from "src/redux/types/ui/palette";
import { PaletteContextReducer } from "./PaletteContextReducer";
import { createInitialState } from "./PaletteContext";
import { useReducer } from "react";
import { useAppSelector } from "src/redux/hooks/hooks";
import {
  selectStore_UI_Workspace_NodeTypesData,
  selectStore_UI_Workspace_VisualizationTypesData
} from "src/redux/slices/ui/workspace/workspaceSlice";

export const usePaletteContext = (type: PaletteContentType): PaletteContextData => {
  const nodeTypes = useAppSelector(selectStore_UI_Workspace_NodeTypesData);
  const visualizationTypes = useAppSelector(selectStore_UI_Workspace_VisualizationTypesData);
  const [state, dispatch] = useReducer(
    PaletteContextReducer,
    { nodesPaletteData: nodeTypes!, visualizationsPaletteData: visualizationTypes!, type },
    createInitialState
  );
  return {
    ...state,
    paletteContextDispatch: dispatch
  };
};
