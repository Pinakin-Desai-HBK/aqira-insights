import { NetworkDisplayNodeItem } from "src/redux/types/ui/dataExplorer";
import { appLabels } from "src/consts/labels";
import { DetailsGridItem } from "src/redux/types/ui/detailsGrid";
import { DetailsHeading } from "src/components/detailsGrid/DetailsHeading";
import { DetailsGrid } from "src/components/detailsGrid/DetailsGrid";
import Box from "@mui/material/Box";

const labels = appLabels.DisplayNodeTooltip;

export const DisplayNodeTooltip = (props: { testIdPrefix: string; displayNode: NetworkDisplayNodeItem }) => {
  const {
    testIdPrefix,
    displayNode: { item, node }
  } = props;

  const details: DetailsGridItem[][] = [
    [
      {
        type: "data",
        key: "networkName",
        label: labels.network,
        value: item.networkName
      }
    ],
    [
      {
        type: "data",
        key: "nodeName",
        label: labels.displayNode,
        value: node.name
      }
    ]
  ];

  return (
    <Box>
      <DetailsHeading heading={labels.displayNodeInformation} />
      <DetailsGrid itemsArray={details} testIdPrefix={testIdPrefix} sx={{ paddingLeft: "26px" }} />
    </Box>
  );
};
