import { getFolderContentsURL } from "src/insights/redux/api/utils/getFolderContentsURL";
import { responseValidator } from "src/insights/redux/api/utils/responseValidator";
import { GetFolderContentsParams } from "src/insights/redux/types/ui/fileBrowser";
import { FileSystemFolder, FileSystemFolderSchema } from "src/insights/redux/types/schemas/fileBrowser";
import { AppDataApiEndpointBuilder } from "src/insights/redux/types/redux/redux";

export const getFolderContentsBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getFolderContents: builder.query<FileSystemFolder, GetFolderContentsParams>({
    query: (folderContentsParams) => ({
      method: "GET",
      url: getFolderContentsURL(folderContentsParams),
      responseHandler: async (response) =>
        await responseValidator<FileSystemFolder, false>({
          response,
          schema: FileSystemFolderSchema,
          actionLabel: "get folder contents"
        })
    })
  })
});
