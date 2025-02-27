import { createContext } from "react";
import { HistogramContextData } from "../types";

export const HistogramContext = createContext<HistogramContextData>(null!);
