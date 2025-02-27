import { NumberRange, NumericTickProvider, TSciChart } from 'scichart';
import { Bin } from '../../../../../types';

export class CustomXTickProvider extends NumericTickProvider {
  private bins: Bin[];
  private tickType: 'center' | 'bounds';
  private width: number;

  constructor(
    wasmContext: TSciChart,
    bins: Bin[],
    tickType: 'center' | 'bounds',
    width: number,
  ) {
    super(wasmContext);
    this.bins = bins;
    this.tickType = tickType;
    this.width = width;
  }

  override getMajorTicks(
    minorDelta: number,
    majorDelta: number,
    visibleRange: NumberRange,
  ): number[] {
    const ticks = this.getMinorTicks();
    let lastX: number | null = null;
    const result: number[] = [];
    const rangeToClient = this.width / (visibleRange.max - visibleRange.min);
    for (let i = 0; i < ticks.length; i++) {
      const tick = ticks[i];
      if (tick !== undefined) {
        const tickX = (tick - visibleRange.min) * rangeToClient;
        if (lastX === null || tickX - lastX > 20) {
          if (tickX > 0 && tickX < this.width) result.push(tick);
          lastX = tickX;
        }
      }
    }
    return result;
  }

  override getMinorTicks(): number[] {
    const lastPoint = this.bins[this.bins.length - 1]!.start;
    const ticks =
      this.tickType === 'bounds'
        ? [
            ...this.bins.slice(0).map((bin) => bin.start),
            ...(lastPoint !== undefined ? [lastPoint] : []),
          ]
        : this.bins.map((bin) => bin.midPoint);
    return ticks;
  }

  protected override calculateTicks(): number[] {
    return this.getMinorTicks();
  }
}
