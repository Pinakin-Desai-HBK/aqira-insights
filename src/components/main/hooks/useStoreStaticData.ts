import { useEffect } from "react";
import { useGetNodeTypesQuery, useGetVisualizationTypesQuery } from "../../../redux/api/appApi";
import { useAppDispatch, useAppSelector } from "src/redux/hooks/hooks";
import {
  selectStore_UI_Workspace_NodeTypesData,
  selectStore_UI_Workspace_VisualizationTypesData,
  uiWorkspace_setTypesData
} from "src/redux/slices/ui/workspace/workspaceSlice";

export const useStoreStaticData = () => {
  const dispatch = useAppDispatch();
  const { data: nodesTypeData } = useGetNodeTypesQuery();
  useEffect(() => {
    dispatch(uiWorkspace_setTypesData({ workspaceType: "Network", typesData: nodesTypeData ?? null }));
  }, [dispatch, nodesTypeData]);

  const { data: visualizationsTypesData } = useGetVisualizationTypesQuery();
  useEffect(() => {
    dispatch(uiWorkspace_setTypesData({ workspaceType: "Dashboard", typesData: visualizationsTypesData ?? null }));
  }, [dispatch, visualizationsTypesData]);

  const visualizationTypes = useAppSelector(selectStore_UI_Workspace_VisualizationTypesData);
  const nodeTypes = useAppSelector(selectStore_UI_Workspace_NodeTypesData);

  return visualizationTypes && nodeTypes;
};
