import { appLabels } from "src/insights/consts/labels";
import { ConvertedColumnDetails } from "src/insights/redux/types/schemas/dataExplorer";
import { DetailsGridItem } from "src/insights/redux/types/ui/detailsGrid";
import { formatNumber } from "./prepareColumnDefinitions";

const labels = appLabels.getIndexDetailsItems;

export const getIndexDetailsItems = ({
  index
}: {
  index: ConvertedColumnDetails["index"] | null;
}): DetailsGridItem[][] | null => {
  const sx = { sxLabel: { textAlign: "left", whiteSpace: "nowrap" }, sxValue: {} };
  return index
    ? [
        [
          {
            type: "label",
            key: "name",
            label: `${labels.indexDetails}: ${index.name} (${index.channelGroup})`,
            sxLabel: {
              ...sx.sxValue,
              gridColumn: "1 / span 7",
              fontWeight: "bold",
              textShadow: "0px 0px, 0px 0px, 0px 0px"
            }
          }
        ],
        [
          {
            type: "data",
            key: "type",
            label: labels.type,
            value: index.type,
            sxLabel: { ...sx.sxLabel, gridColumn: "1" },
            sxValue: { ...sx.sxValue, gridColumn: "2" }
          },
          {
            type: "data",
            key: "length",
            label: labels.length,
            value: formatNumber(index.length) || "-",
            tooltip: index.length.toString(),
            sxLabel: { ...sx.sxLabel, gridColumn: "3" },
            sxValue: { ...sx.sxValue, gridColumn: "4" }
          },
          {
            type: "data",
            key: "units",
            label: labels.units,
            value: index.units.toString() || "-",
            sxLabel: { ...sx.sxLabel, gridColumn: "5" },
            sxValue: { ...sx.sxValue, gridColumn: "6 / span 2" }
          },
          {
            type: "data",
            key: "numPoints",
            label: labels.numPoints,
            value: index.numPoints.toString() || "-",
            sxLabel: { ...sx.sxLabel, gridColumn: "1" },
            sxValue: { ...sx.sxValue, gridColumn: "2" }
          },
          {
            type: "data",
            key: "isoBase",
            label: labels.isoBase,
            value: index.isIso ? formatNumber(index.base) || "-" : "-",
            tooltip: index.isIso ? index.base.toString() : "-",
            sxLabel: { ...sx.sxLabel, gridColumn: "3" },
            sxValue: { ...sx.sxValue, gridColumn: "4" }
          },
          {
            type: "data",
            key: "isoIncrement",
            label: labels.isoIncrement,
            value: index.isIso ? formatNumber(index.sampleRate) || "-" : "-",
            tooltip: index.isIso ? index.sampleRate.toString() : "-",
            sxLabel: { ...sx.sxLabel, gridColumn: "5" },
            sxValue: { ...sx.sxValue, gridColumn: "6 / span 2" }
          },
          {
            type: "data",
            key: "firstValue",
            label: labels.firstValue,
            value: formatNumber(index.firstValue) || "-",
            tooltip: index.firstValue.toString(),
            sxLabel: { ...sx.sxLabel, gridColumn: "1" },
            sxValue: { ...sx.sxValue, gridColumn: "2" }
          },
          {
            type: "data",
            key: "lastValue",
            label: labels.lastValue,
            value: formatNumber(index.lastValue) || "-",
            tooltip: index.lastValue.toString(),
            sxLabel: { ...sx.sxLabel, gridColumn: "3" },
            sxValue: { ...sx.sxValue, gridColumn: "4" }
          }
        ]
      ]
    : null;
};
