import { popoutDetails } from "src/popoutDetails";
import { getPubSubStore } from "src/pubsub-manager/usePubSubManager";
import { WorkspaceArray } from "src/redux/types/schemas/project";
import { getAppSignalR } from "./AppSignalR";

export const signalRSubscribeTabs = async (tabs: WorkspaceArray) => {
  if (popoutDetails.isPopout) return;
  const { pubSub } = getPubSubStore(popoutDetails.isPopout);
  let appSignalR;
  while (!(appSignalR = await getAppSignalR(pubSub))?.connected)
    await new Promise((resolve) => setTimeout(resolve, 200));
  await appSignalR.subscribeTabs(tabs.map((tab) => `${tab.type}:${tab.id}`));
};
