import Button from "@mui/material/Button";
import TypographyEllipses from "../../../styled-components/typography-ellipsis/TypographyEllipsis";
import { DATA_EXPLORER_ROW_HEADER_TEXT_HEIGHT } from "src/react/consts/consts";
import { DataGroupHeaderProps, DataGroupHeaderType } from "src/react/redux/types/ui/dataExplorer";

export const DataGroupHeader: DataGroupHeaderType = ({ isOpen, title, setOpenGroup, testId }: DataGroupHeaderProps) => (
  <Button
    data-testid={testId}
    onClick={() => setOpenGroup()}
    disableRipple={isOpen}
    sx={{
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      height: DATA_EXPLORER_ROW_HEADER_TEXT_HEIGHT,
      "&:hover": { cursor: "pointer", backgroundColor: isOpen ? "#FFF" : "#167170" },
      backgroundColor: isOpen ? "#FFF" : "#1d7978",
      padding: "0 8px",
      flexGrow: 1,
      borderRadius: "4px"
    }}
  >
    <TypographyEllipses fontSize="small" color={isOpen ? "rgb(122, 122, 122)" : "text.secondary"}>
      {title}
    </TypographyEllipses>
  </Button>
);
