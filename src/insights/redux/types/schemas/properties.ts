import { z } from "zod";

const PropertyStringSchema = z.object({
  disabled: z.boolean().optional(),
  name: z.string(),
  type: z.literal("String"),
  supportsExpression: z.boolean(),
  description: z.string()
});

const PropertyEnumSchema = z.object({
  disabled: z.boolean().optional(),
  name: z.string(),
  type: z.literal("Enum"),
  validValues: z.array(z.string()).optional(),
  supportsExpression: z.boolean(),
  description: z.string()
});
export type PropertyEnum = z.infer<typeof PropertyEnumSchema>;

const PropertyDoubleSchema = z.object({
  allowLowerLimit: z.boolean().optional(),
  allowUpperLimit: z.boolean().optional(),
  disabled: z.boolean().optional(),
  lowerLimit: z.number().optional(),
  name: z.string(),
  type: z.literal("Double"),
  upperLimit: z.number().optional(),
  supportsExpression: z.boolean(),
  description: z.string()
});
export type PropertyDouble = z.infer<typeof PropertyDoubleSchema>;

const PropertyIntegerSchema = z.object({
  allowLowerLimit: z.boolean().optional(),
  allowUpperLimit: z.boolean().optional(),
  disabled: z.boolean().optional(),
  lowerLimit: z.number().optional(),
  name: z.string(),
  type: z.literal("Integer"),
  upperLimit: z.number().optional(),
  supportsExpression: z.boolean(),
  description: z.string()
});
export type PropertyInteger = z.infer<typeof PropertyIntegerSchema>;

const PropertyBoolSchema = z.object({
  disabled: z.boolean().optional(),
  name: z.string(),
  type: z.literal("Bool"),
  supportsExpression: z.boolean(),
  description: z.string()
});
export type PropertyBool = z.infer<typeof PropertyBoolSchema>;

const PropertyRichTextSchema = z.object({
  disabled: z.boolean().optional(),
  name: z.string(),
  type: z.literal("RichText"),
  supportsExpression: z.boolean(),
  description: z.string()
});
export type PropertyRichText = z.infer<typeof PropertyRichTextSchema>;

const PropertyPythonSchema = z.object({
  disabled: z.boolean().optional(),
  name: z.string(),
  type: z.literal("Python"),
  supportsExpression: z.boolean(),
  description: z.string()
});

const PropertyStringListSchema = z.object({
  disabled: z.boolean().optional(),
  name: z.string(),
  type: z.literal("StringList"),
  supportsExpression: z.boolean(),
  description: z.string()
});
export type PropertyStringList = z.infer<typeof PropertyStringListSchema>;

const PropertySchema = z.discriminatedUnion("type", [
  PropertyBoolSchema,
  PropertyIntegerSchema,
  PropertyDoubleSchema,
  PropertyEnumSchema,
  PropertyStringSchema,
  PropertyRichTextSchema,
  PropertyPythonSchema,
  PropertyStringListSchema
]);
export type Property = z.infer<typeof PropertySchema>;

const PropertiesGroupDataSchema = z.object({
  name: z.string(),
  properties: z.array(PropertySchema)
});
export type PropertyGroupData = {
  name: string;
  properties: Property[];
};

export const PropertiesDataSchema = z.object({
  type: z.string(),
  name: z.string().nullable(),
  description: z.string(),
  icon: z.string(),
  propertyGroups: z.array(PropertiesGroupDataSchema),
  inputs: z.array(z.string()).nullable().optional(),
  outputs: z.array(z.string()).nullable().optional()
});
export type PropertiesData = z.infer<typeof PropertiesDataSchema>;
