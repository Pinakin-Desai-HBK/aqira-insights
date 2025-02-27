import { responseValidator } from "src/insights/redux/api/utils/responseValidator";
import { CreateNodePayload } from "src/insights/redux/types/payload";
import { Workspace } from "src/insights/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { NetworkNodeDataApi, NetworkNodeDataSchema } from "src/insights/redux/types/schemas/networkNodes";

export const createNetworkNodeBuilder = (builder: AppDataApiEndpointBuilder) => ({
  createNetworkNode: builder.mutation<NetworkNodeDataApi, { workspace: Workspace; payload: CreateNodePayload }>({
    query: ({ workspace, payload }) => ({
      url: `Network/${workspace.id}/Node`,
      method: "POST",
      body: payload,
      responseHandler: async (response) =>
        await responseValidator<NetworkNodeDataApi, false>({
          response,
          schema: NetworkNodeDataSchema,
          actionLabel: "post network node"
        })
    })
  })
});
