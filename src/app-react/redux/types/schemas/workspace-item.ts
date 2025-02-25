import { z } from "zod";

const PropertySettingSchema = z.enum(["Value", "Expression"]);

export const WorkspaceItemPropertySchema = z.discriminatedUnion("type", [
  z.object({
    expression: z.string().nullable(),
    setting: PropertySettingSchema,
    type: z.literal("String"),
    value: z.string().nullable()
  }),
  z.object({
    expression: z.string().nullable(),
    setting: PropertySettingSchema,
    type: z.literal("Integer"),
    value: z.number().nullable()
  }),
  z.object({
    expression: z.string().nullable(),
    setting: PropertySettingSchema,
    type: z.literal("Boolean"),
    value: z.boolean().nullable()
  }),
  z.object({
    expression: z.string().nullable(),
    setting: PropertySettingSchema,
    type: z.literal("Double"),
    value: z.number().nullable()
  }),
  z.object({
    expression: z.string().nullable(),
    setting: PropertySettingSchema,
    type: z.literal("Enum"),
    value: z.string().nullable()
  }),
  z.object({
    expression: z.string().nullable(),
    setting: PropertySettingSchema,
    type: z.literal("RichText"),
    value: z.string().nullable()
  }),
  z.object({
    expression: z.string().nullable(),
    setting: PropertySettingSchema,
    type: z.literal("Python"),
    value: z.string().nullable()
  }),
  z.object({
    expression: z.string().nullable(),
    setting: PropertySettingSchema,
    type: z.literal("StringList"),
    value: z.array(z.string()).nullable()
  })
]);
export type WorkspaceItemProperty = z.infer<typeof WorkspaceItemPropertySchema>;

export const WorkspaceItemPropertiesSchema = z.record(z.string(), WorkspaceItemPropertySchema);
export type WorkspaceItemProperties = z.infer<typeof WorkspaceItemPropertiesSchema>;
