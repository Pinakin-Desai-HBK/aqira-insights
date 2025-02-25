import { Box, SxProps, Typography } from "@mui/material";
import { ReactElement } from "react";

type ContentPanelProps = {
  title: string;
  background: string;
  titleColor: string;
  options?: ReactElement | undefined;
  children?: ReactElement | undefined;
  sx?: SxProps;
};

const ContentPanel = ({ title, background, titleColor, options, children, sx }: ContentPanelProps) => (
  <Box
    data-testid={`AI-panel-${title}`}
    className={`AI-panel-${title}`}
    borderRadius={1}
    width={1}
    height={1}
    sx={{ background, ...(sx ? sx : {}) }}
  >
    <Box justifyContent="space-between" alignItems="center" display="flex">
      <Typography
        sx={{
          color: titleColor,
          padding: "8px 16px",
          textAlign: "left",
          fontSize: "0.9rem"
        }}
        fontWeight="bold"
        data-testid={`AI-panel-title-${title}`}
      >
        {title}
      </Typography>
      {options}
    </Box>
    {children}
  </Box>
);

export default ContentPanel;
