import { responseValidator } from "src/redux/api/utils/responseValidator";
import { AboutData, AboutDataSchema } from "src/redux/types/schemas/about";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const getAboutDataBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getAboutData: builder.query<AboutData, void>({
    query: () => ({
      url: `ApplicationInformation`,
      responseHandler: async (response) =>
        await responseValidator<AboutData, false>({
          response,
          schema: AboutDataSchema,
          actionLabel: "get about data"
        })
    }),
    providesTags: ["AboutData"]
  })
});
