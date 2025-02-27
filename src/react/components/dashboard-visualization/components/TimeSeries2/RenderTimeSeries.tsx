import { memo, useContext } from "react";
import { TimeSeriesKey } from "src/react/redux/types/schemas/dashboardVisualizations";
import { VisualizationDetails } from "src/react/redux/types/ui/visualizationDetails";
import { TimeSeriesContext } from "./context/TimeSeriesContext";
import { VisualizationDetailsContext } from "../../context/VisualizationDetailsContext";
import { TimeSeriesChart } from "./chart/TimeSeriesChart";
import { RenderVisualizationComponent } from "../Shared/RenderVisualizationComponent";
import { appLabels } from "src/react/consts/labels";

export const RenderTimeSeries = memo(() => {
  const { name } = useContext(VisualizationDetailsContext) as VisualizationDetails<TimeSeriesKey>;

  const { chartData, visError } = useContext(TimeSeriesContext);

  const { properties } = useContext(VisualizationDetailsContext) as VisualizationDetails<TimeSeriesKey>;

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
          if (!chartData.dataSetId || !chartData.chartColumns.length) {
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
    <RenderVisualizationComponent show={true} errorMessage={getErrorMessage()} visTypeName="Time Series">
      <TimeSeriesChart minimapId={`${name}-overview`} legendId={`${name}-legend`} />
    </RenderVisualizationComponent>
  ) : null;
});
RenderTimeSeries.displayName = "RenderTimeSeries";
