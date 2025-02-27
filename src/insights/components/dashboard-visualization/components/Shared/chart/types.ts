import { Histogram3DKey, HistogramKey, TableKey } from "src/insights/redux/types/schemas/dashboardVisualizations";

export type MarksData = { marks: { value: number; label: string }[]; min: number; max: number };

export type IndexSelectionDetails = {
  marksData?: MarksData;
  maxWidth?: number;
};

export type IndexSelectionParams = {
  marksData?: MarksData;
  visType: Histogram3DKey | HistogramKey | TableKey;
  setSelectedIndex: (selectedIndex: number) => void;
  selectedIndex: number | null;
  indexes: Float64Array;
};
