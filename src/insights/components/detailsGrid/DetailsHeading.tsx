import { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

export const DetailsHeading = ({ heading, sx }: { heading: string; sx?: SxProps }) => (
  <Typography
    sx={{
      color: "#28918D",
      fontSize: "12px",
      padding: "5px",
      ...sx
    }}
  >
    {heading}
  </Typography>
);
