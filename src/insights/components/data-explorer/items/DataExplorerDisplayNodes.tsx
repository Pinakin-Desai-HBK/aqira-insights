import { memo, useCallback } from "react";
import { DisplayNodeRow } from "../DisplayNodeRow";
import { MatcherType } from "src/insights/redux/types/ui/dataExplorer";
import { DataGroupItem, NetworkDisplayNodeItem } from "src/insights/redux/types/ui/dataExplorer";
import { DataSelectionContextProvider } from "../group/DataSelectionContextProvider";
import { DataExplorerInformation } from "../information/DataExplorerInformation";
import { DataGroup } from "../group/DataGroup";

const DataExplorerDisplayNodes = memo(
  (props: {
    noFilteredDisplayNodes: boolean;
    displayNodesGroupOpen: boolean;
    displayNodeItems: NetworkDisplayNodeItem[];
    initialDisplayNodesData: NetworkDisplayNodeItem[];
  }) => {
    const { noFilteredDisplayNodes, displayNodesGroupOpen, displayNodeItems, initialDisplayNodesData } = props;

    const displayNodeMatcher: MatcherType<DataGroupItem> = useCallback((itemA, itemB) => {
      if (itemA.item.type === "DisplayNode" && itemB.item.type === "DisplayNode") {
        return itemA.item.item.networkId === itemB.item.item.networkId && itemA.item.node.id === itemB.item.node.id;
      }
      return false;
    }, []);

    if (noFilteredDisplayNodes) {
      return <DataExplorerInformation text="No matching nodes" />;
    } else
      return (
        <DataSelectionContextProvider enabled={false} location="Network" matcher={displayNodeMatcher}>
          <DataGroup
            minHeight={Math.min(displayNodeItems.length, 1) * 30 + "px"}
            groupItems={displayNodeItems}
            allGroupItems={initialDisplayNodesData}
            isOpen={displayNodesGroupOpen}
            Row={({ index, style }: { index: number; style: React.CSSProperties }) => (
              <DisplayNodeRow index={index} style={style} current={displayNodeItems[index]} />
            )}
            testId="AI-data-explorer-group-networkDisplayNodes"
            listTestId="AI-network-display-node-items"
          />
        </DataSelectionContextProvider>
      );
  }
);

DataExplorerDisplayNodes.displayName = "DataExplorerDisplayNodes";

export default DataExplorerDisplayNodes;
