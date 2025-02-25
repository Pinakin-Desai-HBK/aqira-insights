import { memo, useContext, useEffect } from "react";
import { VisualizationDetailsContext } from "src/components/dashboard-visualization/context/VisualizationDetailsContext";
import { Histogram3DKey } from "src/redux/types/schemas/dashboardVisualizations";
import { VisualizationDetails } from "src/redux/types/ui/visualizationDetails";
import { IndexSelect } from "../../Shared/chart/IndexSelect";
import { VisOverLay } from "../../Shared/RenderVisualizationComponent";
import { useChartManager } from "src/components/dashboard-visualization/chartManager/useChartManagerr";
import { HistogramContext } from "../context/HistogramContext";
import { processVisualizationName } from "../../Shared/chart/processVisualizationName";
import { ChannelSelect } from "../../Shared/chart/ChannelSelect";
import { GradientLegend } from "./GradientLegend";

const TOP_SECTION_1 = 42;
const TOP_SECTION_2 = 16;
const INDEX_SECTION_BASE = 30;

export const Histogram3DChart = memo(() => {
  const chartManager = useChartManager();
  const { id, name } = useContext(VisualizationDetailsContext) as VisualizationDetails<Histogram3DKey>;
  const {
    setRef,
    visMessage,
    setSelectedChannel,
    setSelectedIndex,
    chartData: { indexSelectionDetails, refs, channelNames, selectedChannel, zRange, colors, indexes, selectedIndex }
  } = useContext(HistogramContext);

  useEffect(() => {
    if (refs && refs.chartSurface) {
      chartManager.addChart({ id, surface3D: refs.chartSurface });
      chartManager.addChart({ id: name, surface3D: refs.chartSurface });
    }
  }, [refs, chartManager, id, name]);

  useEffect(
    () => () => {
      chartManager.removeChart(id);
    },
    [chartManager, id]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        position: "relative",
        padding: "0px 5px 0px 5px",
        cursor: "default",
        gap: "5px"
      }}
    >
      {visMessage ? <VisOverLay message={visMessage} /> : null}
      <div
        style={{
          width: "100%",
          flexGrow: 0,
          flexShrink: 0,
          justifyItems: "center",
          visibility: visMessage ? "hidden" : "visible"
        }}
      >
        <div
          style={{
            fontSize: "18px",
            textShadow: "0px 1px, 1px 0px, 1px 1px",
            lineHeight: "1.5",
            letterSpacing: "0.00938em",
            padding: "10px",
            paddingBottom: "0px",
            zIndex: 1001
          }}
          data-testid={`${name}-chart-title`}
        >
          {processVisualizationName(name)}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          flexGrow: 0,
          flexShrink: 0,
          justifyItems: "center",
          visibility: visMessage ? "hidden" : "visible"
        }}
      >
        {selectedChannel ? (
          <ChannelSelect
            channelNames={channelNames}
            selectedChannel={selectedChannel}
            setSelectedChannel={setSelectedChannel}
          />
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          flexGrow: 1,
          flexShrink: 1,
          justifyItems: "center",
          height: `calc(100% - ${TOP_SECTION_1 + TOP_SECTION_2}px)`,
          visibility: visMessage ? "hidden" : "visible"
        }}
      >
        <div
          style={{
            height: indexSelectionDetails.maxWidth
              ? `calc(100% - ${indexSelectionDetails.maxWidth + INDEX_SECTION_BASE}px`
              : "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <div
            ref={setRef}
            id={id}
            data-testid={name}
            style={{
              width: "100%",
              height: "100%",
              cursor: "default"
            }}
          />
          {zRange ? <GradientLegend min={zRange.min} max={zRange.max} colors={colors} /> : null}
        </div>
        {indexSelectionDetails.maxWidth !== undefined && indexSelectionDetails.marksData !== undefined ? (
          <div
            style={{
              height: `${indexSelectionDetails.maxWidth + INDEX_SECTION_BASE}px`,
              display: "flex",
              alignItems: "end"
            }}
          >
            <IndexSelect
              marksData={indexSelectionDetails.marksData}
              visType={Histogram3DKey}
              indexes={indexes}
              selectedIndex={selectedIndex}
              setSelectedIndex={setSelectedIndex}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
});
Histogram3DChart.displayName = "Histogram3DChart";
