import { getFolderContentsURL } from "src/redux/api/utils/getFolderContentsURL";
import { responseValidator } from "src/redux/api/utils/responseValidator";
import { GetFolderContentsParams } from "src/redux/types/ui/fileBrowser";
import { FileSystemFolder, FileSystemFolderSchema } from "src/redux/types/schemas/fileBrowser";
import { AppDataApiEndpointBuilder } from "src/redux/types/redux/redux";

export const getFoldersContentsBuilder = (builder: AppDataApiEndpointBuilder) => ({
  getFoldersContents: builder.query<(FileSystemFolder | null)[], GetFolderContentsParams[]>({
    queryFn: async (args, _queryApi, _extraOptions, fetchWithBQ) => {
      const result = await Promise.all(
        args.map(async (folderContentsParams) => {
          const { data: fileSystemFolder } = await fetchWithBQ({
            method: "GET",
            url: getFolderContentsURL(folderContentsParams),
            responseHandler: async (response) => {
              const validatedResponse = await responseValidator<FileSystemFolder, false>({
                response,
                schema: FileSystemFolderSchema,
                actionLabel: "get folder contents (batch)"
              });
              return validatedResponse;
            }
          });
          return fileSystemFolder ? (fileSystemFolder as FileSystemFolder) : null;
        })
      );
      return { data: result };
    }
  })
});
