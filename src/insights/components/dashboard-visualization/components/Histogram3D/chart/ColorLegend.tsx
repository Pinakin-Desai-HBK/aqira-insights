import { formatChartNumber } from "src/insights/helpers/format-number/format-number";

export const ColorLegend = ({ min, max, colors }: { min: number; max: number; colors: string[] }) => {
  const legend = [];
  for (let i = colors.length - 1; i >= 0; i--) {
    legend.push(
      <div style={{ display: "flex", flexDirection: "row", height: "5%" }} key={i}>
        <div
          style={{
            backgroundColor: colors[i],

            width: "30px",
            display: "inline-block",
            marginRight: "5px",
            marginLeft: "5px",
            marginTop: "-.1em",
            border: ".1em solid #000"
          }}
        ></div>
        <div style={{ position: "relative", top: "-8px", color: "black", flexGrow: 1, backgroundColor: "white" }}>
          {formatChartNumber(((max - min) / colors.length) * (i + 1) + min)}
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        fontSize: "12px",
        color: "#AAA",
        height: "100%"
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            height: "5%",
            width: "30px",
            display: "inline-block",
            marginRight: "5px",
            marginLeft: "5px"
          }}
        ></div>
        <div style={{ position: "relative", top: "-8px", color: "black", visibility: "hidden" }}>
          {formatChartNumber(max)}
        </div>
      </div>
      {legend}
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            height: "5%",
            width: "30px",
            display: "inline-block",
            marginRight: "5px",
            marginLeft: "5px"
          }}
        ></div>
        <div style={{ position: "relative", top: "-8px", color: "black" }}>{formatChartNumber(min)}</div>
      </div>
    </div>
  );
};
