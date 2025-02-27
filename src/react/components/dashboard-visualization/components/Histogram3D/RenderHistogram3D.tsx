import { memo, useContext } from "react";
import { HistogramContext } from "./context/HistogramContext";
import { RenderVisualizationComponent } from "../Shared/RenderVisualizationComponent";
import { VisualizationDetailsContext } from "../../context/VisualizationDetailsContext";
import { VisualizationDetails } from "src/react/redux/types/ui/visualizationDetails";
import { Histogram3DKey } from "src/react/redux/types/schemas/dashboardVisualizations";
import { appLabels } from "src/react/consts/labels";
import { Histogram3DChart } from "./chart/Histogram3DChart";

export const RenderHistogram3D = memo(() => {
  const { chartData, visError } = useContext(HistogramContext);

  const { properties } = useContext(VisualizationDetailsContext) as VisualizationDetails<Histogram3DKey>;

  const getErrorMessage = () => {
    const connectionIsEmpty = properties.connection === null || properties.connection === "";
    const connectionType =
      properties.connection !== null
        ? properties.connection.startsWith("aadisplay")
          ? "displayNode"
          : "fileDirect"
        : "none";
    if (connectionIsEmpty) {
      return appLabels.VisualizationErrorMessages.noConnection;
    }
    if (visError) {
      switch (visError) {
        case "DATA_INVALID":
          return appLabels.VisualizationErrorMessages.dataInvalid;
        case "API_ERROR":
          return appLabels.VisualizationErrorMessages.dataNotAvailable;
        case "NO_DATA_AVAILABLE":
          if (!chartData.dataSetId || !chartData.allData) {
            return connectionType === "displayNode"
              ? appLabels.VisualizationErrorMessages.dataNotAvailableNetwork
              : appLabels.VisualizationErrorMessages.dataNotAvailableDirect;
          }
          return appLabels.VisualizationErrorMessages.dataNotAvailable;
        case "NO_DATA_FOR_DATA_SET":
          return appLabels.VisualizationErrorMessages.dataNotAvailable;
      }
    }
    return null;
  };

  return chartData !== null ? (
    <RenderVisualizationComponent show={true} errorMessage={getErrorMessage()} visTypeName="Histogram3D">
      <Histogram3DChart />
    </RenderVisualizationComponent>
  ) : null;
});
RenderHistogram3D.displayName = "RenderHistogram3D";
