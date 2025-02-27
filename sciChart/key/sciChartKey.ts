import { DpiHelper, SciChart3DSurface, SciChartDefaults, SciChartSurface } from "scichart";
import { getSciChartsLicenseUrl } from "src/react/helpers/get-url/get-url";
import { environment } from "../../src/environments/environment.development";

DpiHelper.IsDpiScaleEnabled = false;
SciChartSurface.AntiAliasWebGlBackbuffer = false;
SciChartDefaults.useNativeText = false;

export const setSciChartKey = () => {
  const licenseKey =  environment.VITE_SCI_CHART_KEY ?? '';
  if (!environment.DEV)
    SciChartSurface.setServerLicenseEndpoint(`/${getSciChartsLicenseUrl()}`);
  SciChartSurface.setRuntimeLicenseKey(licenseKey);
}

export const setSciChart3DKey = () => {
  const licenseKey =  environment.VITE_SCI_CHART_KEY ?? '';
  if (!environment.DEV)
    SciChart3DSurface.setServerLicenseEndpoint(`/${getSciChartsLicenseUrl()}`);
  SciChart3DSurface.setRuntimeLicenseKey(licenseKey);
}