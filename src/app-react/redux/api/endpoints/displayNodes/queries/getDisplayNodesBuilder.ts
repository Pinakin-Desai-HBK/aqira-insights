import { responseValidator } from "src/redux/api/utils/responseValidator";
import { NetworkDisplayNodeArraySchema } from "src/redux/types/schemas/dataExplorer";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";
import { NetworkDisplayNodeArray, NetworkDisplayNodeItem } from "src/redux/types/ui/dataExplorer";

export const getDisplayNodesBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getDisplayNodes: builder.query<NetworkDisplayNodeItem[], void>({
    query: () => ({
      url: `DisplayNodes`,
      responseHandler: async (response) =>
        await responseValidator<NetworkDisplayNodeArray, false>({
          response,
          schema: NetworkDisplayNodeArraySchema,
          actionLabel: "get display nodes"
        })
    }),
    transformResponse: (response: NetworkDisplayNodeArray) =>
      response.flatMap((item) =>
        item.nodes.map((node) => ({
          type: "DisplayNode",
          item,
          node
        }))
      ),
    providesTags: [{ type: "DisplayNodes" }]
  })
});
