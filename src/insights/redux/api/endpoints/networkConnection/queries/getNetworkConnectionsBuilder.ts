import { TagDescription } from "@reduxjs/toolkit/query";
import { responseValidator } from "src/insights/redux/api/utils/responseValidator";
import { Workspace } from "src/insights/redux/types/schemas/project";
import { AppDataApiEndpointBuilder, Tags } from "src/insights/redux/types/redux/redux";
import { NetworkEdgeData, NetworkEdgeDataArraySchema } from "src/insights/redux/types/schemas/networkNodes";

export const getNetworkConnectionsBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getNetworkConnections: builder.query<NetworkEdgeData[], { workspace: Workspace }>({
    query: ({ workspace }) => ({
      url: `Network/${workspace.id}/Connection`,
      responseHandler: async (response) =>
        await responseValidator<NetworkEdgeData[], false>({
          response,
          schema: NetworkEdgeDataArraySchema,
          actionLabel: "get network edges"
        })
    }),
    providesTags: (result, error, args) => {
      const tags: TagDescription<Tags>[] = (result || []).reduce((result, connection) => {
        return [
          ...result,
          {
            type: "NetworkEdges",
            id: `${args.workspace.id}/${connection.sourceNode}-${connection.destinationNode}`
          },
          { type: "NetworkEdges", id: `${args.workspace.id}/${connection.sourceNode}-ANY` },
          { type: "NetworkEdges", id: `${args.workspace.id}/ANY-${connection.destinationNode}` }
        ];
      }, [] as TagDescription<Tags>[]);
      return [...tags, { type: "NetworkEdges", id: `${args.workspace.id}/LIST` }];
    }
  })
});
