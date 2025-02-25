import { responseValidator } from "src/redux/api/utils/responseValidator";
import { LoadProjectPayload } from "src/redux/types/payload";
import { Project, ProjectSchema } from "src/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const saveProjectBuilder = (builder: AppDataApiEndpointBuilder) => ({
  saveProject: builder.mutation<Project, LoadProjectPayload>({
    query: ({ filepath }) => ({
      url: `Project/Save`,
      method: "POST",
      body: { filepath },
      responseHandler: async (response) =>
        await responseValidator<Project, false>({
          response,
          schema: ProjectSchema,
          actionLabel: "post save project"
        })
    }),
    transformErrorResponse: (error) => {
      return error.data;
    }
  })
});
