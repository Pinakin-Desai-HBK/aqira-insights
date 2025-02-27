import { TagDescription } from "@reduxjs/toolkit/query";
import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import {
  DashboardVisualizationDataArrayApi,
  DashboardVisualizationDataArraySchema,
  DashboardVisualizationMinimumDimensions
} from "src/react/redux/types/schemas/dashboardVisualizations";
import { AppDataApiEndpointBuilder, Tags } from "src/react/redux/types/redux/redux";
import { DashboardVisualizationDataUI } from "src/react/redux/types/ui/dashboardVisualization";
import { NetworkNodeDataUI } from "src/react/redux/types/ui/networkNodes";
import { NetworkNodeDataArrayApi, NetworkNodeDataArraySchema } from "src/react/redux/types/schemas/networkNodes";
import { PropertiesData, PropertiesDataSchema } from "src/react/redux/types/schemas/properties";
import { getMinimumVisualizationDimensions } from "src/react/redux/api/utils/getMinimumVisualizationDimensions";
import { Node } from "reactflow";
import { TypedWorkspace, WorkspaceItems } from "src/react/redux/types/redux/workspaces";
import { WorkspaceTypes } from "src/react/redux/types/redux/workspaces";
import { RootState } from "src/react/redux/store";

export const getWorkspaceItemsBuilder = <T extends WorkspaceTypes>(builder: AppDataApiEndpointBuilder) => ({
  getWorkspaceItems: builder.query<
    WorkspaceItems<T>,
    { workspace: TypedWorkspace<T>; selectedWorkspaceItemsIds: string[] }
  >({
    extraOptions: {
      pollingInterval: 10000
    },
    queryFn: async (args, { getState }, _extraOptions, fetchWithBQ) => {
      const typesData = (getState() as RootState).ui.workspace.typesData;

      const { workspace, selectedWorkspaceItemsIds } = args;

      const { data: rawWorkspaceItems } = await fetchWithBQ({
        url: workspace.type === "Network" ? `Network/${workspace.id}/Node` : `Dashboard/${workspace.id}/Visualization`,
        responseHandler: async (response) => {
          const validatedResponse =
            workspace.type === "Network"
              ? await responseValidator<NetworkNodeDataArrayApi, false>({
                  response,
                  schema: NetworkNodeDataArraySchema,
                  actionLabel: "get network nodes"
                })
              : await responseValidator<DashboardVisualizationDataArrayApi, false>({
                  response,
                  schema: DashboardVisualizationDataArraySchema,
                  actionLabel: "get dahsboard visualizations"
                });

          return "map" in validatedResponse
            ? validatedResponse.map((node) => {
                return {
                  ...node,
                  workspace
                };
              })
            : validatedResponse;
        }
      });
      const type: WorkspaceTypes = workspace.type;
      if (type === "Network") {
        const data = (rawWorkspaceItems as NetworkNodeDataArrayApi)
          .map((currentNode) => {
            const { color, description, icon } = typesData["Network"]!.itemsMap[currentNode.type]!;
            const node: Node<NetworkNodeDataUI> = {
              data: {
                ...currentNode,
                color,
                description,
                icon,
                identifier: { workspace, workspaceItem: { id: currentNode.id, type: currentNode.type } }
              },
              id: currentNode.id,
              position: currentNode.position,
              type: "aiNode" as const,
              selected: selectedWorkspaceItemsIds.find((item) => item === currentNode.id) !== undefined
            };
            return node;
          })
          .filter((v) => v !== null);
        const result: WorkspaceItems<"Network"> = {
          workspaceType: type,
          workspaceItems: data
        };
        return { data: result as WorkspaceItems<T> };
      }
      if (type === "Dashboard") {
        const data = (
          await Promise.all(
            (rawWorkspaceItems as DashboardVisualizationDataArrayApi).map(async (currentVis) => {
              const { data: minimumuDimensionsDetails } = await fetchWithBQ({
                url: `VisualizationType/${currentVis.type}/details`,
                responseHandler: async (response) => {
                  const validatedResponse = await responseValidator<PropertiesData, false>({
                    response,
                    schema: PropertiesDataSchema,
                    actionLabel: `get ${currentVis.type} type properties data`
                  });
                  return "propertyGroups" in validatedResponse
                    ? getMinimumVisualizationDimensions(validatedResponse.propertyGroups)
                    : validatedResponse;
                }
              });
              if (!minimumuDimensionsDetails) return null;
              const minimumDimensions = minimumuDimensionsDetails as DashboardVisualizationMinimumDimensions;
              const { color, description, icon } = typesData["Dashboard"]!.itemsMap[currentVis.type]!;
              const node: Node<DashboardVisualizationDataUI> = {
                data: {
                  ...currentVis,
                  color,
                  description,
                  icon,
                  minimumDimensions,
                  identifier: { workspace, workspaceItem: { id: currentVis.id, type: currentVis.type } }
                },
                id: currentVis.id,
                position: currentVis.position,
                type: "aiVisualization" as const,
                selected: selectedWorkspaceItemsIds.find((item) => item === currentVis.id) !== undefined
              };
              return node;
            })
          )
        ).filter((v) => v !== null);

        const result: WorkspaceItems<"Dashboard"> = {
          workspaceType: type,
          workspaceItems: data
        };
        return { data: result as WorkspaceItems<T> };
      }
      throw new Error("Invalid workspace type");
    },
    providesTags: (result, error, args) => {
      const items = result ? result.workspaceItems : [];
      const tagType = args.workspace.type === "Network" ? "NetworkNodes" : "DashboardVisualizations";
      const tags: TagDescription<Tags>[] = [
        { type: tagType, id: `${args.workspace.id}/LIST` },
        ...items.map((node) => {
          const tag: TagDescription<Tags> = { type: tagType, id: `${args.workspace.id}/${node.id}` };
          return tag;
        })
      ];
      return tags;
    }
  })
});
