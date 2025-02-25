import { z } from "zod";

/* Schemas */
const FileSystemContentItemSchema = z.object({
  containsSubFolders: z.boolean(),
  fullName: z.string(),
  lastWriteTimeUtc: z.string(),
  name: z.string(),
  type: z.string()
});

export const FileSystemFolderSchema = z.object({
  content: z.array(FileSystemContentItemSchema),
  endFileIndex: z.number(),
  folderFullName: z.string().nullable(),
  folderName: z.string().nullable(),
  startFileIndex: z.number(),
  totalFiles: z.number()
});

/* Types */
export type FileSystemContentItem = z.infer<typeof FileSystemContentItemSchema>;

export type FileSystemFolder = z.infer<typeof FileSystemFolderSchema>;
