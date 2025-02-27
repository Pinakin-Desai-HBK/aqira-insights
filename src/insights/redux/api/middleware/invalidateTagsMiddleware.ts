import { Action, isFulfilled, Middleware, PayloadAction } from "@reduxjs/toolkit";
import { appApi } from "../appApi";
import { getPubSubStore } from "src/insights/pubsub-manager/usePubSubManager";
import { store } from "../../store";
import { Tags } from "../../types/redux/redux";
import { popoutDetails } from "src/insights/popoutDetails";
import { InvalidateTagsRecipent } from "src/insights/redux/types/system/pub-sub";
import { EndpointsKey, GetInvalidationTags, InvalidationDetails } from "../../types/redux/invalidation";
import { ProjectApiInvalidationMap } from "../endpoints/project/invalidation";
import { InvalidationMap } from "../../types/redux/invalidation";
import { NetworkRunApiInvalidationMap } from "../endpoints/networkRun/invalidation";
import { WorkspaceApiInvalidationMap } from "../endpoints/workspace/invalidation";
import { WorkspaceItemApiInvalidationMap } from "../endpoints/workspaceItem/invalidation";
import { NetworkConnectionApiInvalidationMap } from "../endpoints/networkConnection/invalidation.";
import { PropertiesApiInvalidationMap } from "../endpoints/properties/invalidation";
import { DashboardVisualizationInvalidationMap } from "../endpoints/dashboardVisualization/invalidation";
import { NetworkNodeApiInvalidationMap } from "../endpoints/networkNode/invalidation.";
import { TagDescription } from "@reduxjs/toolkit/query";

const invalidationMap: InvalidationMap = {
  ...ProjectApiInvalidationMap,
  ...WorkspaceApiInvalidationMap,
  ...NetworkRunApiInvalidationMap,
  ...WorkspaceItemApiInvalidationMap,
  ...NetworkConnectionApiInvalidationMap,
  ...PropertiesApiInvalidationMap,
  ...DashboardVisualizationInvalidationMap,
  ...NetworkNodeApiInvalidationMap
};

const getInvalidationDetails: GetInvalidationTags = (key, params, result): InvalidationDetails[] | null => {
  const tagFunction = key in invalidationMap ? invalidationMap[key] : null;
  return tagFunction ? tagFunction(params, result) : null;
};

export const invalidateTagsMiddleware: Middleware = () => (next) => (unknownAction) => {
  if (isFulfilled(unknownAction)) {
    const action = unknownAction as Action | PayloadAction<Tags>;
    Object.keys(invalidationMap).forEach((key) => {
      const checkedKey = key as EndpointsKey;
      if (appApi.endpoints[checkedKey].matchFulfilled(action)) {
        const {
          payload: result,
          meta: {
            arg: { originalArgs: params }
          }
        } = action;
        const invalidationDetails = getInvalidationDetails(checkedKey, params, result);
        if (invalidationDetails) {
          invalidationDetails.forEach((current) => {
            const { tags, type } = current;
            const publish = (targets: InvalidateTagsRecipent) => {
              pubSub.publish(
                "InvalidateTags",
                { tags, targetSubscriberType: "ANY", ...targets, sourcePopoutId: popoutDetails.popoutId },
                popoutDetails.popoutId
              );
            };
            if (type === "INDIVIDUAL") {
              const { sourceMainTargets, sourcePopupTargets } = current;
              if (sourceMainTargets && !popoutDetails.popoutId) {
                publish(sourceMainTargets);
              }
              if (sourcePopupTargets && popoutDetails.popoutId) {
                publish(sourcePopupTargets);
              }
            }
            if (type === "COMBINED") {
              const { combinedTargets } = current;
              publish(combinedTargets);
            }
          });
        }
      }
    });
  }
  return next(unknownAction);
};

const { pubSub } = getPubSubStore(popoutDetails.isPopout);

pubSub.subscribe(
  "InvalidateTags",
  (msg) => {
    const { popoutId } = popoutDetails;
    const { tags, recipientType } = msg;

    const invalidate = () => {
      if (
        tags.find((tag: TagDescription<Tags>) => {
          return typeof tag !== "string" && "type" in tag && tag.type === "ALL";
        })
      ) {
        store.dispatch(appApi.util.resetApiState());
        return;
      }
      store.dispatch(appApi.util.invalidateTags(tags));
    };

    if (recipientType === "ALL" || (recipientType === "MAIN" && !popoutId)) {
      invalidate();
      return;
    }
    if (recipientType === "POPUP" && popoutId) {
      const { exclude } = msg;
      if (!exclude.includes(popoutId)) {
        invalidate();
        return;
      }
    }
    if (recipientType === "TARGETTED") {
      const { include } = msg;
      if ((!popoutId && include.includes("MAIN")) || (popoutId && include.includes(popoutId))) {
        invalidate();
      }
    }
  },
  popoutDetails.isPopout ? "POPUP" : "MAIN",
  popoutDetails.popoutId
);
