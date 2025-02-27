import { z, ZodType, ZodTypeDef } from "zod";
import { DataRange, DataSetArray } from "../schemas/data";
import { Table } from "src/insights/components/dashboard-visualization/components/Table/Table";
import { TextArea } from "src/insights/components/dashboard-visualization/components/TextArea/TextArea";
import { TimeSeries2 } from "src/insights/components/dashboard-visualization/components/TimeSeries2/TimeSeries";
import {
  DashboardVisualizationDataApi,
  DashboardVisualizationMinimumDimensions,
  HistogramKey,
  Histogram3DKey,
  TableKey,
  TextAreaKey,
  TimeSeriesKey,
  VisTypes
} from "../schemas/dashboardVisualizations";
import { CreateVisualizationPayload } from "../payload";
import { SignalRDataSetUpdatedEvent } from "../system/signalR";
import { WorkspaceItemIdentifier } from "../redux/networkNodes";
import { Histogram } from "src/insights/components/dashboard-visualization/components/Histogram/Histogram";
import { Histogram3D } from "src/insights/components/dashboard-visualization/components/Histogram3D/Histogram3D";
import { JSX } from "react";

export const DataVisualizationsList = [TableKey, TimeSeriesKey, HistogramKey, Histogram3DKey] as const;
export type DataVisTypes = (typeof DataVisualizationsList)[number];

const VisPropertiesBase = <T extends VisTypes>(type: T) => z.object({ type: z.literal(type) });

const DataVisPropertiesBase = <T extends DataVisTypes>(type: T) =>
  VisPropertiesBase(type).extend({ connection: z.string() });

export const VisPropertiesMap = {
  [TextAreaKey]: VisPropertiesBase(TextAreaKey).extend({
    text: z.string().nullable()
  }),
  [TableKey]: DataVisPropertiesBase(TableKey).extend({
    rowsperpage: z.number()
  }),
  [TimeSeriesKey]: DataVisPropertiesBase(TimeSeriesKey).extend({
    numtraces: z.number()
  }),
  [HistogramKey]: DataVisPropertiesBase(HistogramKey).extend({}),
  [Histogram3DKey]: DataVisPropertiesBase(Histogram3DKey).extend({})
};

type VisIndexMap = {
  [TableKey]: null;
  [TimeSeriesKey]: {
    index: {
      name: string;
      units: string;
      type: "Double" | "Integer";
      dataBase64: string;
    };
  };
  [HistogramKey]: {
    index: {
      name: string;
      units: string;
      type: "Double" | "Integer";
      dataBase64: string;
    };
  };
  [Histogram3DKey]: {
    index: {
      name: string;
      units: string;
      type: "Double" | "Integer";
      dataBase64: string;
    };
  };
};

type VisDataSetDataMap = {
  [TableKey]: {
    $format: "csv";
    data: string;
  };
  [TimeSeriesKey]: {
    index: {
      name: string;
      units: string;
      type: "Double" | "Integer";
      dataBase64: string;
    };
    columns: {
      name: string;
      units: string;
      type: "Double" | "Integer";
      dataBase64: string;
    }[];
  };
  [HistogramKey]: {
    index: {
      name: string;
      units: string;
      type: "Double" | "Integer";
      dataBase64: string;
    };
    histograms: {
      chanName: string;
      type: "h2axis";
      data: {
        x: {
          start: string;
          midPoint: string;
          end: string;
          label: string;
        }[];
        xUnits: string;
        xLabel: string;
        y: {
          value: string;
        }[];
        yUnits: string;
        yLabel: string;
      };
    }[];
  };
  [Histogram3DKey]: {
    index: {
      name: string;
      units: string;
      type: "Double" | "Integer";
      dataBase64: string;
    };
    histograms: {
      chanName: string;
      type: "h3axis";
      data: {
        x: {
          start: string;
          midPoint: string;
          end: string;
          label: string;
        }[];
        xUnits: string;
        xLabel: string;
        y: {
          start: string;
          midPoint: string;
          end: string;
          label: string;
        }[];
        yUnits: string;
        yLabel: string;
        z: {
          value: string;
        }[];
        zUnits: string;
        zLabel: string;
      };
    }[];
  };
};

