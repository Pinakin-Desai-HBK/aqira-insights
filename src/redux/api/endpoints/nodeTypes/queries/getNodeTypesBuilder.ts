import { convertUIPaletteData } from "src/redux/api/utils/convertUIPaletteData";
import { mapNodes } from "src/redux/api/utils/mappers";
import { responseValidator } from "src/redux/api/utils/responseValidator";
import { NodePaletteData, NodePaletteDataSchema } from "src/redux/types/schemas/palette";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";
import { NodeGroupColor, PaletteData } from "src/redux/types/ui/palette";

export const getNodeTypesBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getNodeTypes: builder.query<PaletteData, void>({
    query: () => ({
      url: `NodeType`,
      responseHandler: async (response) =>
        (await responseValidator<NodePaletteData, false>({
          response,
          schema: NodePaletteDataSchema,
          actionLabel: "get node types"
        })) || []
    }),
    transformResponse: (response: NodePaletteData) => convertUIPaletteData(response.map(mapNodes), NodeGroupColor),
    providesTags: ["NodeTypes"]
  })
});
