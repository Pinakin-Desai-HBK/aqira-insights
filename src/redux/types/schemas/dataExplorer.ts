import { z } from "zod";

/* File Explorer Schemas */
export const DataFileSchema = z.object({
  creationTimeUtc: z.string(),
  fileSize: z.number(),
  fullName: z.string(),
  name: z.string(),
  lastWriteTimeUtc: z.string()
});

export const DataFilesSchema = z.object({
  endFileIndex: z.number(),
  files: z.array(DataFileSchema),
  folder: z.string(),
  startFileIndex: z.number(),
  totalFiles: z.number()
});

/* Network Display Nodes Schemas */
const PortSchema = z.object({
  name: z.string()
});

export const NodeSchema = z.object({
  name: z.string(),
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  inputPorts: z.array(PortSchema),
  outputPorts: z.array(PortSchema)
});

export const NetworkDisplayNodeSchema = z.object({
  networkId: z.string(),
  networkName: z.string(),
  nodes: z.array(NodeSchema)
});

export const NetworkDisplayNodeArraySchema = z.array(NetworkDisplayNodeSchema);

const DetailsDataColumnsBase = () => ({
  mean: z.number(),
  sum: z.number(),
  sumSquare: z.number(),
  numberOfPointsInSum: z.number(),
  rootMeanSquare: z.number(),
  standardDeviation: z.number(),
  units: z.string(),
  name: z.string()
});

const DetailsDataColumnsSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("Integer"),
    min: z.number().or(z.bigint()),
    max: z.number().or(z.bigint()),
    ...DetailsDataColumnsBase()
  }),
  z.object({
    type: z.literal("Double"),
    min: z.number(),
    max: z.number(),
    ...DetailsDataColumnsBase()
  }),
  z.object({
    name: z.string(),
    type: z.enum(["String", "Histogram", "Enum"]),
    units: z.string()
  })
]);

//Working

export type DetailsDataColumns = z.infer<typeof DetailsDataColumnsSchema>;

const DetailsIndexSchema = z.union([
  z.object({
    name: z.string(),
    type: z.enum(["Double", "Integer"]),
    units: z.string(),
    numPoints: z.number(),
    isIso: z.literal(true),
    length: z.number().or(z.bigint()),
    isoBase: z.number().or(z.bigint()),
    isoIncrement: z.number().or(z.bigint()),
    channelGroup: z.number(),
    firstValue: z.number().or(z.bigint()),
    lastValue: z.number().or(z.bigint())
  }),
  z.object({
    name: z.string(),
    type: z.enum(["Double", "Integer"]),
    units: z.string(),
    numPoints: z.number().or(z.bigint()),
    isIso: z.literal(false),
    length: z.number().or(z.bigint()),
    channelGroup: z.number().or(z.bigint()),
    firstValue: z.number().or(z.bigint()),
    lastValue: z.number().or(z.bigint())
  })
]);

const ColumnDetailsSchema = z.object({
  index: DetailsIndexSchema,
  dataColumns: z.array(DetailsDataColumnsSchema)
});

const ColumnDetailsArraySchema = z.array(ColumnDetailsSchema);

type ColumnDetails = z.infer<typeof ColumnDetailsSchema>;

export type ConvertedColumnDetails = {
  dataColumns: ColumnDetails["dataColumns"];
  index: Omit<ColumnDetails["index"], "isoIncrement" | "isIso" | "isoBase"> &
    (
      | {
          isIso: true;
          sampleRate: bigint | number;
          base: bigint | number;
        }
      | {
          isIso: false;
        }
    );
};

export type ColumnDetailsArray = z.infer<typeof ColumnDetailsArraySchema>;

export const GetColumnDetailsDataResponseSchema = z.object({
  fileDetails: ColumnDetailsArraySchema,
  status: z.enum(["Completed", "Pending", "Failed"])
});

export type GetColumnDetailsDataResponse = z.infer<typeof GetColumnDetailsDataResponseSchema>;

export const GetColumnDetailsResponseSchema = z.object({
  id: z.string(),
  status: z.enum(["Completed", "Pending", "Failed"])
});

export type GetColumnDetailsResponse = z.infer<typeof GetColumnDetailsResponseSchema>;

/*

Based on:
[
    {
        "Index": {
            "Name": "index", //Any String
            "Type": "Double", // Double, Integer
            "Units" : "ms", //Any string
            "NumPoints": 100, //BigInteger  
            "IsIso" : false, //Boolean

            "Length": 2.0, //Double or BigInteger depending on Type

            //IsIso == True
            "IsoBase" : 2.0, //Double or BigInteger depending on Type
            "IsoIncrement" : 1.0 //Double or BigInteger depending on Type            
        },
        "DataColumns":[
            {
                "Name": "data1", //Any String
                "Type": "Double", // Double, Integer, String, Histogram, Enum
                "Units" : "ms", //Any string

                //If Numeric (Double, Integer)
                "Min": 0.0, //Double or BigInteger depending on Type
                "Max": 100.0, //Double or BigInteger depending on Type
                "Mean": 50.0, //Double
                "Sum": 5000.0, //Double
                "SumSquare": 250000.0, //Double
                "NumberOfPointsInSum" : 100, //BigInteger
                "RootMeanSquare": 50.0, //Double
                "StandardDeviation": 10.0 //Double
            }
        ]
    }
]
*/
