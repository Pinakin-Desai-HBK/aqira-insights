import { responseValidator } from "src/redux/api/utils/responseValidator";
import { CreateVisualizationPayload } from "src/redux/types/payload";
import { Workspace } from "src/redux/types/schemas/project";
import {
  DashboardVisualizationDataApi,
  DashboardVisualizationDataSchema
} from "src/redux/types/schemas/dashboardVisualizations";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const createDashboardVisualizationBuilder = (builder: AppDataApiEndpointBuilder) => ({
  createDashboardVisualization: builder.mutation<
    DashboardVisualizationDataApi,
    { workspace: Workspace; payload: CreateVisualizationPayload }
  >({
    query: ({ workspace, payload }) => ({
      url: `Dashboard/${workspace.id}/Visualization`,
      method: "POST",
      body: payload,
      responseHandler: async (response) =>
        await responseValidator<DashboardVisualizationDataApi, false>({
          response,
          schema: DashboardVisualizationDataSchema,
          actionLabel: "post dashboard visualization"
        })
    })
  })
});
