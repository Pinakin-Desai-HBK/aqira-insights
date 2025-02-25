import { ChartModifierBase2D, EChart2DModifierType, ModifierMouseArgs, SciChartSurface } from "scichart";
import { StoredChartState } from "../../../types";

export class StoreRangeModifier extends ChartModifierBase2D {
  override type: string;
  chartSurface: SciChartSurface;
  setStoredChartState: (params: { newStoredChartState: Partial<StoredChartState> }) => void;

  constructor(
    chartSurface: SciChartSurface,
    setStoredChartState: (params: { newStoredChartState: Partial<StoredChartState> }) => void
  ) {
    super();
    this.type = EChart2DModifierType.Custom;
    this.chartSurface = chartSurface;
    this.setStoredChartState = setStoredChartState;
  }
  override modifierMouseWheel(args: ModifierMouseArgs): void {
    super.modifierMouseWheel(args);
    setTimeout(() => {
      this.setStoredChartState({ newStoredChartState: { range: this.chartSurface.xAxes.get(0).visibleRange } });
    }, 0);
  }
  override modifierMouseUp(args: ModifierMouseArgs) {
    super.modifierMouseUp(args);
    setTimeout(
      () => {
        this.setStoredChartState({ newStoredChartState: { range: this.chartSurface.xAxes.get(0).visibleRange } });
      },
      args.button !== 0 ? 250 : 0
    );
  }
}
