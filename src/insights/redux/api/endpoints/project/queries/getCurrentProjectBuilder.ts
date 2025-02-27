import { responseValidator } from "src/insights/redux/api/utils/responseValidator";
import { Project, ProjectSchema } from "src/insights/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/insights/redux/types/redux/redux";

export const getCurrentProjectBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getCurrentProject: builder.query<Project, void>({
    query: () => ({
      url: `Project`,
      responseHandler: async (response) =>
        await responseValidator<Project, false>({
          response,
          schema: ProjectSchema,
          actionLabel: "get current project"
        })
    }),
    providesTags: [{ type: "Project" }]
  })
});
