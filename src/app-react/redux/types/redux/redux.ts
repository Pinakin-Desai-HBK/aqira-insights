import { z } from "zod";
import {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta
} from "@reduxjs/toolkit/query/react";

export type ResponseHandlerParams<R, J extends boolean> = {
  response: Response;
  schema: z.ZodType<R, z.ZodTypeDef, R> | undefined;
  actionLabel: `${"get" | "put" | "post" | "delete"} ${string}`;
  returnText?: J;
};

export const TagsList = [
  `Project` as const,
  `NetworkNodes` as const,
  `Workspaces` as const,
  `NodeTypes` as const,
  `VisualizationTypes` as const,
  `AboutData` as const,
  `DashboardVisualizations` as const,
  `PropertiesData` as const,
  `Properties` as const,
  `NetworkEdges` as const,
  `NetworkRun` as const,
  `DataFiles` as const,
  `DisplayNodes` as const,
  `ApplicationAnalytics` as const,
  `ALL` as const
];

export type Tags = (typeof TagsList)[number];

export type AIEndpointBuilder<ReducerPath extends string> = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, NonNullable<unknown>, FetchBaseQueryMeta>,
  Tags,
  ReducerPath
>;

export type AppDataApiEndpointBuilder = AIEndpointBuilder<"appDataApi">;
