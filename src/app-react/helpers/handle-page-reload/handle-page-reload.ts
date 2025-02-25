import { sendWebMessage } from "../wpf/wpf";

export const handlePageReload = () => {
  // https://stackoverflow.com/a/74220204/782358
  const navigationType = (window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).type;

  if (navigationType === "reload") {
    sendWebMessage({ Action: "Reload", Origin: "Application", Type: "Application" });
  }
};
