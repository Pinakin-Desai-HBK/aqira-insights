import { useCallback, useContext, useEffect, useState } from "react";
import { BaseDialogButtonParams } from "src/redux/types/ui/dialogs";
import { DialogContext } from "../context/DialogContext";
import { useFeedbackMutation, useGetApplicationAnalyticsQuery } from "src/redux/api/appApi";

export const useFeedbackDialog = (): {
  canSendFeedback: boolean;
  ratings: number[];
  selectedRating: number | null;
  submitted: boolean;
  submitError: boolean;
  submitSuccess: boolean;
  categories: { label: string; value: string; selected?: boolean }[];
  closeDialog: () => void;
  getButtons: () => BaseDialogButtonParams[];
  setSelectedRating: (num: number) => void;
  submit: () => void;
  toggleCategorySelection: (categoryValue: string) => void;
} => {
  const ratings = [1, 2, 3, 4, 5];
  const { closeDialog } = useContext(DialogContext);
  const { data } = useGetApplicationAnalyticsQuery();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [submitted, setSubmmited] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [categories, setCategories] = useState<{ label: string; value: string; selected?: boolean }[]>([]);
  const [canSendFeedback, setCanSendFeedback] = useState(true);
  const [feedback] = useFeedbackMutation();

  const submit = useCallback(async () => {
    setSubmmited(true);
    try {
      await feedback({
        payload: {
          feedbackRating: selectedRating!,
          improvementOptions: categories.filter((category) => category.selected).map((category) => category.value)
        }
      });
      setSubmitSuccess(true);
    } catch {
      setSubmitError(true);
    }
  }, [setSubmitSuccess, setSubmmited, selectedRating, categories, feedback]);

  const toggleCategorySelection = useCallback(
    (categoryValue: string) => {
      console.log("categoryValue", categoryValue);
      setCategories(
        categories.map((category) => {
          if (category.value === categoryValue) {
            return { ...category, selected: !category.selected };
          }
          return category;
        })
      );
    },
    [categories]
  );

  const getButtons = useCallback((): BaseDialogButtonParams[] => {
    return [
      {
        callback: () => closeDialog(),
        label: "Cancel",
        disabled: false,
        testidSuffix: "cancel-button"
      },
      {
        callback: () => submit(),
        label: "Submit",
        disabled: !canSubmit || submitted,
        testidSuffix: "submit-button"
      }
    ];
  }, [canSubmit, closeDialog, submit, submitted]);

  useEffect(() => {
    setCanSubmit(selectedRating !== null);
  }, [selectedRating]);

  useEffect(() => {
    if (data) {
      if (!data.canConnectToElasticsearch) {
        setCanSendFeedback(false);
      } else if (data.feedbackCategories?.categories) {
        setCategories(data.feedbackCategories.categories);
      }
    }
  }, [data]);

  return {
    canSendFeedback,
    ratings,
    selectedRating,
    submitted,
    submitError,
    submitSuccess,
    categories,
    closeDialog,
    getButtons,
    setSelectedRating,
    submit,
    toggleCategorySelection
  };
};
