import { ENumericFormat, formatNumber, NumberRange } from "scichart";

const findMinimumDecimals = (numbers: number[]) => {
  let N = 0;
  while (N < 100) {
    let formattedNumbers = numbers.map((num) => num.toFixed(N));
    let uniqueNumbers = new Set(formattedNumbers);
    if (uniqueNumbers.size === numbers.length) {
      break;
    }
    N++;
  }
  return N;
};

const decimalPlacesList: { diffString: string; decimalPlaces: number }[] = [];

export const formatLabel = (dataLabel: number, visibleRange: NumberRange, pointCount: number) => {
  const { diff } = visibleRange;
  const increment = diff / pointCount;

  return formatLabelWithNumberList(dataLabel, visibleRange, () =>
    Array.from({ length: pointCount }, (_, i) => {
      return increment * i;
    })
  );
};

export const formatLabelUsingList = (dataLabel: number, visibleRange: NumberRange, numberList: number[]) => {
  return formatLabelWithNumberList(dataLabel, visibleRange, () => numberList);
};

const formatLabelWithNumberList = (dataLabel: number, visibleRange: NumberRange, getNumberList: () => number[]) => {
  const { diff } = visibleRange;
  const found = decimalPlacesList.find((item) => item.diffString === diff.toString());
  const N = found ? found.decimalPlaces : findMinimumDecimals(getNumberList());

  if (!found) {
    decimalPlacesList.push({ diffString: diff.toString(), decimalPlaces: N });
    if (decimalPlacesList.length > 100) {
      decimalPlacesList.shift();
    }
  }
  const strResult = formatNumber(dataLabel, ENumericFormat.Decimal, N);
  return parseFloat(strResult).toString();
};
