import { HistogramContext } from "./context/HistogramContext";
import { useHistogramContext } from "./context/hooks/useHistogramContext/useHistogramContext";
import { RenderHistogram3D } from "./RenderHistogram3D";

export const Histogram3D = () => (
  <HistogramContext.Provider value={useHistogramContext()}>
    <RenderHistogram3D />
  </HistogramContext.Provider>
);
