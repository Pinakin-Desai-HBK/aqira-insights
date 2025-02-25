import { useCallback, useContext } from "react";
import { DASHBOARD_CONNECTION_FILE_PREFIX, NETWORK_CONNECTION_FILE_PREFIX } from "src/consts/consts";
import { getTypeDiscriminator, getValue } from "src/components/properties/property/usePropertyUtils";
import { DragAndDropDataFormat } from "src/enums/enums";
import { useUpdatePropertyMutation } from "src/redux/api/appApi";
import { VisualizationDetailsContext } from "../context/VisualizationDetailsContext";
import { UseConnectVisualizationResult } from "src/redux/types/ui/dashboardVisualization";

export const useConnectVisualization = (): UseConnectVisualizationResult => {
  const details = useContext(VisualizationDetailsContext);
  const [updatePropertyMutation] = useUpdatePropertyMutation();
  const onDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const { type, workspace, id } = details;
      const hasFileDataType = event.dataTransfer.types.includes(DragAndDropDataFormat.Data);
      const hasDisplayDataType = event.dataTransfer.types.includes(DragAndDropDataFormat.Display);

      let value = "";
      let networkRun = false;
      if (hasFileDataType) {
        const filePaths = JSON.parse(event.dataTransfer.getData(DragAndDropDataFormat.Data));
        if (filePaths.length === 0) return;
        value = `${NETWORK_CONNECTION_FILE_PREFIX}${filePaths[0]}`;
        networkRun = true;
      }
      if (hasDisplayDataType) {
        const { displayNode } = JSON.parse(event.dataTransfer.getData(DragAndDropDataFormat.Display));
        value = `${DASHBOARD_CONNECTION_FILE_PREFIX}${displayNode}`;
      }

      await updatePropertyMutation({
        item: { workspace, workspaceItem: { type, id } },
        propertyName: "Connection",
        details: {
          type: getTypeDiscriminator(value),
          value: getValue(value),
          networkRun: networkRun
        }
      });
    },
    [details, updatePropertyMutation]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.effectAllowed = "copy";
    event.preventDefault();
    event.stopPropagation();
  }, []);
  return { onDrop, onDragOver };
};
