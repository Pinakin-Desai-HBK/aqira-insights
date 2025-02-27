import { useCallback, useState } from "react";
import { DragAndDropDataFormat } from "../../../../enums/enums";
import {
  NETWORK_CONNECTION_FILE_PREFIX,
  NETWORK_DATA_FRAME_CONNECTOR_NODE,
  NETWORK_INPUT_NODE
} from "src/insights/consts/consts";
import { validateName } from "../../../properties/property/validateName";
import { getTypeDiscriminator, getValue } from "../../../properties/property/usePropertyUtils";
import { useWorkspaceItemNameValidator } from "../../hooks/useWorkspaceItemNameValidator";
import { useProperties } from "src/insights/redux/hooks/useProperties";
import { useUpdatePropertyMutation, useUpdateWorkspaceItemNameMutation } from "src/insights/redux/api/appApi";
import { InlineEditValidationResult } from "src/insights/redux/types/ui/inlineEdit";
import { NetworkNodeDataUI } from "src/insights/redux/types/ui/networkNodes";

export const useNetworkNode = (id: string, data: NetworkNodeDataUI) => {
  const nameValidator = useWorkspaceItemNameValidator();
  const [editing, setEditing] = useState<boolean>(false);
  const [updatePropertyMutation] = useUpdatePropertyMutation();
  const [updateNameMutation] = useUpdateWorkspaceItemNameMutation();
  const properties = useProperties(data.identifier);

  const onDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const hasTransferData = event.dataTransfer.types.includes(DragAndDropDataFormat.Data);
      const isInputNode = data.type === NETWORK_INPUT_NODE;
      const isDataFrameConnectorNode = data.type === NETWORK_DATA_FRAME_CONNECTOR_NODE;

      if ((isInputNode || isDataFrameConnectorNode) && hasTransferData && properties) {
        const filePaths = JSON.parse(event.dataTransfer.getData(DragAndDropDataFormat.Data));
        const hasFilePaths = filePaths && filePaths.length > 0;

        if (hasFilePaths) {
          let propertyName = "";
          let newPropertyValue: string | string[] = "";

          if (isInputNode) {
            propertyName = "Connections";
            const connectionsProperty = properties[propertyName];
            const existingConnections = connectionsProperty?.type === "StringList" ? connectionsProperty.value : null;

            newPropertyValue = event.ctrlKey && existingConnections ? existingConnections : [];
            filePaths.forEach((filePath: string) => {
              const newConnection = `${NETWORK_CONNECTION_FILE_PREFIX}${filePath}`;
              (newPropertyValue as string[]).push(newConnection);
            });
          }

          if (isDataFrameConnectorNode) {
            propertyName = "InputFilename";
            newPropertyValue = filePaths[0];
          }

          await updatePropertyMutation({
            item: data.identifier,
            propertyName,
            details: {
              type: getTypeDiscriminator(newPropertyValue),
              value: getValue(newPropertyValue)
            }
          });
        }
      }
    },
    [data.type, data.identifier, properties, updatePropertyMutation]
  );

  const onDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const hasDataType = event.dataTransfer.types.includes(DragAndDropDataFormat.Data);
      const isDataDroppable =
        data.type === NETWORK_INPUT_NODE ||
        (data.type === NETWORK_DATA_FRAME_CONNECTOR_NODE && properties && properties["Type"]?.value === "Input");
      const value = !hasDataType || !isDataDroppable ? "none" : event.ctrlKey ? "copy" : "move";
      event.dataTransfer.dropEffect = value;
      event.dataTransfer.effectAllowed = value;
      event.preventDefault();
      event.stopPropagation();
    },
    [data.type, properties]
  );

  const validationHandler = useCallback(
    (value: string): InlineEditValidationResult => {
      const error = validateName(value, nameValidator, id);
      return error !== "" ? { valid: false, errorMessage: error } : { valid: true };
    },
    [id, nameValidator]
  );

  const onNameUpdate = useCallback(
    async (value: string) => {
      if (data.name === value) {
        return;
      }
      await updateNameMutation({
        ...data.identifier,
        newName: value
      });
    },
    [data.name, data.identifier, updateNameMutation]
  );

  return { onDrop, onDragOver, validationHandler, onNameUpdate, editing, setEditing };
};
