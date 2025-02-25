import { SciChartOverview } from "scichart";

export const styleOverviewRangeSelection = (overview: SciChartOverview, name: string) => {
  overview.rangeSelectionModifier.rangeSelectionAnnotation.svgString = `<svg width="50" height="50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" style="fill: rgb(142, 238, 195,.5)">
      </rect>
      </svg>`;
  overview.rangeSelectionModifier.rangeSelectionAnnotation.adornerSvgStringTemplate = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    const delta = 3;
    return `<svg xmlns="http://www.w3.org/2000/svg">
        <line x1="${x2 - 3}" y1="${y1 + delta}" x2="${x2 - 3}" y2="${y2 - delta}" stroke="#444" stroke-width="6" stroke-linecap="round" data-testid="${name}-overview-range-right"/>
        <line x1="${x1 + 3}" y1="${y1 + delta}" x2="${x1 + 3}" y2="${y2 - delta}" stroke="#444" stroke-width="6" stroke-linecap="round" data-testid="${name}-overview-range-left"/>
        </svg>`;
  };
};
