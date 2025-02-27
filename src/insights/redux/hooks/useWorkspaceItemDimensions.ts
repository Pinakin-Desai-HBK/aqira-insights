import { useAppSelector } from "./hooks";
import { selectStore_UI_Workspace_ItemDimensionsMap } from "../slices/ui/workspace/workspaceSlice";
import { Dimensions } from "../types/redux/workspaces";
import { useEffect, useState } from "react";

export const useWorkspaceItemDimensions = (id: string) => {
  const dimensionsMap = useAppSelector(selectStore_UI_Workspace_ItemDimensionsMap);
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);
  useEffect(() => {
    setDimensions(dimensionsMap[id as keyof typeof dimensionsMap] ?? null);
  }, [dimensionsMap, id]);
  return dimensions;
};
