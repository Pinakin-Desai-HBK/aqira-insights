import { AboutDialogParams } from "src/insights/redux/types/ui/dialogs";
import AboutPanel from "../../about-dialog/about-dialog/AboutPanel";
import BaseDialog from "../support/BaseDialog";

const AboutDialog = (props: AboutDialogParams) => {
  return (
    <BaseDialog
      contentSx={{ padding: "0", backgroundColor: "#E8E8E8" }}
      messageSx={{ paddingLeft: "0" }}
      testidPrefix="AI-about-dialog"
      {...props}
      close={props.onOk}
      title={props.title}
      buttons={[
        {
          callback: props.onOk,
          label: props.okLabel || "OK",
          disabled: false,
          testidSuffix: "ok-button"
        }
      ]}
    >
      <AboutPanel />
    </BaseDialog>
  );
};
AboutDialog.displayName = "AboutDialog" as const;

export default AboutDialog;
