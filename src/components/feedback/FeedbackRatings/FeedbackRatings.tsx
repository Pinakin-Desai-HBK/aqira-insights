import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import FeedbackRatingIcon from "../../icon/FeedbackRatingIcon/FeedbackRatingIcon";
import { useTheme } from "@mui/material";
import { memo } from "react";
import { FeedbackRatingsProps } from "src/redux/types/ui/feedback";

const FeedbackRatings = memo(({ ratings, selectedRating, testIdPrefix, setSelectedRating }: FeedbackRatingsProps) => {
  const theme = useTheme().palette.feedback;

  return (
    <Grid
      container
      columnSpacing={2}
      display="flex"
      justifyContent="center"
      alignItems="center"
      paddingTop={4}
      paddingBottom={4}
    >
      {ratings.map((index) => (
        <IconButton
          key={index}
          sx={{ padding: 0, "&:hover": { background: theme.ratingIconButtonHover } }}
          onClick={() => setSelectedRating(index)}
          data-testid={`${testIdPrefix}-rating-button-${selectedRating === index ? "selected" : "unselected"}-${index}`}
        >
          <FeedbackRatingIcon index={index} selected={selectedRating === index} />
        </IconButton>
      ))}
    </Grid>
  );
});

FeedbackRatings.displayName = "FeedbackRatings";

export default FeedbackRatings;
