import { NumericAxis3D, SciChart3DSurface, SciChartSurface, TWebAssemblyChart, TWebAssemblyChart3D } from "scichart";
import { setSciChart3DKey, setSciChartKey } from "sciChart/key/sciChartKey";
import { CustomTheme } from "./Histogram/chart/prepare/createChart/createChart";

export const createSciChartSurfaceForElem = async (elem: HTMLDivElement): Promise<TWebAssemblyChart | null> => {
  setSciChartKey();
  return await SciChartSurface.create(elem, {
    theme: CustomTheme,
    padding: { left: 0, top: 0, right: 0, bottom: 0 },
    viewportBorder: { border: 0 },
    canvasBorder: { border: 0 },
    disableAspect: true
  });
};

export const createSciChartSurface3DForElem = async (elem: HTMLDivElement): Promise<TWebAssemblyChart3D | null> => {
  setSciChart3DKey();
  const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.createSingle(elem, {
    theme: CustomTheme,
    disableAspect: true
  });
  sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "" });
  sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "" });
  sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "" });
  return { sciChart3DSurface, wasmContext };
};
