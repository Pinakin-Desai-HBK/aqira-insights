import { memo, useContext, useEffect, useState } from "react";
import { DialogContext } from "./context/DialogContext";
import { createDialog } from "./utils/createDialog";
import { JSX } from "react";

export const StatusDialogRenderer = memo(() => {
  const { statusDialogDetails } = useContext(DialogContext);
  const [component, setComponent] = useState<JSX.Element | null>(null);
  useEffect(() => {
    setComponent(statusDialogDetails ? createDialog(statusDialogDetails.name, statusDialogDetails.props) : null);
  }, [statusDialogDetails]);
  return component ?? null;
});
StatusDialogRenderer.displayName = "StatusDialogRenderer";
