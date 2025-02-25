import {
  CameraController,
  DpiHelper,
  ECameraProjectionMode,
  MouseWheelZoomModifier3D,
  NumberRange,
  NumericAxis3D,
  OrbitModifier3D,
  ResetCamera3DModifier,
  SciChartJSDarkv2Theme,
  TooltipModifier3D,
  Vector3
} from "scichart";
import { CreateChart } from "../types";

export const createChart: CreateChart = async ({
  chartData,
  sciChartResult: { sciChart3DSurface, wasmContext },
  processedChartData
}) => {
  if (!chartData.allData) return;

  sciChart3DSurface.applyTheme({
    ...new SciChartJSDarkv2Theme(),
    sciChartBackground: "#FFF",
    loadingAnimationBackground: "#FFF",
    loadingAnimationForeground: "#FFF",
    gridBackgroundBrush: "#FFF",
    majorGridLineBrush: "#FFF",
    minorGridLineBrush: "#FFF"
  });
  sciChart3DSurface.background = "#FFF";

  sciChart3DSurface.chartModifiers.add(
    new MouseWheelZoomModifier3D(),
    new OrbitModifier3D(),
    new ResetCamera3DModifier(),
    new TooltipModifier3D({
      showTooltip: true,
      crosshairStroke: "green",
      crosshairStrokeThickness: 2,
      tooltipDataTemplate: (data) => {
        return data
          ? [`X: ${data.xValue.toFixed(2)}`, `Y: ${data.zValue.toFixed(2)}`, `Z: ${data.yValue.toFixed(2)}`]
          : [];
      }
    })
  );

  DpiHelper.IsDpiScaleEnabled = true;

  const { ranges } = processedChartData;

  const axisStyle = {
    axisTitleStyle: { fontSize: 18, color: "#000", fontFamily: "Arial" },
    labelStyle: { fontSize: 16, color: "#000", fontFamily: "Arial" },
    drawMajorBands: false,
    drawMajorGridLines: true,
    majorGridLineStyle: { color: "#000", strokeThickness: 1 },
    drawMinorGridLines: false,
    minorGridLineStyle: { color: "#DDD", strokeThickness: 0.5 },
    minorsPerMajor: 5,
    tickLabelsOffset: 0
  };

  const xAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "",
    visibleRange: new NumberRange(ranges.x.min, ranges.x.max),
    ...axisStyle
  });
  sciChart3DSurface.xAxis = xAxis;
  const yAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "",
    visibleRange: new NumberRange(ranges.y.min, ranges.y.max),
    ...axisStyle
  });
  sciChart3DSurface.yAxis = yAxis;
  const zAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "",
    visibleRange: new NumberRange(ranges.z.min, ranges.z.max),
    ...axisStyle
  });
  sciChart3DSurface.zAxis = zAxis;

  const xSize = ranges.x.max - ranges.x.min;
  const zSize = ranges.z.max - ranges.z.min;

  sciChart3DSurface.worldDimensions = new Vector3(300, 200, (300 / xSize) * zSize);
  sciChart3DSurface.camera = new CameraController(wasmContext, {
    position: new Vector3(250, 300, -250),
    target: new Vector3(0, 100, 0)
  });
  sciChart3DSurface.camera.projectionMode = ECameraProjectionMode.Orthogonal;

  chartData.refs = { chartSurface: sciChart3DSurface, wasmContext, xAxis, yAxis, zAxis };
};
