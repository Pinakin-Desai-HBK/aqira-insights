import { JSX } from "react";
import { formatChartNumber } from "src/react/helpers/format-number/format-number";

export const GradientLegend = ({ min, max, colors }: { min: number; max: number; colors: string[] }) => {
  const legend: JSX.Element[] = [];
  for (let i = colors.length - 2; i >= 0; i--) {
    legend.push(
      <div style={{ display: "flex", flexDirection: "row", height: "5%" }} key={i}>
        <div
          style={{
            width: "30px",
            display: "inline-block",
            marginRight: "5px",
            marginLeft: "5px",
            marginTop: "-.1em",
            border: ".1em solid #000",
            backgroundImage: `linear-gradient( ${colors[i + 1]}, ${colors[i]})`
          }}
        />

        <div
          style={{
            position: "relative",
            top: "-8px",
            color: "black",
            flexGrow: 1,
            backgroundColor: "white"
          }}
        >
          {formatChartNumber(((max - min) / (colors.length - 1)) * (i + 1) + min)}
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
