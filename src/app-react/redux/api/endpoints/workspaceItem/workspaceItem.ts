import { AIEndpointBuilder } from "src/redux/types/redux/redux";
import { getWorkspaceItemsBuilder } from "./queries/getWorkspaceItemsBuilder";
import { deleteWorkspaceItemBuilder } from "./mutations/deleteWorkspaceItemBuilder";
import { updateWorkspaceItemPositionBuilder } from "./mutations/updateWorkspaceItemPositionBuilder";
import { updateWorkspaceItemNameBuilder } from "./mutations/updateWorkspaceItemNameBuilder";

export const getWorkspaceItemApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getWorkspaceItemsBuilder(builder),
  ...deleteWorkspaceItemBuilder(builder),
  ...updateWorkspaceItemPositionBuilder(builder),
  ...updateWorkspaceItemNameBuilder(builder)
});
