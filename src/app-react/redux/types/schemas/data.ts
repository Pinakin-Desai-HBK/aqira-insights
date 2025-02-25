import { z } from "zod";

export const DataSetArraySchema = z.array(z.string());
export type DataSetArray = z.infer<typeof DataSetArraySchema>;

export const DataRangeSchema = z.object({
  length: z.number(),
  range: z.object({
    start: z.number(),
    end: z.number()
  })
});
export type DataRange = z.infer<typeof DataRangeSchema>;
