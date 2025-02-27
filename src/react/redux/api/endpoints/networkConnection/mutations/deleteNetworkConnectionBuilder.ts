import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import { DeleteEdgePayload } from "src/react/redux/types/payload";
import { Workspace } from "src/react/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";
import { NetworkEdgeData, NetworkEdgeDataArraySchema } from "src/react/redux/types/schemas/networkNodes";

export const deleteNetworkConnectionBuilder = (builder: AppDataApiEndpointBuilder) => ({
  deleteNetworkConnection: builder.mutation<
    NetworkEdgeData[],
    { workspace: Workspace; edgeDetails: DeleteEdgePayload }
  >({
    query: ({ workspace, edgeDetails }) => ({
      url: `Network/${workspace.id}/Connection`,
      method: "DELETE",
      body: edgeDetails,
      responseHandler: async (response) =>
        await responseValidator<NetworkEdgeData[], false>({
          response,
          schema: NetworkEdgeDataArraySchema,
          actionLabel: "delete network edge"
        })
    })
  })
});
