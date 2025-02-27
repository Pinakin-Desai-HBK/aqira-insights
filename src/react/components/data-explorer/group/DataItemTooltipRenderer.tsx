import { useCallback, useEffect, useState } from "react";
import NoMaxWidthTooltip from "src/react/styled-components/no-max-width-tooltip/NoMaxWidthTooltip";
import { JSX } from "react";

export const DataItemTooltipRenderer = ({
  children,
  dragging,
  testId,
  createTooltipContent
}: {
  children: JSX.Element;
  dragging: boolean;
  testId: string;
  createTooltipContent: (props: { closeTooltip: () => void }) => JSX.Element | null;
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const closeTooltip = useCallback(() => {
    setTooltipOpen(false);
  }, []);
  useEffect(() => {
    if (dragging) {
      setTooltipOpen(false);
    }
  }, [dragging]);
  return (
    <NoMaxWidthTooltip
      arrow={true}
      sx={{
        "& .MuiTooltip-arrow": { color: "#F6F6F6" },
        "& .MuiTooltip-arrow::before": { border: "1px solid #C2C5CB" },
        "& > div": { border: "1px solid #C2C5CB" },
        "& .MuiTooltip-tooltip": {
          backgroundColor: "#FFF",
          padding: "0px"
        }
      }}
      open={!dragging && tooltipOpen}
      onOpen={() => setTooltipOpen(true)}
      onClose={() => setTooltipOpen(false)}
      title={<div data-testid={`${testId}-tooltip`}>{createTooltipContent({ closeTooltip })}</div>}
      PopperProps={{
        modifiers: [
          {
            name: "preventOverflow",
            enabled: true
          },
          {
            name: "flip",
            enabled: false
          }
        ]
      }}
      placement="right"
    >
      {children}
    </NoMaxWidthTooltip>
  );
};
