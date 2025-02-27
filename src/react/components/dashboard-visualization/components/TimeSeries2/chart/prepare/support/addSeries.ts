import {
  ELineType,
  EllipsePointMarker,
  EResamplingMode,
  FastLineRenderableSeries,
  GenericAnimation,
  IRenderableSeries,
  SciChartSurface,
  TSciChart,
  XyDataSeries
} from "scichart";
import { LineChartDataWithColor, StoredChartState } from "../../../types";
import { TimeSeriesLegendFontStyle } from "./configureModifiers";
import { truncateLabelMiddle } from "./truncateLabelMiddle";

export class CustomXYDataSeries extends XyDataSeries {
  originalDataSeriesName: string;

  constructor(
    wasmContext: TSciChart,
    options: {
      xValues: Float64Array;
      yValues: Float64Array;
      isSorted: boolean;
      containsNaN: boolean;
      dataSeriesName: string;
      originalDataSeriesName: string;
    }
  ) {
    super(wasmContext, options);
    this.originalDataSeriesName = options.originalDataSeriesName;
  }
}

export const addSeries = (
  wasmContext: TSciChart,
  sciChartSurface: SciChartSurface,
  chartColumns: LineChartDataWithColor[],
  storedChartState: StoredChartState | null,
  addPointMarkers: boolean
) => {
  const showPointMarkers = storedChartState?.showMarkers;
  const hiddemColumns = storedChartState?.hiddenColumns;
  const xySeriesArray: CustomXYDataSeries[] = [];
  chartColumns.forEach((column) => {
    const xyDataSeries = new CustomXYDataSeries(wasmContext, {
      xValues: column.data.x,
      yValues: column.data.y,
      isSorted: true,
      containsNaN: false,
      dataSeriesName: truncateLabelMiddle(
        column.label,
        sciChartSurface.domChartRoot.clientWidth - 100,
        TimeSeriesLegendFontStyle
      ),
      originalDataSeriesName: column.label
    });

    xySeriesArray.push(xyDataSeries);
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
      stroke: column.color,
      strokeThickness: 2,
      lineType: ELineType.Normal,
      resamplingMode: EResamplingMode.None,
      dataSeries: xyDataSeries,
      isVisible: hiddemColumns ? !hiddemColumns[`${column.dataSetId}-${column.label}`] : true,
      ...(addPointMarkers && showPointMarkers
        ? {
            pointMarker: new EllipsePointMarker(wasmContext, {
              width: 6,
              height: 6,
              opacity: 1,
              fill: column.color,
              stroke: column.color
            })
          }
        : {}),
      onHoveredChanged: (sourceSeries: IRenderableSeries, isHovered: boolean) => {
        const targetSeriesOpacity = 1;
        const otherSeriesOpacity = isHovered ? 0.3 : 1;
        const otherSeriesPointOpacity = isHovered ? 0 : 1;
        const sciChartSurface = sourceSeries.parentSurface;
        const otherSeries = sciChartSurface.renderableSeries.asArray().filter((rs) => rs !== sourceSeries);

        if (otherSeries.length === 0) return;

        sciChartSurface.addAnimation(
          new GenericAnimation({
            from: sourceSeries.opacity,
            to: targetSeriesOpacity,
            duration: 100,
            delay: 250,
            onAnimate: (from, to, progress) => {
              const opacity = (to - from) * progress + from;
              sourceSeries.opacity = opacity;
              if (sourceSeries.pointMarker) sourceSeries.pointMarker.opacity = opacity;
            }
          })
        );
        sciChartSurface.addAnimation(
          new GenericAnimation({
            from: otherSeries[0]!.opacity,
            to: otherSeriesOpacity,
            duration: 100,
            delay: 250,
            onAnimate: (from, to, progress) => {
              const opacity = (to - from) * progress + from;
              otherSeries.forEach((rs) => {
                rs.opacity = opacity;
              });
            }
          })
        );
        if (otherSeries[0]!.pointMarker)
          sciChartSurface.addAnimation(
            new GenericAnimation({
              from: otherSeries[0]!.pointMarker.opacity,
              to: otherSeriesPointOpacity,
              duration: 100,
              onAnimate: (from, to, progress) => {
                const opacity = (to - from) * progress + from;
                otherSeries.forEach((rs) => {
                  if (rs.pointMarker) rs.pointMarker.opacity = opacity;
                });
              }
            })
          );
      }
    });
    sciChartSurface.renderableSeries.add(lineSeries);
  });
  return xySeriesArray;
};
