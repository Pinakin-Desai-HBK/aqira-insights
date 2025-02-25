import { memo, useContext } from "react";
import { HistogramContext } from "./context/HistogramContext";
import { HistogramChart } from "./chart/HistogramChart";
import { RenderVisualizationComponent } from "../Shared/RenderVisualizationComponent";
import { VisualizationDetailsContext } from "../../context/VisualizationDetailsContext";
import { VisualizationDetails } from "src/redux/types/ui/visualizationDetails";
import { HistogramKey, TimeSeriesKey } from "src/redux/types/schemas/dashboardVisualizations";
import { appLabels } from "src/consts/labels";

export const RenderHistogram = memo(() => {
  const { chartData, visError } = useContext(HistogramContext);

  const { properties } = useContext(VisualizationDetailsContext) as VisualizationDetails<TimeSeriesKey | HistogramKey>;

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
          if (!chartData.dataSetId || !chartData.data) {
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
    <RenderVisualizationComponent show={true} errorMessage={getErrorMessage()} visTypeName="Histogram">
      <HistogramChart />
    </RenderVisualizationComponent>
  ) : null;
});
RenderHistogram.displayName = "RenderHistogram";
