import { formatChartNumber } from "src/insights/helpers/format-number/format-number";
import { IndexSelectionDetails } from "./types";
import { getTextWidth } from "src/insights/components/inline-edit/text-utils";
import { Dimensions } from "src/insights/redux/types/redux/workspaces";

export const getIndexSelectDetails = ({
  indexes,
  dimensions
}: {
  indexes: Float64Array;
  dimensions: Dimensions | null;
}): IndexSelectionDetails => {
  if (indexes.length < 2 || !dimensions) {
    return { maxWidth: 0 };
  }
  const showAllLabels = 12 * indexes.length < dimensions?.width;
  const shouldShowLabel = (i: number) => showAllLabels || i === 0 || i === indexes.length - 1;
  const marks = Array.from(indexes).map((index, i) => {
    return {
      value: index,
      label: shouldShowLabel(i) ? `${formatChartNumber(index)}` : ``
    };
  });
  const marksData = {
    marks,
    min: indexes[0] || 0,
    max: indexes[indexes.length - 1] || 0
  };
  const maxWidth = marks.reduce((acc, mark, i) => {
    return shouldShowLabel(i) ? Math.max(acc, getTextWidth(mark.label.toString(), "12px Verdana") || 0) : 0;
  }, 0);
  return { maxWidth, marksData };
};
