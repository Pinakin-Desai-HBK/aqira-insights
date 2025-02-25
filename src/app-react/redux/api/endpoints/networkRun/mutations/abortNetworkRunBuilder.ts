import { responseValidator } from "src/redux/api/utils/responseValidator";
import { NetworkRunDetails, NetworkRunDetailsSchema } from "src/redux/types/schemas/networkRun";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const abortNetworkRunBuilder = (builder: AppDataApiEndpointBuilder) => ({
  abortNetworkRun: builder.mutation<NetworkRunDetails, { runId: string }>({
    query: ({ runId }) => ({
      url: `NetworkRun/${runId}/Abort`,
      method: "POST",
      body: {},
      responseHandler: async (response) =>
        await responseValidator<NetworkRunDetails, false>({
          response,
          schema: NetworkRunDetailsSchema,
          actionLabel: "post abort network run"
        })
    })
  })
});
