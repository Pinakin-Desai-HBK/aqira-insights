import { useTimeSeriesContext } from "./context/hooks/useTimeSeriesContext";
import { TimeSeriesContext } from "./context/TimeSeriesContext";
import { RenderTimeSeries } from "./RenderTimeSeries";
import { TimeSeriesContextData } from "./types";

export const TimeSeries2 = () => {
  const contextData: TimeSeriesContextData = useTimeSeriesContext();
  return (
    <TimeSeriesContext.Provider value={contextData}>
      <RenderTimeSeries />
    </TimeSeriesContext.Provider>
  );
};
