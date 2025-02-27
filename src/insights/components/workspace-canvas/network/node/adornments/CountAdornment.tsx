import Tooltip from "@mui/material/Tooltip";

export const CountAddornment = ({ value, id, tooltip }: { value: string | number; id: string; tooltip: string }) => {
  return (
    <Tooltip title={tooltip} placement="top">
      <div
        style={{
          fontWeight: "bold",
          fontSize: ".66rem",
          minWidth: "1.5rem",
          position: "absolute",
          top: "-.66rem",
          left: "66%",
          borderRadius: ".5rem",
          backgroundColor: "rgba(0,0,255,0.5)",
          padding: "0px 5px",
          color: "white",
          border: "1px solid #222",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        data-testid={`NodeAdornment-Count${id}`}
        className="NodeAdornment-Count"
      >
        <div style={{ paddingTop: ".0825rem" }}>{value}</div>
      </div>
    </Tooltip>
  );
};
