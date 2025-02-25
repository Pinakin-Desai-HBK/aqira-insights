import { z } from "zod";

const PositionSchema = z.object({
  x: z.number(),
  y: z.number()
});

const PortDataSchema = z.object({
  name: z.string()
});

export const NetworkNodeDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  position: PositionSchema,
  color: z.string().optional(),
  icon: z.string().optional(),
  type: z.string(),
  inputPorts: z.array(PortDataSchema),
  outputPorts: z.array(PortDataSchema)
});
export type NetworkNodeDataApi = z.infer<typeof NetworkNodeDataSchema>;

export const NetworkNodeDataArraySchema = z.array(NetworkNodeDataSchema);
export type NetworkNodeDataArrayApi = z.infer<typeof NetworkNodeDataArraySchema>;

const NetworkEdgeDataSchema = z.object({
  sourceNode: z.string(),
  destinationNode: z.string(),
  sourcePort: PortDataSchema,
  destinationPort: PortDataSchema
});

export const NetworkEdgeDataArraySchema = z.array(NetworkEdgeDataSchema);
export type NetworkEdgeData = z.infer<typeof NetworkEdgeDataSchema>;
