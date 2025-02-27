import {
  CursorModifier,
  CursorTooltipSvgAnnotation,
  EExecuteOn,
  ELegendOrientation,
  EXyDirection,
  LegendModifier,
  MouseWheelZoomModifier,
  RubberBandXyZoomModifier,
  SciChartSurface,
  SeriesInfo,
  SeriesSelectionModifier,
  XySeriesInfo,
  ZoomExtentsModifier
} from "scichart";
import { getTextWidth } from "src/insights/components/inline-edit/text-utils";
import { StoreRangeModifier } from "../customModifiers/StoreRangeModifier";
import { DisableTooltipZoomPanModifier } from "../../../../Shared/chart/prepare/customModifiers/DisableTooltipZoomPanModifier";
import { ChartData, StoredChartState } from "../../../types";
import { updateYRange } from "../../utils/updateYRange";
import { CustomXYDataSeries } from "./addSeries";
import { RefObject } from "react";
import { truncateLabelMiddle } from "./truncateLabelMiddle";

export const TimeSeriesLegendFontStyle = "12px Arial";
const TimeSeriesTooltipFontStyle = "10px Arial";

export const configureModifiers = (
  chartData: RefObject<ChartData>,
  sciChartSurface: SciChartSurface,
  legendRef: HTMLDivElement,
  setStoredChartState: (params: { newStoredChartState: Partial<StoredChartState> }) => void
) => {
  const cursorModifier = new CursorModifier({
    showTooltip: true,
    showYLine: true,
    showXLine: true,

    tooltipSvgTemplate: (seriesInfo: SeriesInfo[], svgAnnotation: CursorTooltipSvgAnnotation): string => {
      const valuesWithLabels: string[] = [];
      const getLabelDetails = (seriesInfo: SeriesInfo[]) => {
        const labels = seriesInfo
          .filter((info) => {
            const xySeriesInfo = info;
            return xySeriesInfo.renderableSeries.opacity >= 1;
          })
          .map((info) => {
            const xySeriesInfo = info as XySeriesInfo;
            const valueWidth = getTextWidth(xySeriesInfo.yValue.toString(), "10px Verdana") || 0;
            var yAxisWidth = sciChartSurface.yAxes.get(0).viewRect.width + 50;
            const customLabel = truncateLabelMiddle(
              (xySeriesInfo.renderableSeries.dataSeries as CustomXYDataSeries).originalDataSeriesName,
              (sciChartSurface.domSeriesBackground.clientWidth - yAxisWidth) * 0.5,
              TimeSeriesTooltipFontStyle
            );
            const labelWidth = getTextWidth(customLabel, "10px Verdana") || 0;
            return {
              label: customLabel,
              value: xySeriesInfo.yValue,
              labelWidth: valueWidth > labelWidth ? valueWidth : labelWidth,
              stroke: xySeriesInfo.renderableSeries.stroke,
              xySeriesInfo
            };
          });
        return labels;
      };

      const labels = getLabelDetails(seriesInfo);
      if (labels.length === 0) return "<svg />";
      const maxLabelWidth = Math.max(...labels.map((label) => label.labelWidth));
      const width = maxLabelWidth + 20;
      const height = labels.length * 30;
      labels.forEach((info, index) => {
        const { stroke, label, value } = info;
        valuesWithLabels.push(
          `<svg y="${index * 30}" x="${0}" width="${width}" height="30">
              <rect x="0" y="0" width="100%" height="30" fill="${stroke}" fill-opacity=".5" />
              <text x="5" y="25%" x="50%" y="25%" dominant-baseline="middle" text-anchor="left" font-size="10" font-family="Verdana" fill="black">${label}</text>  
              <text x="5" y="75%" x="50%" y="75%" dominant-baseline="middle" text-anchor="left" font-size="10" font-family="Verdana" fill="black">${value}</text>  
            </svg>`
        );
      });

      var seriesViewRect = svgAnnotation.parentSurface.seriesViewRect;
      var yAxisWidth = sciChartSurface.yAxes.get(0).viewRect.width;
      var xCoord = svgAnnotation.x1;
      var yCoord = svgAnnotation.y1;
      var xCoordShift = seriesViewRect.width - (xCoord + yAxisWidth / 4) < width ? -width : 5;
      var yCoordShift = seriesViewRect.height - yCoord < height ? -height : 5;
      svgAnnotation.xCoordShift = xCoordShift;
      svgAnnotation.yCoordShift = yCoordShift;

      return `
          <svg width="${width}" height="${height}" fill="none" style="z-index: 1000;">
            <rect width="100%" height="100%" style="fill: none"/>
            ${valuesWithLabels.join()}
          </svg>`;
    }
  });
  if (chartData.current) {
    if (chartData.current.resizeObserver) chartData.current.resizeObserver.disconnect();
    const expectedSizes = new WeakMap();
    chartData.current.resizeObserver = new ResizeObserver((observerEntries) => {
      requestAnimationFrame(() => {
        observerEntries.forEach((entry) => {
          const expectedSize = expectedSizes.get(entry.target);
          if (entry.contentBoxSize[0] && expectedSize === entry.contentBoxSize[0].inlineSize) {
            return;
          }
          const newSize = entry.contentBoxSize[0]?.inlineSize;
          expectedSizes.set(entry.target, newSize);
          if (!chartData.current || !newSize) return;
          chartData.current.xySeriesArray.forEach((series) => {
            if (!(series instanceof CustomXYDataSeries)) return;
            series.dataSeriesName = truncateLabelMiddle(
              series.originalDataSeriesName,
              newSize - 100,
              TimeSeriesLegendFontStyle
            );
            sciChartSurface.chartModifiers.asArray().forEach((modifier) => {
              if (modifier instanceof LegendModifier) {
                sciChartSurface.chartModifiers.remove(modifier);
                sciChartSurface.chartModifiers.add(
                  new LegendModifier({
                    showCheckboxes: true,
                    orientation: ELegendOrientation.Horizontal,
                    placementDivId: legendRef,
                    margin: 0,
                    backgroundColor: "#FFF",
                    textColor: "#444",
                    isCheckedChangedCallback: () => {
                      setTimeout(() => {
                        updateYRange(sciChartSurface);
                      }, 0);
                    }
                  })
                );
              }
            });
          });
        });
      });
    });
    chartData.current.resizeObserver.observe(sciChartSurface.domChartRoot);
  }

  sciChartSurface.chartModifiers.add(new StoreRangeModifier(sciChartSurface, setStoredChartState));
  sciChartSurface.chartModifiers.add(new ZoomExtentsModifier({}));
  sciChartSurface.chartModifiers.add(
    new DisableTooltipZoomPanModifier([cursorModifier], {
      xyDirection: EXyDirection.XDirection,
      executeOn: EExecuteOn.MouseRightButton
    })
  );
  sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }));
  sciChartSurface.chartModifiers.add(
    new RubberBandXyZoomModifier({
      xyDirection: EXyDirection.XDirection,
      executeOn: EExecuteOn.MouseLeftButton
    })
  );
  const legendModifier = new LegendModifier({
    showCheckboxes: true,
    orientation: ELegendOrientation.Horizontal,
    placementDivId: legendRef,
    margin: 0,
    backgroundColor: "#FFF",
    textColor: "#444",
    isCheckedChangedCallback: () => {
      setTimeout(() => {
        updateYRange(sciChartSurface);
      }, 0);
    }
  });
  sciChartSurface.chartModifiers.add(legendModifier);
  sciChartSurface.chartModifiers.add(
    new SeriesSelectionModifier({
      enableHover: true,
      enableSelection: false
    })
  );
  sciChartSurface.chartModifiers.add(cursorModifier);
};
