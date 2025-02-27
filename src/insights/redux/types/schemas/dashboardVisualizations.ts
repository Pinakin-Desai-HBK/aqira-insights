import { z } from "zod";

export const TableKey = "Table" as const;
export const TimeSeriesKey = "TimeSeries" as const;
export const TextAreaKey = "TextArea" as const;
export const HistogramKey = "Histogram" as const;
export const Histogram3DKey = "Histogram3D" as const;

export type TableKey = typeof TableKey;
export type TimeSeriesKey = typeof TimeSeriesKey;
export type TextAreaKey = typeof TextAreaKey;
export type HistogramKey = typeof HistogramKey;
export type Histogram3DKey = typeof Histogram3DKey;

const VisualizationsList = [TableKey, TimeSeriesKey, TextAreaKey, HistogramKey, Histogram3DKey] as const;
export type VisTypes = (typeof VisualizationsList)[number];

const PositionSchema = z.object({
  x: z.number(),
  y: z.number()
});

export const DashboardVisualizationDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  position: PositionSchema,
  color: z.string().optional(),
  icon: z.string().optional(),
  type: z.enum(VisualizationsList)
});

export const DashboardVisualizationMinimumDimensionsSchema = z.object({
  minWidth: z.number(),
  minHeight: z.number()
});
export type DashboardVisualizationMinimumDimensions = z.infer<typeof DashboardVisualizationMinimumDimensionsSchema>;

export type DashboardVisualizationDataApi = z.infer<typeof DashboardVisualizationDataSchema> & { type: VisTypes };

export const DashboardVisualizationDataArraySchema = z.array(DashboardVisualizationDataSchema);
export type DashboardVisualizationDataArrayApi = z.infer<typeof DashboardVisualizationDataArraySchema>;
