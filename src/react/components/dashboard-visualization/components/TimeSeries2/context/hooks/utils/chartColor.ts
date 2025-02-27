import { CURRENT_TIME_SERIES_COLORS } from "src/react/consts/consts";

export const chartColor = (index: number) => CURRENT_TIME_SERIES_COLORS[index % CURRENT_TIME_SERIES_COLORS.length];
