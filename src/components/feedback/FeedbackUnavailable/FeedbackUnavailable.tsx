import { memo } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { appLabels } from "src/consts/labels";
import FeedbackTellusMore from "../FeedbackTellUsMore/FeedbackTellUsMore";
import networkConnectionFailureImage from "./network-connection-failure.png";
import useTheme from "@mui/material/styles/useTheme";

const labels = appLabels.Feedback;

const FeedbackUnavailable = memo(({ testidPrefix }: { testidPrefix: string }) => {
  const theme = useTheme().palette.feedback;

  return (
    <Stack data-testid={`${testidPrefix}-unavailable`} padding={3}>
      <Typography variant="h6" color={theme.titleText} data-testid={`${testidPrefix}-unavailable-text`}>
        {labels.unavailableText}
      </Typography>
      <Stack display="flex" justifyContent="" alignItems="center" padding={2} marginBottom={2}>
        <img src={networkConnectionFailureImage} alt="Network Connection Failure Image" />
        <Typography
          variant="body1"
          color={theme.unavailableImageLabel}
          data-testid={`${testidPrefix}-unavailable-image-label`}
          fontWeight={700}
        >
          {labels.networkConnectionFailureLabel}
        </Typography>
      </Stack>
      <FeedbackTellusMore testidPrefix={testidPrefix} showLink={false} />
    </Stack>
  );
});

FeedbackUnavailable.displayName = "FeedbackUnavailable" as const;

export default FeedbackUnavailable;
