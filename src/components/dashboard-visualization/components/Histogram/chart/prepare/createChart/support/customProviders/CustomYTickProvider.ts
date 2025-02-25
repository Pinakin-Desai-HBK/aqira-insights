import { LogarithmicTickProvider, NumberRange, TSciChart } from "scichart";
import { filter, filterReverse } from "../../../../../../Shared/chart/prepare/utils/logFilter";

const raiseToNearestPowerOfTen = (value: number) =>
  Math.sign(value) * Math.pow(10, Math.ceil(Math.log10(Math.abs(value))));

const lowerToNearestPowerOfTen = (value: number) =>
  Math.sign(value) * Math.pow(10, Math.floor(Math.log10(Math.abs(value))));

export class CustomYTickProvider extends LogarithmicTickProvider {
  closestToZero: number;

  constructor(wasmContext: TSciChart, closestToZero: number) {
    super(wasmContext);
    this.closestToZero = closestToZero;
  }

  generateTicks(tickIndexes: number[], min: number, max: number): number[] {
    const ticks: number[] = [];
    let current = min;
    while (current <= max) {
      for (const index of tickIndexes) if (current * index <= max) ticks.push(current * index);
      current = raiseToNearestPowerOfTen(current * 9);
    }
    return ticks;
  }

  getTicks(visibleRange: NumberRange, tickIndexes: number[]): number[] {
    const dRange = new NumberRange(
      filterReverse({ y: visibleRange.min, closestToZero: this.closestToZero }),
      filterReverse({ y: visibleRange.max, closestToZero: this.closestToZero })
    );
    const min = Math.min(lowerToNearestPowerOfTen(this.closestToZero), 1);
    const ticks: number[] = [];
    if (dRange.min < 0)
      ticks.push(
        ...this.generateTicks(tickIndexes, min, Math.abs(dRange.min))
          .map((tick) => -tick)
          .reverse()
      );
    ticks.push(0);
    if (dRange.max > 0) ticks.push(...this.generateTicks(tickIndexes, min, dRange.max));
    return ticks;
  }

  override getMinorTicks(minorDelta: number, majorDelta: number, visibleRange: NumberRange): number[] {
    return this.getTicks(visibleRange, [3, 4, 6, 7, 8, 9]).map((tick) =>
      filter({ y: tick, closestToZero: this.closestToZero })
    );
  }

  override getMajorTicks(minorDelta: number, majorDelta: number, visibleRange: NumberRange): number[] {
    return this.getTicks(visibleRange, [1, 2, 5]).map((tick) => filter({ y: tick, closestToZero: this.closestToZero }));
  }

  getMajorTicksUnfiltered(minorDelta: number, majorDelta: number, visibleRange: NumberRange): number[] {
    return this.getTicks(visibleRange, [1, 2, 5]);
  }
}
