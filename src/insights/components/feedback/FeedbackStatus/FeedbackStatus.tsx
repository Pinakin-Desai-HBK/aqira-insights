import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import { appLabels } from "src/insights/consts/labels";
import fireworksImage from "./fireworks.gif";
import { FeedbackStatusProps } from "src/insights/redux/types/ui/feedback";
import useTheme from "@mui/material/styles/useTheme";

const labels = appLabels.FeedbackStatus;

const FeedbackStatus = memo(({ error, success, testIdPrefix, closeDialog }: FeedbackStatusProps) => {
  const theme = useTheme().palette.feedback;

  return (
    <Stack
      data-testid="AI-feedback-success"
      padding={3}
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        position: "absolute",
        zIndex: 1,
        width: "100%",
        height: "calc(100% - 130px)",
        left: 0,
        top: "10%",
        background: "white"
      }}
    >
      <Stack display="flex" justifyContent="center" alignItems="center">
        {success || error ? (
          <>
            <Typography variant="h3" color={theme.titleText} data-testid={`${testIdPrefix}-status-title`}>
              {success ? labels.successTitle : labels.errorTitle}
            </Typography>
            <Typography variant="h5" color={theme.subtitleText} data-testid={`${testIdPrefix}-status-subtitle`}>
              {success ? labels.successSubtitle : labels.errorSubtitle}
            </Typography>
            <Button
              color="primary"
              variant="contained"
              sx={{ width: "150px", height: "50px", fontSize: "28px", marginTop: "80px" }}
              onClick={() => closeDialog()}
            >
              {labels.doneButtonLabel}
            </Button>
            {success && (
              <img
                src={fireworksImage}
                alt="Feedback Success"
                style={{ position: "absolute", width: "450px", zIndex: -1, top: "36px", opacity: 0.3 }}
              />
            )}
          </>
        ) : (
          <Typography variant="h5" color={theme.titleText}>
            {labels.submittingText}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
});

FeedbackStatus.displayName = "FeedbackStatus" as const;

export default FeedbackStatus;
