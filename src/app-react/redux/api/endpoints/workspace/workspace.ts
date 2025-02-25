import { AIEndpointBuilder } from "src/redux/types/redux/redux";
import { getWorkspacesBuilder } from "./queries/getWorkspacesBuilder";
import { createWorkspaceBuilder } from "./mutations/createWorkspaceBuilder";
import { deleteWorkspaceBuilder } from "./mutations/deleteWorkspaceBuilder";
import { updateWorkspaceIndexBuilder } from "./mutations/updateWorkspaceIndexBuilder";
import { exportAsPythonBuilder } from "./mutations/exportAsPythonBuilder";
import { updateWorkspaceNameBuilder } from "./mutations/updateWorkspaceNameBuilder";

export const getWorkspaceApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getWorkspacesBuilder(builder),
  ...createWorkspaceBuilder(builder),
  ...deleteWorkspaceBuilder(builder),
  ...updateWorkspaceNameBuilder(builder),
  ...updateWorkspaceIndexBuilder(builder),
  ...exportAsPythonBuilder(builder)
});
