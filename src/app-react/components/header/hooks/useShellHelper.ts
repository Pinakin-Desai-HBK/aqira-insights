import { useCallback, useEffect, useMemo, useState } from "react";
import usePopoutManager from "src/popout-manager/usePopoutManager";
import { useProjectIO } from "./useProjectIO";
import { sendWebMessage } from "../../../helpers/wpf/wpf";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { WebMessageResponse } from "src/redux/types/redux/webMessage";
import { uiWebMessage_setWebMessageResponse } from "src/redux/slices/ui/webMessage/webMessageSlice";
import { GetShellHelper, SetShellHelper, ShellHelper } from "src/redux/types/ui/shellHelper";
import { popoutDetails } from "src/popoutDetails";
import { make_selectStore_UI_Project_ForShellHelper } from "src/redux/slices/ui/project/combinedSelectors";

declare global {
  interface Window {
    getShellHelper: GetShellHelper;
    setShellHelper: SetShellHelper;
  }
}

(() => {
  let appShellHelper: ShellHelper | null = null;
  window.getShellHelper = () => appShellHelper;
  window.setShellHelper = (shellHelper) => (appShellHelper = shellHelper);
})();

const getShellHelper = (isPopout: boolean): ShellHelper => {
  if (window.getShellHelper() === null && isPopout) {
    window.setShellHelper(window.opener.getShellHelper());
  }
  if (window.getShellHelper() !== null) {
    return window.getShellHelper() as unknown as ShellHelper;
  }

  const shellHelper: ShellHelper = {
    handlers: {
      onShellClose: null,
      onFileOrFolderAction: null
    },
    handleShellClose: () => {
      if (shellHelper.handlers.onShellClose) {
        shellHelper.handlers.onShellClose();
      }
    },
    handleFileOrFolderAction: (WebMessageResponse: WebMessageResponse) => {
      if (shellHelper.handlers.onFileOrFolderAction) {
        shellHelper.handlers.onFileOrFolderAction(WebMessageResponse);
      }
    },
    setHandlers: (handlers, isPopout) => {
      if (!isPopout) shellHelper.handlers = handlers;
    }
  };
  window.setShellHelper(shellHelper);
  return shellHelper;
};

const useShellHelper = () => {
  const { isPopout, popoutId } = popoutDetails;
  const projectSelector = useMemo(make_selectStore_UI_Project_ForShellHelper, []);
  const { isDirty, workspaces } = useAppSelector(projectSelector);
  const { closeAllPopouts } = usePopoutManager();
  const { handleConfirmUnsaved } = useProjectIO(false);
  const [shellHelper] = useState(() => getShellHelper(isPopout));
  const appDispatch = useAppDispatch();

  const shouldExit = useCallback(async (): Promise<boolean> => {
    let proceed: boolean | null = null;
    if (isDirty) {
      handleConfirmUnsaved(
        `Confirm Close Application`,
        `Are you sure you wish to continue without saving the current project? Any unsaved changes will be lost.`,
        () => (proceed = true),
        () => (proceed = false)
      );
    } else {
      proceed = true;
    }
    while (proceed === null) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return proceed;
  }, [handleConfirmUnsaved, isDirty]);

  useEffect(() => {
    shellHelper.setHandlers(
      {
        onShellClose: async () => {
          const close = await shouldExit();
          if (close) {
            if (workspaces !== undefined && closeAllPopouts) closeAllPopouts(workspaces.map(({ id }) => id));
            sendWebMessage({ Action: "QuitNoCheck", Origin: "Application", Type: "Application" });
          }
        },
        onFileOrFolderAction: (webMessageResponse: WebMessageResponse) => {
          appDispatch(uiWebMessage_setWebMessageResponse({ webMessageResponse }));
        }
      },
      isPopout
    );
  }, [closeAllPopouts, isPopout, shellHelper, shouldExit, popoutId, workspaces, appDispatch]);
  return shellHelper;
};

export default useShellHelper;
