import styled from "@mui/material/styles/styled";

const PaletteGroupIcon = styled("div")(({ color }) => ({
  width: "25px",
  height: "25px",
  display: "inline-block",
  background: color,
  border: "2px solid #00457b",
  borderRadius: "4px"
}));

export default PaletteGroupIcon;
