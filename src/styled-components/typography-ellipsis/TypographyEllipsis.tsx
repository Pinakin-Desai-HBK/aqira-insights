import Typography, { TypographyProps } from "@mui/material/Typography";
import { memo } from "react";
import { forwardRef } from "react";

const TypographyEllipses = memo(
  forwardRef<typeof Typography, TypographyProps>((props, ref) => {
    const { children, ...typographyProps } = props;

    return (
      <Typography
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
        {...typographyProps}
        ref={ref as React.Ref<HTMLDivElement>}
      >
        {children}
      </Typography>
    );
  })
);
TypographyEllipses.displayName = "TypographyEllipses";

export default TypographyEllipses;
