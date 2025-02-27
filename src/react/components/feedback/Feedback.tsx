import { memo } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { appLabels } from "src/react/consts/labels";
import FeedbackCategories from "./FeedbackCategories/FeedbackCategories";
import FeedbackRatings from "./FeedbackRatings/FeedbackRatings";
import { FeedbackProps } from "src/react/redux/types/ui/feedback";
import FeedbackTellusMore from "./FeedbackTellUsMore/FeedbackTellUsMore";
import useTheme from "@mui/material/styles/useTheme";

const labels = appLabels.Feedback;

const Feedback = memo(
  ({
    categories,
    ratings,
    selectedRating,
    testidPrefix,
    setSelectedRating,
    toggleCategorySelection
  }: FeedbackProps) => {
    const theme = useTheme().palette.feedback;

    return (
      <Stack data-testid={testidPrefix} padding={3}>
        <Typography variant="h5" color={theme.titleText} data-testid={`${testidPrefix}-main-title`}>
          {labels.mainTitle}
        </Typography>
        <Typography
          variant="subtitle1"
          color={theme.subtitleText}
          marginBottom={1}
          data-testid={`${testidPrefix}-main-subtitle`}
        >
          {labels.mainSubtitle}
        </Typography>
        <Divider />
        <FeedbackRatings
          ratings={ratings}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          testIdPrefix={testidPrefix}
        />
        <FeedbackCategories
          categories={categories}
          testIdPrefix={testidPrefix}
          toggleCategorySelection={toggleCategorySelection}
        />
        <FeedbackTellusMore testidPrefix={testidPrefix} showLink={true} />
      </Stack>
    );
  }
);

Feedback.displayName = "Feedback" as const;

export default Feedback;
