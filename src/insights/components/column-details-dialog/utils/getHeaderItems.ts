import { appLabels } from "src/insights/consts/labels";
import { ConvertedColumnDetails } from "src/insights/redux/types/schemas/dataExplorer";
import { DataFileDetails } from "src/insights/redux/types/ui/dataExplorer";
import { DetailsGridItem } from "src/insights/redux/types/ui/detailsGrid";

const labels = appLabels.getHeaderItems;

export const getHeaderItems = ({
  columnDetails,
  dataFileDetails: { created, size, modified, filename, folder }
}: { columnDetails: ConvertedColumnDetails[] } & DataFileDetails): DetailsGridItem[][] => {
  const sx = { sxLabel: { textAlign: "left", whiteSpace: "nowrap" }, sxValue: {} };
  return [
    [
      {
        type: "data",
        key: "filename",
        label: labels.filename,
        value: filename,
        sxLabel: { ...sx.sxLabel, gridColumn: "1" },
        sxValue: { ...sx.sxValue, gridColumn: "2 / span 5" }
      }
    ],
    [
      {
        type: "data",
        key: "folder",
        label: labels.folder,
        value: folder,
        sxLabel: { ...sx.sxLabel, gridColumn: "1" },
        sxValue: { ...sx.sxValue, gridColumn: "2 / span 5" }
      }
    ],
    [
      {
        type: "data",
        key: "created",
        label: labels.created,
        value: created,
        sxLabel: { ...sx.sxLabel, gridColumn: "1" },
        sxValue: { ...sx.sxValue, gridColumn: "2" }
      },
      {
        type: "data",
        key: "modified",
        label: labels.modified,
        value: modified,
        sxLabel: { ...sx.sxLabel, gridColumn: "3" },
        sxValue: { ...sx.sxValue, gridColumn: "4" }
      },
      {
        type: "data",
        key: "size",
        label: labels.size,
        value: size,
        sxLabel: { ...sx.sxLabel, gridColumn: "5" },
        sxValue: { ...sx.sxValue, gridColumn: "6" }
      }
    ],
    [
      {
        type: "data",
        key: "totalIndexes",
        label: labels.indexes,
        value: columnDetails.length.toString(),
        sxLabel: { ...sx.sxLabel, gridColumn: "1" },
        sxValue: { ...sx.sxValue, gridColumn: "2" }
      },
      {
        type: "data",
        key: "dataColumns",
        label: labels.dataColumns,
        value: columnDetails.reduce((acc, current) => acc + current.dataColumns.length, 0).toString(),
        sxLabel: { ...sx.sxLabel, gridColumn: "3" },
        sxValue: { ...sx.sxValue, gridColumn: "4 / span 3" }
      }
    ]
  ];
};
