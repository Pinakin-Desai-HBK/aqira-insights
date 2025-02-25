import { getFolderContentsURL } from "src/redux/api/utils/getFolderContentsURL";
import { responseValidator } from "src/redux/api/utils/responseValidator";
import { GetFolderContentsParams } from "src/redux/types/ui/fileBrowser";
import { FileSystemFolder, FileSystemFolderSchema } from "src/redux/types/schemas/fileBrowser";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

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
