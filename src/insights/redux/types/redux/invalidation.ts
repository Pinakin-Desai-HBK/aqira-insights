import { TagDescription } from "@reduxjs/toolkit/query";
import { InvalidateTagsRecipent } from "src/insights/redux/types/system/pub-sub";
import { Tags } from "./redux";
import { appApi } from "../../api/appApi";

export type InvalidationDetails = {
  tags: TagDescription<Tags>[];
} & InvalidationDetailsTargets;

export type InvalidationDetailsTargets =
  | {
      type: "INDIVIDUAL";
      sourceMainTargets?: InvalidateTagsRecipent;
      sourcePopupTargets?: InvalidateTagsRecipent;
    }
  | {
      type: "COMBINED";
      combinedTargets: InvalidateTagsRecipent;
    };

type Endpoints = typeof appApi.endpoints;

export type EndpointsKey = keyof Endpoints;

type Endpoint<key extends EndpointsKey> = Endpoints[key];

type ActionParams<K extends EndpointsKey> = Endpoint<K>["Types"]["QueryArg"];

type ActionResult<K extends EndpointsKey> = Endpoint<K>["Types"]["ResultType"];

export type InvalidationMap = {
  [K in EndpointsKey]?: undefined | ((params: ActionParams<K>, result: ActionResult<K>) => InvalidationDetails[]);
};

export type GetInvalidationTags = <K extends EndpointsKey>(
  key: K,
  parmas: ActionParams<K>,
  result: ActionResult<K>
) => InvalidationDetails[] | null;
