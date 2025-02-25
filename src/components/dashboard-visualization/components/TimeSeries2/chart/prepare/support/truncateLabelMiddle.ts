import { getTextWidth } from "src/components/inline-edit/text-utils";

export const truncateLabelMiddle = (label: string, maxWidth: number, fontStyle: string) => {
  let currentLabelParts = label.split("|split|");
  const seriesName = currentLabelParts[0];
  const units = currentLabelParts[1];

  const shouldReduce = (getTextWidth(getFullLabel(seriesName, units), fontStyle) || 0) > maxWidth;
  if (!shouldReduce) {
    return getFullLabel(seriesName, units);
  }

  let [seriesNameLeft, seriesNameRight] = evenAndSplit(seriesName ?? "");
  while (
    checkParts(seriesNameLeft, seriesNameRight) &&
    checkLength(`${seriesNameLeft}...${seriesNameRight}`, units, maxWidth, fontStyle)
  ) {
    seriesNameLeft = removeLastChar(seriesNameLeft);
    seriesNameRight = removeFirstChar(seriesNameRight);
  }

  const reduceUnitsToo =
    (getTextWidth(getFullLabel(`${seriesNameLeft}...${seriesNameRight}`, units), fontStyle) ?? 0) >= maxWidth;
  if (reduceUnitsToo) {
    let [unitsLeft, unitsRight] = evenAndSplit(units ?? "");
    while (
      checkParts(unitsLeft, unitsRight) &&
      checkLength(`${seriesNameLeft}...${seriesNameRight}`, `${unitsLeft}...${unitsRight}`, maxWidth, fontStyle)
    ) {
      unitsLeft = removeLastChar(unitsLeft);
      unitsRight = removeFirstChar(unitsRight);
    }
    return getFullLabel(`${seriesNameLeft}...${seriesNameRight}`, `${unitsLeft}...${unitsRight}`);
  }

  return getFullLabel(`${seriesNameLeft}...${seriesNameRight}`, units);
};

const makeStringEven = (currentLabel: string) => {
  const isStringEven = currentLabel.length % 2 === 0;
  if (!isStringEven) {
    const chars = currentLabel.split("");
    chars.splice(currentLabel.length / 2, 1);
    return chars.join("");
  }
  return currentLabel;
};

const getFullLabel = (seriesName: string | undefined, part2: string | undefined) => {
  return (seriesName ?? "") + (part2 ? ` (${part2})` : "");
};

const removeLastChar = (str: string) => str.slice(0, -1);

const removeFirstChar = (str: string) => str.slice(1);

const checkLength = (part1: string, part2: string | undefined, maxWidth: number, fontStyle: string) =>
  (getTextWidth(getFullLabel(part1, part2), fontStyle) || 0) > maxWidth;

const checkParts = (part1: string, part2: string) => part1.length > 3 && part2.length > 3;

const evenAndSplit = (str: string): [string, string] => {
  const strEven = makeStringEven(str ?? "");
  let strLeft = strEven.slice(0, strEven.length / 2);
  let strRight = strEven.slice(-(strEven.length / 2));
  return [strLeft, strRight];
};
