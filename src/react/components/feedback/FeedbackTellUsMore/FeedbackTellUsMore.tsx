import { memo } from "react";
import Typography from "@mui/material/Typography";
import { appLabels } from "src/react/consts/labels";
import useTheme from "@mui/material/styles/useTheme";

const labels = appLabels.Feedback;

const FeedbackTellusMore = memo(({ testidPrefix, showLink }: { testidPrefix: string; showLink: boolean }) => {
  const theme = useTheme().palette.feedback;

  return (
    <Typography variant="subtitle1" color={theme.subtitleText} data-testid={`${testidPrefix}-tell-us-more`}>
      {`${labels.tellUsMoreText}${showLink ? " " : "."}`}
      {showLink && (
        <>
          {labels.orConnectToOur}
          <a href="https://www.hbkworld.com/en/services-support/support" target="_blank" rel="noopener noreferrer">
            {" "}
            {labels.supportWebsite}
          </a>
        </>
      )}
    </Typography>
  );
});

FeedbackTellusMore.displayName = "FeedbackTellusMore" as const;

export default FeedbackTellusMore;
