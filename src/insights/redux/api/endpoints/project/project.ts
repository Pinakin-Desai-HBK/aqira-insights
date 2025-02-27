import { AIEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { getCurrentProjectBuilder } from "./queries/getCurrentProjectBuilder";
import { loadProjectBuilder } from "./mutations/loadProjectBuilder";
import { saveProjectBuilder } from "./mutations/saveProjectBuilder";
import { newProjectBuilder } from "./mutations/newProjectBuilder";

export const getProjectApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getCurrentProjectBuilder(builder),
  ...loadProjectBuilder(builder),
  ...saveProjectBuilder(builder),
  ...newProjectBuilder(builder)
});
