import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import { WorkspaceItemIdentifier } from "src/react/redux/types/redux/networkNodes";
import { AppDataApiEndpointBuilder, Tags } from "src/react/redux/types/redux/redux";
import { WorkspaceItemProperties, WorkspaceItemPropertiesSchema } from "src/react/redux/types/schemas/workspace-item";
import { TagDescription } from "@reduxjs/toolkit/query";

export const getPropertiesBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getProperties: builder.query<string, WorkspaceItemIdentifier>({
    query: (params) => {
      const { workspaceItem, workspace } = params;
      if (!workspaceItem || !workspace) {
        throw new Error("No workspace item provided for getProperties");
      }
      return {
        url: `${workspace.type}/${workspace.id}/${workspace.type === "Dashboard" ? "Visualization" : "Nodes"}/${
          workspaceItem.id
        }/Property`,
        responseHandler: async (response) =>
          await responseValidator<WorkspaceItemProperties, true>({
            response,
            schema: WorkspaceItemPropertiesSchema,
            actionLabel: `get ${workspaceItem.type} properties`,
            returnText: true
          })
      };
    },
    providesTags: (result, error, params) => {
      const {
        workspaceItem: { id }
      } = params;
      const tags: TagDescription<Tags>[] = [{ type: "Properties", id }];
      return tags;
    }
  })
});
