import { LandingPageItemTheme } from "../../../redux/types/ui/themes";
import { Box } from "@mui/material";

const LandingPageItem = ({
  text,
  className,
  description,
  action,
  iconSource,
  theme,
  subTextColour
}: {
  action: () => void;
  iconSource: string;
  text: string;
  className: string;
  description: string[];
  theme: LandingPageItemTheme;
  subTextColour: string;
}) => {
  return (
    <Box
      className={`LandingPageItem ${className}`}
      data-testid={`LandingPage-Create-${className}`}
      onClick={() => action()}
      sx={{
        border: `8px solid ${theme.border}`,
        background: theme.background,
        "&:hover": {
          border: `8px solid ${theme.hover.border}`,
          background: theme.hover.background
        }
      }}
    >
      <img src={iconSource} />
      <div className={"MainText"} style={{ color: theme.text }}>
        {text}
      </div>
      <div className={"SubText"} style={{ color: subTextColour }}>
        {description.map((description, i) => (
          <div key={i}>{description}</div>
        ))}
      </div>
    </Box>
  );
};

export default LandingPageItem;
