import { useCallback } from "react";
import { useExpressionEditorDialog } from "../../dialog/hooks/useExpressionEditorDialog";
import { useRichTextEditorDialog } from "../../dialog/hooks/useRichTextEditorDialog";
import { useProperties } from "src/redux/hooks/useProperties";
import { WorkspaceItemIdentifier } from "src/redux/types/redux/networkNodes";
import { WorkspaceItemProperties, WorkspaceItemProperty } from "src/redux/types/schemas/workspace-item";
import {
  useUpdatePropertyExpressionMutation,
  useUpdatePropertyMutation,
  useUpdateWorkspaceItemNameMutation
} from "src/redux/api/appApi";
import { parse as jsonBigIntParse } from "json-bigint";
import { Property } from "src/redux/types/schemas/properties";
import {
  PropertyParams,
  PropertyValueTypes,
  UpdateHandler,
  UsePropertyUtilsHookResponse
} from "src/redux/types/ui/properties";
import { selectStore_UI_Workspace_SelectedWorkspaceItem } from "src/redux/slices/ui/workspace/workspaceSlice";
import { useAppSelector } from "src/redux/hooks/hooks";

const getExpressionEditorValue = (property: WorkspaceItemProperty): string => {
  if (!property) return "";
  return property.type === "Python" ? property.value || "" : property.expression || "";
};

export const getTypeDiscriminator = (value: string | number | boolean | string[] | null): string => {
  if (Array.isArray(value)) {
    // Example for handling arrays, assuming a string list
    return "StringList";
  } else {
    return "String"; // Fallback type
  }
};

export const getValue = (value: string | number | boolean | string[] | null): string | string[] => {
  if (Array.isArray(value)) {
    return value;
  } else {
    return value?.toString() ?? ""; // Fallback type
  }
};

export const usePropertyUtils = ({
  propertyFieldProps,
  property
}: PropertyParams<Property>): UsePropertyUtilsHookResponse => {
  const selectedWorkspaceItem = useAppSelector(selectStore_UI_Workspace_SelectedWorkspaceItem);
  const { name } = propertyFieldProps;
  const properties = useProperties(selectedWorkspaceItem?.data.identifier ?? null);

  const [updatePropertyMutation] = useUpdatePropertyMutation();
  const [updateNameMutation] = useUpdateWorkspaceItemNameMutation();
  const [updateExpressionMutation] = useUpdatePropertyExpressionMutation();

  const updatePropertyHandler = useCallback(
    async ({
      item,
      propertyName,
      value,
      setExpression,
      properties
    }: {
      item: WorkspaceItemIdentifier | null;
      propertyName: string;
      value: PropertyValueTypes;
      setExpression: boolean | undefined;
      properties: WorkspaceItemProperties;
    }): Promise<WorkspaceItemProperty | null> => {
      if (!item) {
        return null;
      }
      if (propertyName === "Name") {
        const apiResponse = await updateNameMutation({
          ...item,
          newName: value !== null ? value.toString() : ""
        });

        if (apiResponse.data) {
          return {
            setting: "Value",
            type: "String",
            value: apiResponse.data.name,
            expression: null
          };
        }
        return null;
      }

      if (!properties) {
        return null;
      }
      const property = properties[propertyName];

      // setExpression is undefined so a switch between expression and value isn't being requested
      // therefore we can skip the request if there has been no change
      if (property) {
        if (
          setExpression === undefined &&
          ((property.setting === "Value" && property.value === value) ||
            (property.setting === "Expression" && property.expression === value))
        ) {
          return Promise.resolve(property);
        }
      }

      if (!setExpression) {
        const result = (
          await updatePropertyMutation({
            item,
            propertyName,
            details: {
              type: getTypeDiscriminator(value),
              value: value !== null ? getValue(value) : null
            }
          })
        ).data;
        return result ? jsonBigIntParse(result) : null;
      }

      const result = (
        await updateExpressionMutation({
          item,
          propertyName,
          details: {
            expression: value !== null ? value.toString() : null
          }
        })
      ).data;

      return result ? jsonBigIntParse(result) : null;
    },
    [updateExpressionMutation, updateNameMutation, updatePropertyMutation]
  );

  const updatePropertyCallback = useCallback(
    async (value: PropertyValueTypes, propertyName: string, setExpression: boolean | undefined) => {
      if (!selectedWorkspaceItem) throw Error("No selected item");
      if (!properties) throw Error("No properties");
      return await updatePropertyHandler({
        propertyName,
        setExpression,
        item: selectedWorkspaceItem.data.identifier,
        value,
        properties
      });
    },
    [selectedWorkspaceItem, updatePropertyHandler, properties]
  );

  const switchToExpression = useCallback(
    async (name: string) => property && (await updatePropertyCallback(property.expression, name, true)),
    [property, updatePropertyCallback]
  );

  const switchToValue = useCallback(
    async (name: string) => property && (await updatePropertyCallback(property.value, name, false)),
    [property, updatePropertyCallback]
  );

  const updateProperty: UpdateHandler<PropertyValueTypes> = useCallback(
    async (value: PropertyValueTypes) => property && (await updatePropertyCallback(value, name, undefined)),
    [property, name, updatePropertyCallback]
  );

  const updateExpression: UpdateHandler<string | null> = useCallback(
    async (updatedValue: string | null) => await updatePropertyCallback(updatedValue, name, true),
    [name, updatePropertyCallback]
  );

  const updateRichText: UpdateHandler<string | null> = useCallback(
    async (updatedRichText: string | null) => await updatePropertyCallback(updatedRichText || "", name, false),
    [name, updatePropertyCallback]
  );

  const { openExpressionEditor } = useExpressionEditorDialog({
    value: getExpressionEditorValue(property),
    updateHandler: property.type === "Python" ? updateProperty : updateExpression,
    identifier: name,
    title: property.type === "Python" ? "Python Editor" : "Expression Editor",
    showOverview: property.type === "Python"
  });

  const { openRichTextEditor } = useRichTextEditorDialog(
    property && property.value !== null ? String(property.value) : "",
    updateRichText,
    selectedWorkspaceItem?.id || ""
  );

  return {
    openExpressionEditor,
    openRichTextEditor,
    updateProperty,
    switchToExpression,
    switchToValue
  };
};
