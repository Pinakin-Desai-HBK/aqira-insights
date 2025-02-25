import { PropertyDouble, PropertyInteger } from "src/redux/types/schemas/properties";

export const validateNumber = (newValue: string, props: PropertyInteger | PropertyDouble) => {
  const { allowLowerLimit, allowUpperLimit, lowerLimit, upperLimit, type } = props;
  try {
    if (isNaN(Number(newValue))) {
      return "Value is not a number";
    }

    if (type === "Integer") {
      if (newValue.indexOf(".") !== -1) {
        return "Value is not an integer";
      }
      const hasExponential = newValue.indexOf("e") > -1;
      const valueToCheck = hasExponential ? Number(newValue) : BigInt(newValue);

      if (lowerLimit === undefined) {
        if (valueToCheck < Number.MIN_SAFE_INTEGER) {
          return `Value must be >= ${Number.MIN_SAFE_INTEGER}`;
        }
      } else {
        const lowerLimitToCheck = BigInt(lowerLimit.toString());
        if (allowLowerLimit && valueToCheck < lowerLimitToCheck) {
          return `Value needs to be >= ${lowerLimit}`;
        }
        if (!allowLowerLimit && valueToCheck <= lowerLimitToCheck) {
          return `Value needs to be > ${lowerLimit}`;
        }
      }

      if (upperLimit === undefined) {
        if (valueToCheck > Number.MAX_SAFE_INTEGER) {
          return `Value must be <= ${Number.MIN_SAFE_INTEGER}`;
        }
      } else {
        const upperLimitToCheck = BigInt(upperLimit.toString());
        if (allowUpperLimit && valueToCheck > upperLimitToCheck) {
          return `Value needs to be <= ${upperLimit}`;
        }
        if (!allowUpperLimit && valueToCheck >= upperLimitToCheck) {
          return `Value needs to be < ${upperLimit}`;
        }
      }
    } else {
      const valueToCheck = Number(newValue);

      if (lowerLimit === undefined) {
        if (valueToCheck < -Number.MAX_VALUE) {
          return `Value must be >= ${-Number.MAX_VALUE}`;
        }
      } else {
        if (allowLowerLimit && valueToCheck < lowerLimit) {
          return `Value needs to be >= ${lowerLimit}`;
        }
        if (!allowLowerLimit && valueToCheck <= lowerLimit) {
          return `Value needs to be > ${lowerLimit}`;
        }
      }

      if (upperLimit === undefined) {
        if (valueToCheck > Number.MAX_VALUE) {
          return `Value must be <= ${Number.MAX_VALUE}`;
        }
      } else {
        if (allowUpperLimit && valueToCheck > upperLimit) {
          return `Value needs to be <= ${upperLimit}`;
        }
        if (!allowUpperLimit && valueToCheck >= upperLimit) {
          return `Value needs to be < ${upperLimit}`;
        }
      }
    }
  } catch (e: unknown) {
    return e instanceof Error ? e.message : "Validation error: " + JSON.stringify(e);
  }
  return "";
};
