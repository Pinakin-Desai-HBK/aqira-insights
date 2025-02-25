import { useGetPropertiesQuery } from "../api/appApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { WorkspaceItemIdentifier } from "../types/redux/networkNodes";
import { parse as jsonBigIntParse, stringify as jsonBigIntStringify } from "json-bigint";
import { WorkspaceItemProperties } from "../types/schemas/workspace-item";
import { useEffect, useState } from "react";

export const useProperties = (props: WorkspaceItemIdentifier | null): WorkspaceItemProperties | null => {
  const { data: properties } = useGetPropertiesQuery(props ?? skipToken);
  const [parsedProperties, setParsedProperties] = useState<WorkspaceItemProperties | null>(null);
  useEffect(() => {
    if (!properties) {
      setParsedProperties(null);
      return;
    }
    setParsedProperties((current) => {
      if (!current || jsonBigIntStringify(current) !== properties) {
        return jsonBigIntParse(properties);
      }
      return current;
    });
  }, [properties]);
  return parsedProperties;
};
