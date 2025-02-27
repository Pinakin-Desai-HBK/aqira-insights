import { filesize } from "filesize";
import { DataFileItem } from "src/insights/redux/types/ui/dataExplorer";
import { appLabels } from "src/insights/consts/labels";
import { DetailsHeading } from "src/insights/components/detailsGrid/DetailsHeading";
import { DetailsLink } from "src/insights/components/detailsGrid/DetailsLink";
import { DetailsGridItem } from "src/insights/redux/types/ui/detailsGrid";
import { DetailsGrid } from "src/insights/components/detailsGrid/DetailsGrid";
import Button from "@mui/material/Button";

const labels = appLabels.DataFileTooltip;

export const DataFileTooltip = (props: {
  testIdPrefix: string;
  dataFile: DataFileItem;
  closeTooltip: () => void;
  openColumnDetails: (params: { source: DataFileItem }) => void;
}) => {
  const {
    testIdPrefix,
    closeTooltip,
    openColumnDetails,
    dataFile: {
      item: { fullName, creationTimeUtc, lastWriteTimeUtc, fileSize }
    }
  } = props;

  const details: DetailsGridItem[][] = [
    [
      {
        type: "data",
        key: "fullName",
        label: labels.path,
        value: fullName
      }
    ],
    [
      {
        type: "data",
        key: "created",
        label: labels.created,
        value: new Date(creationTimeUtc).toLocaleString()
      }
    ],
    [
      {
        type: "data",
        key: "modified",
        label: labels.modified,
        value: new Date(lastWriteTimeUtc).toLocaleString()
      }
    ],
    [
      {
        type: "data",
        key: "size",
        label: labels.size,
        value: filesize(fileSize, { base: 2, standard: "jedec" })
      }
    ]
  ];

  return (
    <>
      <DetailsHeading heading={labels.dataInformation} />
      <DetailsGrid itemsArray={details} testIdPrefix={testIdPrefix} sx={{ paddingLeft: "26px" }} />
      <Button
        data-testid={`${testIdPrefix}-viewDetails`}
        onClick={() => {
          closeTooltip();
          openColumnDetails({ source: props.dataFile });
        }}
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          borderRadius: "0px",
          "&:hover": { backgroundColor: "#FFF" },
          padding: "1px"
        }}
      >
        <DetailsLink label={labels.viewDetails} />
      </Button>
    </>
  );
};
