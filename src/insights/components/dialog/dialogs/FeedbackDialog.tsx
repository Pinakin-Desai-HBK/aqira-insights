import { FeedbackDialogParams } from "src/insights/redux/types/ui/dialogs";
import BaseDialog from "../support/BaseDialog";
import Feedback from "src/insights/components/feedback/Feedback";
import { useFeedbackDialog } from "../hooks/useFeedbackDialog";
import FeedbackStatus from "src/insights/components/feedback/FeedbackStatus/FeedbackStatus";
import FeedbackUnavailable from "src/insights/components/feedback/FeedbackUnavailable/FeedbackUnavailable";

const TESTID_PREFIX = "AI-feedback";

const FeedbackDialog = (props: FeedbackDialogParams) => {
  const { title } = props;
  const {
    canSendFeedback,
    categories,
    ratings,
    selectedRating,
    submitted,
    submitError,
    submitSuccess,
    closeDialog,
    getButtons,
    setSelectedRating,
    toggleCategorySelection
  } = useFeedbackDialog();

  return (
    <BaseDialog
      contentSx={{ padding: 0 }}
      messageSx={{ paddingLeft: 0 }}
      actionsSx={{ paddingRight: "25px", paddingBottom: "25px", opacity: submitted ? 0 : 1 }}
      testidPrefix="AI-feedback-dialog"
      {...props}
      close={() => closeDialog()}
      title={title}
      buttons={getButtons()}
    >
      <>
        {submitted && (
          <FeedbackStatus
            error={submitError}
            success={submitSuccess}
            testIdPrefix={TESTID_PREFIX}
            closeDialog={closeDialog}
          />
        )}
        {canSendFeedback ? (
          <Feedback
            categories={categories}
            ratings={ratings}
            selectedRating={selectedRating}
            testidPrefix={TESTID_PREFIX}
            setSelectedRating={setSelectedRating}
            toggleCategorySelection={toggleCategorySelection}
          />
        ) : (
          <FeedbackUnavailable testidPrefix={TESTID_PREFIX} />
        )}
      </>
    </BaseDialog>
  );
};

FeedbackDialog.displayName = "FeedbackDialog" as const;

export default FeedbackDialog;
