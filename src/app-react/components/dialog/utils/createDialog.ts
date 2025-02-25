import { createElement } from "react";
import { DialogComponentList, OpenDialogHandlerType } from "src/redux/types/ui/dialogs";
import { JSX } from "react";

export const createDialog: OpenDialogHandlerType<(typeof DialogComponentList)[number]> = (
  name,
  params
): JSX.Element | null => {
  const component = DialogComponentList.find((component) => component.displayName === name);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return component ? createElement(component as any, params) : null;
};
