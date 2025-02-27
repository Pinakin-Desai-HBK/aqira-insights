const toExponentialLimit = 10000;

const removePlus = (value: string): string => value.replace("+", "");

export const formatNumberForAPI = (value: string, type: "Integer" | "Double"): string => {
  if (isNaN(Number(value))) return value;
  if (type === "Integer") {
    const hasExponential = value.indexOf("e") > -1;
    const valueToFormat = hasExponential ? Number(value) : BigInt(value);
    return valueToFormat.toString();
  } else {
    const valueNumber = Number(value);
    return valueNumber.toExponential();
  }
};

export const formatNumberForUI = (value: string): string => {
  const valueNumber = Number(value);
  if (isNaN(valueNumber)) return value;
  const outsideToExponentialLimit = valueNumber >= toExponentialLimit || valueNumber <= -toExponentialLimit;
  return removePlus(outsideToExponentialLimit ? valueNumber.toExponential() : valueNumber.toString());
};

export const formatStringListForAPI = (value: string | number | readonly string[]): string[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return value
    .toString()
    .split(/\r?\n|\r/)
    .filter((line) => line.trim() !== "");
};

const precision = 4;

export const formatChartNumber = (value: unknown): null | undefined | string => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value === "number") {
    const val: number = value as number;
    const result = val > 9999 ? val.toExponential(precision - 1) : parseFloat(val.toPrecision(precision));
    return result.toString();
  }
  if (typeof value === "object" && "toExponential" in value && "toPrecision" in value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val: any = value;
    const result = val > 9999 ? val.toExponential(precision - 1) : val.toPrecision(precision);
    return result.toString();
  }
  return undefined;
};
