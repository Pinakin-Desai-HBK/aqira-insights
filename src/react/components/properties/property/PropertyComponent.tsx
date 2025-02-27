import Stack from "@mui/material/Stack";
import TypographyEllipses from "../../../styled-components/typography-ellipsis/TypographyEllipsis";
import PropertyMenu from "./menu/PropertyMenu";
import { useMemo } from "react";
import { PropertyComponentProps } from "src/react/redux/types/ui/properties";
import { SxProps, Theme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";

const getSx = (theme: Theme): SxProps<Theme> => {
  const childrenStyle = {
    padding: "5px 8px",
    fontSize: "12px",
    color: theme.palette.properties.text,
    background: theme.palette.properties.input,
    border: theme.palette.properties.border,
    lineHeight: "18px",
    overflow: "hidden",
    paddingRight: "5px",
    alignItems: "flex-start"
  };
  return {
    "& input": childrenStyle,
    "& .MuiSelect-select": {
      ...childrenStyle
    }
  };
};

const PropertyComponent = (params: PropertyComponentProps) => {
  const { children, propertyFieldProps } = params;
  const theme = useTheme();
  const sx = useMemo(() => getSx(theme), [theme]);
  const showMenu =
    propertyFieldProps !== null && propertyFieldProps.supportsExpression && propertyFieldProps.type !== "Python";
  return (
    <Stack width={1} direction="row" spacing={0} sx={{ padding: "4px 8px" }} justifyContent="flex-end">
      <Tooltip
        title={propertyFieldProps.description}
        placement="top-end"
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, -10]
                }
              }
            ]
          }
        }}
      >
        <TypographyEllipses
          color={theme.palette.properties.text}
          textAlign="start"
          width={"420px"}
          fontSize="12px"
          padding="5px 0px"
          data-testid={`AI-property-label-${propertyFieldProps.name}`}
        >
          {propertyFieldProps.name}
        </TypographyEllipses>
      </Tooltip>
      <Box
        width={1}
        sx={sx}
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-start"
        data-testid={`AI-property-value-${propertyFieldProps.name}`}
      >
        {children}
        {showMenu && <PropertyMenu {...params} />}
      </Box>
    </Stack>
  );
};

export default PropertyComponent;
