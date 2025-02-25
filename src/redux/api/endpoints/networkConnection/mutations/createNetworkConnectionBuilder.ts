import { responseValidator } from "src/redux/api/utils/responseValidator";
import { CreateEdgePayload } from "src/redux/types/payload";
import { Workspace } from "src/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";
import { NetworkEdgeData, NetworkEdgeDataArraySchema } from "src/redux/types/schemas/networkNodes";

export const createNetworkConnectionBuilder = (builder: AppDataApiEndpointBuilder) => ({
  createNetworkConnection: builder.mutation<
    NetworkEdgeData[],
    { workspace: Workspace; edgeDetails: CreateEdgePayload }
  >({
    query: ({ workspace, edgeDetails }) => ({
      url: `Network/${workspace.id}/Connection`,
      method: "POST",
      body: edgeDetails,
      responseHandler: async (response) =>
        await responseValidator<NetworkEdgeData[], false>({
          response,
          schema: NetworkEdgeDataArraySchema,
          actionLabel: "post network edge"
        })
    })
  })
});
