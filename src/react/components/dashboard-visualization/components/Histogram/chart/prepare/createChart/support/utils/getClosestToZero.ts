import { Bin } from "../../../../../types";

export const getClosestToZero = (bins: Bin[]): number => {
  if (bins.length === 0) throw Error("No data found");
  const closestToZero = bins
    .map((bin) => Math.abs(bin.y))
    .reduce<number>((prev, curr) => (curr !== 0 && (prev === Infinity || curr < prev) ? curr : prev), Infinity);
  if (closestToZero === Infinity) throw Error("Bad data"); //0.005;
  return closestToZero;
};
