import { AppDataApiEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { convertUIPaletteData } from "../../../utils/convertUIPaletteData";
import { VisualizationPaletteData, VisualizationPaletteDataSchema } from "src/insights/redux/types/schemas/palette";
import { PaletteData, VisualizationGroupColor } from "src/insights/redux/types/ui/palette";
import { responseValidator } from "src/insights/redux/api/utils/responseValidator";
import { mapVisualizations } from "src/insights/redux/api/utils/mappers";

export const getVisualizationTypesBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getVisualizationTypes: builder.query<PaletteData, void>({
    query: () => ({
      url: `VisualizationTypes`,
      responseHandler: async (response) =>
        (await responseValidator<VisualizationPaletteData, false>({
          response,
          schema: VisualizationPaletteDataSchema,
          actionLabel: "get visualization types"
        })) || []
    }),
    transformResponse: (response: VisualizationPaletteData) =>
      convertUIPaletteData(response.map(mapVisualizations), VisualizationGroupColor),
    providesTags: ["VisualizationTypes"]
  })
});
