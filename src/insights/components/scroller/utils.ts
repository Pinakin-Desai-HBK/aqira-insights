import { RefObject } from "react";
import { IntervalRef } from "src/insights/redux/types/ui/scroller";

export const createEmptyIntervalRef = () => ({ interval: null, dir: null });

export const clearIntervalRef = (intervalRef: RefObject<IntervalRef>) => {
  if (!intervalRef.current.interval) return;
  clearInterval(intervalRef.current.interval);
  intervalRef.current = createEmptyIntervalRef();
};

export const getButtonVisibility = (containerRef: RefObject<HTMLDivElement | null>) => ({
  showLeft: (containerRef.current?.scrollLeft || 0) > 0,
  showRight:
    Math.floor(containerRef.current?.scrollLeft || 0) <
    Math.floor((containerRef.current?.scrollWidth || 0) - (containerRef.current?.offsetWidth || 0))
});
