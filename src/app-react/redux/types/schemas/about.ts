import { z } from "zod";

const VersionsDataSchema = z.object({
  label: z.string(),
  version: z.string()
});
export type VersionsData = z.infer<typeof VersionsDataSchema>;

export const AboutDataSchema = z.object({
  productName: z.string(),
  release: z.string(),
  productVersions: z.array(VersionsDataSchema),
  componentVersions: z.array(VersionsDataSchema)
});
export type AboutData = z.infer<typeof AboutDataSchema>;
