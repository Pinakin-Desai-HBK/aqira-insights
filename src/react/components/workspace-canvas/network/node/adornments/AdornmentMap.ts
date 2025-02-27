import { getValue } from "src/react/components/properties/property/usePropertyUtils";
import { CountAddornment } from "./CountAdornment";
import { WorkspaceItemProperties, WorkspaceItemProperty } from "src/react/redux/types/schemas/workspace-item";
import { JSX } from "react";

type AdornmentMapInput = string | number | boolean | string[] | null;

type AdornmentMapEntry<I extends AdornmentMapInput, O extends number | string> = {
  adornment: (params: { value: O; id: string; tooltip: string }) => JSX.Element;
  propertyName: string;
  processProperty: (value: I) => O;
  condition?: (properties: WorkspaceItemProperties) => boolean;
  tooltip: string;
};

const InputEntry: AdornmentMapEntry<AdornmentMapInput, number> = {
  adornment: CountAddornment,
  tooltip: "Number of files",
  propertyName: "Connections",
  processProperty: (value) => {
    const processedValue = getValue(value);
    return Array.isArray(processedValue) ? processedValue.length : processedValue.trim().length > 0 ? 1 : 0;
  }
};

const DataFrameConnectorEntry: AdornmentMapEntry<AdornmentMapInput, number> = {
  adornment: CountAddornment,
  tooltip: "Number of files",
  propertyName: "InputFilename",
  condition: (properties) => {
    const typeProperty: WorkspaceItemProperty | null =
      properties !== null && properties["Type"] !== undefined ? properties["Type"] : null;
    if (typeProperty === null) return false;

    return typeProperty.value === "Input";
  },
  processProperty: (value) => {
    const processedValue = getValue(value);
    return Array.isArray(processedValue) ? processedValue.length : processedValue.trim().length > 0 ? 1 : 0;
  }
};

export const AdornmentMap: Record<string, AdornmentMapEntry<string | number | boolean | string[] | null, number>> = {
  Input: InputEntry,
  DataFrameConnector: DataFrameConnectorEntry
};
