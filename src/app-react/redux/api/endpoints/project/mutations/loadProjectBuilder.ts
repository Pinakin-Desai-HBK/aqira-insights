import { responseValidator } from "src/redux/api/utils/responseValidator";
import { LoadProjectPayload } from "src/redux/types/payload";
import { Project, ProjectSchema } from "src/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const loadProjectBuilder = (builder: AppDataApiEndpointBuilder) => ({
  loadProject: builder.mutation<Project, LoadProjectPayload>({
    query: ({ filepath }) => ({
      url: `Project/Load`,
      method: "POST",
      body: { filepath },
      responseHandler: async (response) =>
        await responseValidator<Project, false>({
          response,
          schema: ProjectSchema,
          actionLabel: "post current project"
        })
    })
  })
});
