import { ConvertedColumnDetails } from "src/insights/redux/types/schemas/dataExplorer";

export const getFilterValues = ({ columnDetails }: { columnDetails: ConvertedColumnDetails[] }) => ({
  unitValues: Array.from(
    columnDetails.reduce((outerAcc, outerCurr) => {
      const result = Array.from(
        outerCurr.dataColumns.reduce((acc, curr) => {
          if (curr.units) {
            acc.add(curr.units);
          }
          return acc;
        }, new Set<string>())
      );
      result.forEach((unit) => outerAcc.add(unit));

      return outerAcc;
    }, new Set<string>())
  ),
  typeValues: Array.from(
    columnDetails.reduce((outerAcc, outerCurr) => {
      const result = Array.from(
        outerCurr.dataColumns.reduce((acc, curr) => {
          if (curr.type) {
            acc.add(curr.type);
          }
          return acc;
        }, new Set<string>())
      );
      result.forEach((unit) => outerAcc.add(unit));

      return outerAcc;
    }, new Set<string>())
  )
});
