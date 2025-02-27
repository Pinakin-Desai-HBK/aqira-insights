import { useEffect, useMemo, useState } from "react";
import { ColumnDetailsArray, ConvertedColumnDetails } from "src/insights/redux/types/schemas/dataExplorer";
import { DataFileDetails } from "src/insights/redux/types/ui/dataExplorer";
import { parse as jsonBigIntParse } from "json-bigint";
import { getHeaderItems } from "./utils/getHeaderItems";
import { ColumnDetails } from "./components/ColumnDetails";

export const RenderColumnDetails = ({
  columnDetails,
  dataFileDetails
}: { columnDetails: string } & DataFileDetails) => {
  const [convertedColumnDetails, setConvertedColumnDetails] = useState<ConvertedColumnDetails[] | null>(null);

  useEffect(() => {
    const parsedColumnDetails: ColumnDetailsArray = jsonBigIntParse(columnDetails);

    const convertedColumnDetails: ConvertedColumnDetails[] = parsedColumnDetails.map((columnDetail) => {
      return {
        ...columnDetail,
        index: columnDetail.index.isIso
          ? {
              ...columnDetail.index,
              base: columnDetail.index.isoBase,
              sampleRate:
                typeof columnDetail.index.isoIncrement === "number"
                  ? 1 / columnDetail.index.isoIncrement
                  : typeof columnDetail.index.isoIncrement === "bigint"
                    ? 1n / columnDetail.index.isoIncrement
                    : 1 / columnDetail.index.isoIncrement
            }
          : columnDetail.index
      };
    });
    setConvertedColumnDetails(convertedColumnDetails);
  }, [columnDetails]);

  const headerItems = useMemo(() => {
    return convertedColumnDetails ? getHeaderItems({ columnDetails: convertedColumnDetails, dataFileDetails }) : null;
  }, [convertedColumnDetails, dataFileDetails]);

  return convertedColumnDetails && headerItems ? (
    <ColumnDetails columnDetails={convertedColumnDetails} headerItems={headerItems} />
  ) : null;
};
