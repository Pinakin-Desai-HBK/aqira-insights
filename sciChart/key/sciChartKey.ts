import { DpiHelper, SciChart3DSurface, SciChartDefaults, SciChartSurface } from "scichart";
import { getSciChartsLicenseUrl } from "src/helpers/get-url/get-url";

DpiHelper.IsDpiScaleEnabled = false;
SciChartSurface.AntiAliasWebGlBackbuffer = false;
SciChartDefaults.useNativeText = false;

export const setSciChartKey = () => {
  const licenseKey =  import.meta.env.VITE_SCI_CHART_KEY ?? '';
  if (!import.meta.env.DEV)
    SciChartSurface.setServerLicenseEndpoint(`/${getSciChartsLicenseUrl()}`);
  SciChartSurface.setRuntimeLicenseKey(licenseKey);
}

export const setSciChart3DKey = () => {
  const licenseKey =  import.meta.env.VITE_SCI_CHART_KEY ?? '';
  if (!import.meta.env.DEV)
    SciChart3DSurface.setServerLicenseEndpoint(`/${getSciChartsLicenseUrl()}`);
  SciChart3DSurface.setRuntimeLicenseKey(licenseKey);
}