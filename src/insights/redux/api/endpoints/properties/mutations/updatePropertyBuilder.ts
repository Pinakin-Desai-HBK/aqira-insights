import { responseValidator } from "src/insights/redux/api/utils/responseValidator";
import { WorkspaceItemIdentifier } from "src/insights/redux/types/redux/networkNodes";
import { UpdatePropertyValuePayload } from "src/insights/redux/types/payload";
import { AppDataApiEndpointBuilder } from "src/insights/redux/types/redux/redux";
import { WorkspaceItemProperty, WorkspaceItemPropertySchema } from "src/insights/redux/types/schemas/workspace-item";

export const updatePropertyBuilder = (builder: AppDataApiEndpointBuilder) => ({
  updateProperty: builder.mutation<
    string,
    {
      item: WorkspaceItemIdentifier;
      propertyName: string;
      details: UpdatePropertyValuePayload;
    }
  >({
    query: ({ propertyName, details, item }) => {
      const { workspace, workspaceItem } = item;
      if (!workspaceItem || !workspace) {
        throw new Error("No workspace item provided for updateProperty");
      }
      const result = {
        url: `${workspace.type}/${workspace.id}/${workspace.type === "Network" ? "Node" : "Visualization"}/${
          workspaceItem.id
        }/Property/${propertyName}/Value`,
        method: "PUT",
        body: details,
        responseHandler: async (response: Response) => {
          return await responseValidator<WorkspaceItemProperty, true>({
            response,
            schema: WorkspaceItemPropertySchema,
            actionLabel: `get ${workspaceItem.type} properties`,
            returnText: true
          });
        }
      };
      return result;
    }
  })
});
