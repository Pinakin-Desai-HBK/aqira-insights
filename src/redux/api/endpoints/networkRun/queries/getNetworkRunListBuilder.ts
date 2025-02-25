import { TagDescription } from "@reduxjs/toolkit/query";
import { responseValidator } from "src/redux/api/utils/responseValidator";
import { NetworkRunList, NetworkRunListSchema } from "src/redux/types/schemas/networkRun";
import { AppDataApiEndpointBuilder, Tags } from "src/redux/types/redux/redux";

export const getNetworkRunListBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getNetworkRunList: builder.query<NetworkRunList, void>({
    query: () => ({
      url: `NetworkRun`,
      responseHandler: async (response) =>
        await responseValidator<NetworkRunList, false>({
          response,
          schema: NetworkRunListSchema,
          actionLabel: "get network run list"
        })
    }),
    providesTags: (result) => {
      const tags: TagDescription<Tags>[] = (result || []).reduce((result, run) => {
        return [
          ...result,
          { type: "NetworkRun", id: `${run.networkId}/LIST` },
          { type: "NetworkRun", id: `${run.networkId}/${run.runId}` }
        ];
      }, [] as TagDescription<Tags>[]);
      return [{ type: "NetworkRun", id: "LIST" }, ...tags];
    }
  })
});
