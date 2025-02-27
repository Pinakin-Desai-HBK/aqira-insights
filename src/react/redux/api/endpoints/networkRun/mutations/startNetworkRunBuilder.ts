import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import { NetworkRunList, NetworkRunListSchema } from "src/react/redux/types/schemas/networkRun";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";

export const startNetworkRunBuilder = (builder: AppDataApiEndpointBuilder) => ({
  startNetworkRun: builder.mutation<NetworkRunList, { networkId: string }>({
    query: ({ networkId }) => ({
      url: `Network/${networkId}/Run`,
      method: "POST",
      body: {},
      responseHandler: async (response) =>
        await responseValidator<NetworkRunList, false>({
          response,
          schema: NetworkRunListSchema,
          actionLabel: "post network run"
        })
    })
  })
});
