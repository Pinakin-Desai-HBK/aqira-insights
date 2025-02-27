import { memo, useContext, useEffect } from "react";
import { TimeSeriesContext } from "../context/TimeSeriesContext";
import { useChartManager } from "src/insights/components/dashboard-visualization/chartManager/useChartManagerr";
import { processVisualizationName } from "../../Shared/chart/processVisualizationName";
import { VisualizationDetails } from "src/insights/redux/types/ui/visualizationDetails";
import { TimeSeriesKey } from "src/insights/redux/types/schemas/dashboardVisualizations";
import { VisualizationDetailsContext } from "src/insights/components/dashboard-visualization/context/VisualizationDetailsContext";
import { VisOverLay } from "../../Shared/RenderVisualizationComponent";
import Typography from "@mui/material/Typography";

// https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src/insights/components/Examples/Charts2D/ZoomingAndPanning/VirtualizedDataWithOverview/index.tsx

export const TimeSeriesChart = memo(({ minimapId, legendId }: { minimapId: string; legendId: string }) => {
  const chartManager = useChartManager();
  const { name } = useContext(VisualizationDetailsContext) as VisualizationDetails<TimeSeriesKey>;
  const {
    ref,
    minimapRef,
    legendRef,
    visMessage,
    chartData: { chartSurface }
  } = useContext(TimeSeriesContext);

  useEffect(() => {
    if (chartSurface) {
      chartManager.addChart({ id: name, surface: chartSurface });
    }
  }, [chartManager, chartSurface, name]);

  useEffect(
    () => () => {
      chartManager.removeChart(name);
    },
    [chartManager, name]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        position: "relative",
        padding: "0px 5px 0px 5px"
      }}
    >
      {visMessage ? <VisOverLay message={visMessage} /> : null}
      <div style={{ width: "100%", flexGrow: 0, flexShrink: 0, justifyItems: "center", padding: "10px" }}>
        <Typography
          data-testid={`${name}-chart-title`}
          style={{
            fontSize: "18px",
            textShadow: "0px 1px, 1px 0px, 1px 1px",
            lineHeight: "1.5",
            letterSpacing: "0.00938em"
          }}
        >
          {processVisualizationName(name)}
        </Typography>
      </div>
      <div
        ref={legendRef}
        id={legendId}
        data-testid={legendId}
        style={{ width: "100%", flexGrow: 0, flexShrink: 0, justifyItems: "center" }}
      />
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "end"
        }}
      >
        <div ref={ref} id={name} data-testid={name} style={{ width: "100%", flexGrow: 1, cursor: "default" }} />
        <div
          ref={minimapRef}
          id={minimapId}
          data-testid={minimapId}
          style={{ width: "100%", height: "10%", display: "block" }}
        />
      </div>
    </div>
  );
});
TimeSeriesChart.displayName = "TimeSeriesChart";
