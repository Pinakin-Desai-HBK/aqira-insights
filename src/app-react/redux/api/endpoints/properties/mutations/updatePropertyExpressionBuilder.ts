import { responseValidator } from "src/redux/api/utils/responseValidator";
import { WorkspaceItemIdentifier } from "src/redux/types/redux/networkNodes";
import { UpdatePropertyExpressionPayload } from "src/redux/types/payload";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";
import { WorkspaceItemProperty, WorkspaceItemPropertySchema } from "src/redux/types/schemas/workspace-item";

export const updatePropertyExpressionBuilder = (builder: AppDataApiEndpointBuilder) => ({
  updatePropertyExpression: builder.mutation<
    string,
    {
      item: WorkspaceItemIdentifier;
      propertyName: string;
      details: UpdatePropertyExpressionPayload;
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
        }/Property/${propertyName}/Expression`,
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
