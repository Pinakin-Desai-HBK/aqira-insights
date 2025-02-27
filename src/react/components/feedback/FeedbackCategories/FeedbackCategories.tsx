import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import useTheme from "@mui/material/styles/useTheme";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import { appLabels } from "src/react/consts/labels";
import { FeedbackCategoriesProps } from "src/react/redux/types/ui/feedback";

const labels = appLabels.Feedback;

const FeedbackCategories = memo(({ categories, testIdPrefix, toggleCategorySelection }: FeedbackCategoriesProps) => {
  const theme = useTheme().palette.feedback;

  return (
    <>
      <Typography variant="h6" color={theme.titleText} data-testid={`${testIdPrefix}-categories-title`}>
        {labels.categoriesTitle}
      </Typography>
      <Typography
        variant="subtitle1"
        color={theme.subtitleText}
        marginBottom={2}
        data-testid={`${testIdPrefix}-categories-subtitle`}
      >
        {labels.categoriesSubtitle}
      </Typography>

      <Grid container columnSpacing={3} rowSpacing={2} marginBottom={4}>
        {categories.map((category) => (
          <Button
            key={category.value}
            sx={{
              background: category.selected
                ? theme.categoryButtonBackgroundSelected
                : theme.categoryButtonBackgroundUnselected,
              color: category.selected ? theme.categoryButtonTextSelected : theme.categoryButtonTextUnselected,
              fontSize: "small",
              padding: "8px 32px"
            }}
            onClick={() => toggleCategorySelection(category.value)}
            data-testid={`${testIdPrefix}-category-button-${category.selected ? "selected" : "unselected"}-${category.value}`}
          >
            {category.label}
          </Button>
        ))}
      </Grid>
    </>
  );
});

FeedbackCategories.displayName = "FeedbackCategories";

export default FeedbackCategories;
