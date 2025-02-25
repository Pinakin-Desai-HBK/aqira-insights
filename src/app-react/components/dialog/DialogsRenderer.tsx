import { memo, useContext, useEffect, useState } from "react";
import { DialogContext } from "./context/DialogContext";
import { createDialog } from "./utils/createDialog";
import { JSX } from "react";

export const DialogsRenderer = memo(() => {
  const { dialogDetails } = useContext(DialogContext);
  const [component, setComponent] = useState<JSX.Element | null>(null);
  useEffect(() => {
    setComponent(dialogDetails ? createDialog(dialogDetails.name, dialogDetails.props) : null);
  }, [dialogDetails]);
  return component ?? null;
});
DialogsRenderer.displayName = "DialogsRenderer";
