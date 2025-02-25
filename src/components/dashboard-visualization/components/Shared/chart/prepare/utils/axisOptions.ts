import { ELabelAlignment, INumericAxisOptions } from "scichart";

export const axisOptions: INumericAxisOptions = {
  drawMajorGridLines: true,
  drawMinorGridLines: false,
  drawMajorBands: false,
  majorGridLineStyle: {
    color: "#DDD",
    strokeThickness: 1
  },
  majorTickLineStyle: {
    color: "#AAA",
    strokeThickness: 1,
    tickSize: 10
  },
  labelStyle: { alignment: ELabelAlignment.Center, fontSize: 12, color: "#444", fontWeight: "bold" },
  backgroundColor: "#FFF",
  axisTitleStyle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444"
  }
};
