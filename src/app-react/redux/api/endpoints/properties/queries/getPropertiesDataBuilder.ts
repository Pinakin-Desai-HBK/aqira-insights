import { responseValidator } from "src/redux/api/utils/responseValidator";
import { WorkspaceItemIdentifier } from "src/redux/types/redux/networkNodes";
import { PropertiesData, PropertiesDataSchema } from "src/redux/types/schemas/properties";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";
import { Workspace } from "src/redux/types/schemas/project";

export const getPropertiesDataBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getPropertiesData: builder.query<string, WorkspaceItemIdentifier>({
    query: (params) => {
      const { workspaceItem, workspace } = params;
      if (!workspaceItem || !workspace) {
        throw new Error("No workspace item provided for getPropertiesData");
      }
      return {
        url: `${workspace.type === "Dashboard" ? "VisualizationType" : "NodeType"}/${workspaceItem.type}/details`,
        responseHandler: async (response) =>
          await responseValidator<PropertiesData, true>({
            response,
            schema: PropertiesDataSchema,
            actionLabel: `get workspace item properties data`,
            returnText: true
          })
      };
    }
  }),
  getPropertiesDataForType: builder.query<string, { type: string; workspaceType: Workspace["type"] }>({
    query: (params) => {
      const { type, workspaceType } = params;
      return {
        url: `${workspaceType === "Dashboard" ? "VisualizationType" : "NodeType"}/${type}/details`,
        responseHandler: async (response) =>
          await responseValidator<PropertiesData, true>({
            response,
            schema: PropertiesDataSchema,
            actionLabel: `get workspace item properties data`,
            returnText: true
          })
      };
    }
  })
});
