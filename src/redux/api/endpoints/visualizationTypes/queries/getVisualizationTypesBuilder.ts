import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";
import { convertUIPaletteData } from "../../../utils/convertUIPaletteData";
import { VisualizationPaletteData, VisualizationPaletteDataSchema } from "src/redux/types/schemas/palette";
import { PaletteData, VisualizationGroupColor } from "src/redux/types/ui/palette";
import { responseValidator } from "src/redux/api/utils/responseValidator";
import { mapVisualizations } from "src/redux/api/utils/mappers";

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
