import { WebMessageResponse } from "../redux/webMessage";

type ShellHelperHandlers = {
  onShellClose: null | (() => void);
  onFileOrFolderAction: null | ((WebMessageResponse: WebMessageResponse) => void);
};

export type ShellHelper = {
  handlers: ShellHelperHandlers;
  handleShellClose: () => void;
  handleFileOrFolderAction: (WebMessageResponse: WebMessageResponse) => void;
  setHandlers: (handlers: ShellHelperHandlers, isPopout: boolean) => void;
};

export type GetShellHelper = () => ShellHelper | null;

export type SetShellHelper = (shellHelper: ShellHelper) => void;
