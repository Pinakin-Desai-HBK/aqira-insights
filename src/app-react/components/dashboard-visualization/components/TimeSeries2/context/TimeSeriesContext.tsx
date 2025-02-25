import { createContext } from "react";
import { TimeSeriesContextData } from "../types";

export const TimeSeriesContext = createContext<TimeSeriesContextData>(null!);
