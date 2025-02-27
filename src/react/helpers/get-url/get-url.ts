const RootURL = import.meta.env.DEV ? "http://localhost:5042" : "";

export const getApiUrl = (endpoint: string): string => {
  return `${RootURL}/api/v1/${endpoint}`;
};

export const getSignalRUrl = (): string => {
  return `${RootURL}/notifications`;
};

const SciChartRootURL = import.meta.env.DEV ? "http://localhost:5042" : window.location.origin;

export const getSciChartsLicenseUrl = (): string => {
  const url = `${SciChartRootURL}/api/v1/${"ValidateSciChartsLicense"}`;
  return url.replace(/^https?:\/\//, "");
};
