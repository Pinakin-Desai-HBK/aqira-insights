import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import { CreateEdgePayload } from "src/react/redux/types/payload";
import { Workspace } from "src/react/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";
import { NetworkEdgeData, NetworkEdgeDataArraySchema } from "src/react/redux/types/schemas/networkNodes";

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