type VisDataRefreshParamsMap = {
  [TableKey]: {
    $queryType: "paged";
    pageNumber: number;
    pageSize: number;
  };
  [TimeSeriesKey]: {
    $queryType: "windowed";
    columnsFilters: string[] | null;
    startIndex: number | null;
    endIndex: number | null;
    pointCount: number;
    maxColumnCount: number;
  };
  [HistogramKey]: {
    $queryType: "absoluteHistogram";
    channelNames: string[] | null;
    index: number | null;
    typeFilter: ("NaN" | "h2axis")[];
  };
  [Histogram3DKey]: {
    $queryType: "absoluteHistogram";
    channelNames: string[] | null;
    index?: number | null;
    typeFilter: ("NaN" | "h3axis")[];
  };
};

const ColumnTypes = z.enum(["Double", "String", "Integer", "Histogram"]);

export const getDataSetSchema = <T extends DataVisTypes>(type: T) => {
  const result = z.object({
    type: z.literal(type),
    state: z.enum(["Loaded"]),
    index: z.object({
      name: z.string(),
      type: ColumnTypes,
      units: z.string()
    }),
    dataColumns: z.array(
      z.object({
        name: z.string(),
        type: ColumnTypes,
        units: z.string()
      })
    )
  });
  return result;
};

/** EX1: example of implementing a string literal union map */
export const VisZodSchemaMap: VisZodSchemaMapType = {
  [TableKey]: {
    index: z.null(),
    dataSetSchema: getDataSetSchema(TableKey),
    dataSetDataSchema: z.object({
      $format: z.enum(["csv"]),
      data: z.string()
    })
  },
  [TimeSeriesKey]: {
    index: z.object({
      index: z.object({
        name: z.string(),
        units: z.string(),
        type: z.enum(["Double", "Integer"]),
        dataBase64: z.string()
      })
    }),
    dataSetSchema: getDataSetSchema(TimeSeriesKey),
    dataSetDataSchema: z.object({
      index: z.object({
        name: z.string(),
        units: z.string(),
        type: z.enum(["Double", "Integer"]),
        dataBase64: z.string()
      }),
      columns: z.array(
        z.object({
          name: z.string(),
          units: z.string(),
          type: z.enum(["Double", "Integer"]),
          dataBase64: z.string()
        })
      )
    })
  },
  [HistogramKey]: {
    index: z.object({
      index: z.object({
        name: z.string(),
        units: z.string(),
        type: z.enum(["Double", "Integer"]),
        dataBase64: z.string()
      })
    }),
    dataSetSchema: getDataSetSchema(HistogramKey),
    dataSetDataSchema: z.object({
      index: z.object({
        name: z.string(),
        units: z.string(),
        type: z.enum(["Double", "Integer"]),
        dataBase64: z.string()
      }),
      histograms: z.array(
        z.object({
          chanName: z.string(),
          type: z.literal("h2axis"),
          data: z.object({
            x: z.array(
              z.object({
                start: z.string(),
                midPoint: z.string(),
                end: z.string(),
                label: z.string()
              })
            ),
            xUnits: z.string(),
            xLabel: z.string(),
            y: z.array(
              z.object({
                value: z.string()
              })
            ),
            yUnits: z.string(),
            yLabel: z.string()
          })
        })
      )
    })
  },
  [Histogram3DKey]: {
    index: z.object({
      index: z.object({
        name: z.string(),
        units: z.string(),
        type: z.enum(["Double", "Integer"]),
        dataBase64: z.string()
      })
    }),
    dataSetSchema: getDataSetSchema(Histogram3DKey),
    dataSetDataSchema: z.object({
      index: z.object({
        name: z.string(),
        units: z.string(),
        type: z.enum(["Double", "Integer"]),
        dataBase64: z.string()
      }),
      histograms: z.array(
        z.object({
          chanName: z.string(),
          type: z.literal("h3axis"),
          data: z.object({
            x: z.array(
              z.object({
                start: z.string(),
                midPoint: z.string(),
                end: z.string(),
                label: z.string()
              })
            ),
            xUnits: z.string(),
            xLabel: z.string(),
            y: z.array(
              z.object({
                start: z.string(),
                midPoint: z.string(),
                end: z.string(),
                label: z.string()
              })
            ),
            yUnits: z.string(),
            yLabel: z.string(),
            z: z.array(
              z.object({
                value: z.string()
              })
            ),
            zUnits: z.string(),
            zLabel: z.string()
          })
        })
      )
    })
  }
};

export const VisConfigMap: VisConfigMapType = {
  [TableKey]: {
    showBorder: true,
    canPan: false,
    component: Table
  },
  [TextAreaKey]: {
    showBorder: false,
    canPan: true,
    component: TextArea
  },
  [TimeSeriesKey]: {
    showBorder: true,
    canPan: false,
    component: TimeSeries2
  },
  [HistogramKey]: {
    showBorder: true,
    canPan: false,
    component: Histogram
  },
  [Histogram3DKey]: {
    showBorder: true,
    canPan: false,
    component: Histogram3D
  }
};

