import { AIEndpointBuilder } from "src/redux/types/redux/redux";
import { getFolderContentsBuilder } from "./queries/getFolderContentsBuilder";
import { getFoldersContentsBuilder } from "./queries/getFoldersContentsBuilder";

export const getFileSystemApiEndpoints = (builder: AIEndpointBuilder<"appDataApi">) => ({
  ...getFolderContentsBuilder(builder),
  ...getFoldersContentsBuilder(builder)
});
