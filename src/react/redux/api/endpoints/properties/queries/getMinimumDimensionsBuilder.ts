import { getMinimumVisualizationDimensions } from "src/react/redux/api/utils/getMinimumVisualizationDimensions";
import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import { WorkspaceItemsIdentifier } from "src/react/redux/types/redux/networkNodes";
import { PropertiesData, PropertiesDataSchema } from "src/react/redux/types/schemas/properties";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";
import { MinimumDimensionsDetails } from "src/react/redux/types/ui/dashboardVisualization";

export const getMinimumDimensionsBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getMinimumDimensions: builder.query<MinimumDimensionsDetails[] | null, WorkspaceItemsIdentifier>({
    queryFn: async (args, _queryApi, _extraOptions, fetchWithBQ) => {
      const { workspaceItems, workspace } = args;
      if (workspace.type !== "Dashboard")
        throw new Error("Minimum dimensions are only available for dashboard visualizations");
      const result = await Promise.all(
        workspaceItems.map(async (workspaceItem) => {
          const { type } = workspaceItem;
          const { data: minimimuDimensionsDetails } = await fetchWithBQ({
            url: `${workspace.type === "Dashboard" ? "VisualizationType" : "NodeType"}/${type}/details`,
            responseHandler: async (response) => {
              const validatedResponse = await responseValidator<PropertiesData, false>({
                response,
                schema: PropertiesDataSchema,
                actionLabel: `get ${type} type properties data`
              });
              return "propertyGroups" in validatedResponse
                ? {
                    workspaceItem,
                    minimumDimensions: getMinimumVisualizationDimensions(validatedResponse.propertyGroups)
                  }
                : validatedResponse;
            }
          });
          return (minimimuDimensionsDetails as MinimumDimensionsDetails) ?? null;
        })
      );
      return { data: result };
    }
  })
});
