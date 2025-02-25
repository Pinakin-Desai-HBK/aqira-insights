import { z } from "zod";

const PaletteItemDataSchema = z.object({
  type: z.string(),
  name: z.string().nullable(),
  icon: z.string(),
  description: z.string()
});

const NodePaletteGroupDataSchema = z.object({
  nodes: z.array(PaletteItemDataSchema),
  group: z.string()
});
export type NodePaletteGroupData = z.infer<typeof NodePaletteGroupDataSchema>;

const VisualizationPaletteGroupDataSchema = z.object({
  visualizations: z.array(PaletteItemDataSchema),
  group: z.string()
});
export type VisualizationPaletteGroupData = z.infer<typeof VisualizationPaletteGroupDataSchema>;

export const NodePaletteDataSchema = z.array(NodePaletteGroupDataSchema);
export type NodePaletteData = z.infer<typeof NodePaletteDataSchema>;

export const VisualizationPaletteDataSchema = z.array(VisualizationPaletteGroupDataSchema);
export type VisualizationPaletteData = z.infer<typeof VisualizationPaletteDataSchema>;
