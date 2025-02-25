import { z } from "zod";

export const CreateWorkspaceSchema = z.object({
  type: z.enum(["Network", "Dashboard"])
});
export type CreateWorkspace = z.infer<typeof CreateWorkspaceSchema>;

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["Network", "Dashboard"])
});
export type Workspace = z.infer<typeof WorkspaceSchema>;

export const WorkspaceArraySchema = z.array(WorkspaceSchema);
export type WorkspaceArray = z.infer<typeof WorkspaceArraySchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  filepath: z.string().or(z.null()),
  modified: z.boolean()
});
export type Project = z.infer<typeof ProjectSchema>;

export const NewProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string().or(z.undefined())
});
export type NewProject = z.infer<typeof NewProjectSchema>;

export const ProjectCreatedEventSchema = z.object({
  projectId: z.string(),
  timestamp: z.string()
});

export const EmptyObjectSchema = z.object({});
export type EmptyObject = z.infer<typeof EmptyObjectSchema>;
