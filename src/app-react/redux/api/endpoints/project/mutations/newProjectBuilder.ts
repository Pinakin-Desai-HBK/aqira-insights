import { responseValidator } from "src/redux/api/utils/responseValidator";
import { NewProject, NewProjectSchema } from "src/redux/types/schemas/project";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const newProjectBuilder = (builder: AppDataApiEndpointBuilder) => ({
  newProject: builder.mutation<NewProject, void>({
    query: () => ({
      url: `Project/New`,
      method: "POST",
      body: {},
      responseHandler: async (response) =>
        await responseValidator<NewProject, false>({
          response,
          schema: NewProjectSchema,
          actionLabel: "post new project"
        })
    }),
    transformErrorResponse: (error) => {
      return error.data;
    }
  })
});