export type DashboardVisualizationDataUI = DashboardVisualizationDataApi & { identifier: WorkspaceItemIdentifier } & {
  minimumDimensions: DashboardVisualizationMinimumDimensions;
};

export type MinimumDimensionsDetails = {
  workspaceItem: {
    type: string;
    id: string;
  };
  minimumDimensions: {
    minWidth: number;
    minHeight: number;
  };
};

export type StatelessVisDataSetType<T extends DataVisTypes> = {
  type: T;
  state: "Loaded";
  index: {
    name: string;
    type: "Double" | "String" | "Integer" | "Histogram";
    units: string;
  };
  dataColumns: Array<{
    name: string;
    type: "Double" | "String" | "Integer" | "Histogram";
    units: string;
  }>;
};

type VisDataSetType<T extends DataVisTypes> =
  | StatelessVisDataSetType<T>
  | {
      type: T;
      state: "Loading";
    };

type VisPropertiesType<T extends VisTypes> = z.infer<(typeof VisPropertiesMap)[T]>;

type VisDataRefreshParamsType<T extends DataVisTypes> = VisDataRefreshParamsMap[T];

type VisDataSetZodType<T> = T extends DataVisTypes ? ZodType<VisDataSetType<T>, ZodTypeDef, VisDataSetType<T>> : never;

export type DataSet<T extends DataVisTypes> = VisDataSetType<T>;

export type VisualizationDataContextError = "API_ERROR" | "NO_DATA_FOR_DATA_SET"; //appLabels.VisualizationErrorMessages.dataNotAvailable

type VisualizationDataContextPart = {
  datasets: DataSetArray | null;
  dashboardId: string;
  visualizationId: string;
  hasError: boolean;
  connectionIsEmpty: boolean;
  errorCode: VisualizationDataContextError | null;
};

type OnDrop = (event: React.DragEvent<HTMLDivElement>) => void;

type OnDragOver = (event: React.DragEvent<HTMLDivElement>) => void;

export type UseConnectVisualizationResult = {
  onDrop: OnDrop;
  onDragOver: OnDragOver;
};

export type VisDataSetDataType<T extends DataVisTypes> = VisDataSetDataMap[T];
export type VisIndexMapType<T extends DataVisTypes> = VisIndexMap[T];

type VisZodSchemaMapType = {
  [K in DataVisTypes]: {
    dataSetSchema: VisDataSetZodType<K>;
    dataSetDataSchema: ZodType<VisDataSetDataType<K>>;
    index: ZodType<VisIndexMapType<K>>;
  };
};

type VisComponent = () => JSX.Element;

type VisConfigMapType = {
  [K in VisTypes]: {
    showBorder: boolean;
    canPan: boolean;
    component: VisComponent;
  };
};

export type RawVisualizationProperties<T extends VisTypes> = VisPropertiesType<T>;

export type FilteredVisualizationProperties<T extends VisTypes> = z.infer<(typeof VisPropertiesMap)[T]>;

type DataVisualizationProperties<T extends DataVisTypes> = FilteredVisualizationProperties<T>;

export type DataSetRefreshParams<T extends DataVisTypes> = VisDataRefreshParamsType<T>;

export type DataSetSchemaStore<T extends DataVisTypes> = Record<string, DataSet<T>>;

export type OnDataSetUpdatedCallback = ({ message }: { message: SignalRDataSetUpdatedEvent }) => void;

export type VisualizationDataContextState<T extends DataVisTypes> = VisualizationDataContextPart & {
  schemaStore: DataSetSchemaStore<T> | null;
  onDataSetUpdatedCallback: OnDataSetUpdatedCallback | null;
  hasConnection: boolean;
  properties: DataVisualizationProperties<T>;
};

export type VisualizationDataContextData<T extends DataVisTypes> = VisualizationDataContextPart & {
  setOnDataSetUpdatedCallback: (onDataSetUpdatedCallback: OnDataSetUpdatedCallback | null) => void;
  getSchema: (dataSetId: DataSetId) => Promise<DataSet<T>>;
  getDataRange: (dataSetId: string) => Promise<DataRange>;
};

export type CreateVisualizationParams = {
  payload: CreateVisualizationPayload;
  callback?: (visualizationId: string) => void;
};

export type DataSetId = { dataSetId: string };

export type DataSetDetails = {
  dashboardId: string;
  visualizationId: string;
} & DataSetId;

export type Range = { min: number; max: number };
