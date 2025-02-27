import { HistogramContext } from "./context/HistogramContext";
import { useHistogramContext } from "./context/hooks/useHistogramContext/useHistogramContext";
import { RenderHistogram } from "./RenderHistogram";

export const Histogram = () => (
  <HistogramContext.Provider value={useHistogramContext()}>
    <RenderHistogram />
  </HistogramContext.Provider>
);
