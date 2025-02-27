import { getFolderContentsURL } from "src/react/redux/api/utils/getFolderContentsURL";
import { responseValidator } from "src/react/redux/api/utils/responseValidator";
import { GetFolderContentsParams } from "src/react/redux/types/ui/fileBrowser";
import { FileSystemFolder, FileSystemFolderSchema } from "src/react/redux/types/schemas/fileBrowser";
import { AppDataApiEndpointBuilder } from "src/react/redux/types/redux/redux";

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
