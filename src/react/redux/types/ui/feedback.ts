export type FeedbackRatingsProps = {
  ratings: number[];
  selectedRating: number | null;
  testIdPrefix: string;
  setSelectedRating: (num: number) => void;
};

export type FeedbackStatusProps = {
  error: boolean;
  success: boolean;
  testIdPrefix: string;
  closeDialog: () => void;
};

export type FeedbackProps = {
  ratings: number[];
  categories: { label: string; value: string; selected?: boolean }[];
  selectedRating: number | null;
  testidPrefix: string;
  setSelectedRating: (num: number) => void;
  toggleCategorySelection: (optionValue: string) => void;
};

export type FeedbackCategoriesProps = {
  categories: { label: string; value: string; selected?: boolean }[];
  testIdPrefix: string;
  toggleCategorySelection: (optionValue: string) => void;
};
