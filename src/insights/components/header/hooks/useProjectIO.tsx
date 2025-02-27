import { useCallback, useContext, useEffect } from "react";
import { DialogContext } from "../../dialog/context/DialogContext";
import { ensureProjectFileExtension } from "../utils/ensure-project-file-extension";
import { shouldUseWindowsFileBrowser, sendWebMessage } from "../../../helpers/wpf/wpf";
import { uiApp_setStatusMessage } from "../../../redux/slices/ui/app/uiAppSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import {
  useClearLogMessagesMutation,
  useExportAsPythonMutation,
  useLoadProjectMutation,
  useSaveProjectMutation
} from "src/insights/redux/api/appApi";
import usePopoutManager from "src/insights/popout-manager/usePopoutManager";
import { ensurePythonFileExtension } from "../utils/ensure-python-file-extension";
import {
  selectStore_UI_WebMessage,
  uiWebMessage_setWebMessageResponse
} from "src/insights/redux/slices/ui/webMessage/webMessageSlice";
import { WebMessageResponse } from "src/insights/redux/types/redux/webMessage";
import { FileBrowserAction, FileSystemContentFileFilter } from "src/insights/redux/types/ui/fileBrowser";
import { selectStore_UI_Project_WorkspaceList } from "src/insights/redux/slices/ui/project/projectSlice";
import { uiToast_add } from "src/insights/redux/slices/ui/toast/toastSlice";
import { ToastErrorContent, ToastSuccessContent } from "src/insights/components/toast/ToastContent";
import { appLabels } from "src/insights/consts/labels";

const labels = appLabels.useProjectIO;

export const useProjectIO = (subscribe: boolean) => {
  const { openDialog, closeDialog } = useContext(DialogContext);
  const { closeAllPopouts } = usePopoutManager();
  const workspaces = useAppSelector(selectStore_UI_Project_WorkspaceList);
  const [clearLogMessagesMutation] = useClearLogMessagesMutation();
  const appDispatch = useAppDispatch();
  const [exportNetworkAsPython] = useExportAsPythonMutation();
  const { webMessageResponse } = useAppSelector(selectStore_UI_WebMessage);

  const exportAsPython = useCallback(
    async (networkId: string, exportPath: string) => {
      appDispatch(
        uiApp_setStatusMessage({
          statusMessageParams: {
            title: labels.exportForAqira,
            message: labels.exportingProjectForAqira,
            targetWorkspaceId: networkId,
            showInMain: true
          }
        })
      );
      try {
        const result = await exportNetworkAsPython({
          exportPath: ensurePythonFileExtension(exportPath),
          networkId,
          overwrite: true
        });
        if (result.error) throw result.error;
        setTimeout(() => {
          appDispatch(
            uiApp_setStatusMessage({
              statusMessageParams: null
            })
          );
          appDispatch(
            uiToast_add({
              content: {
                title: labels.exportForAqiraSuccessful,
                message: labels.networkExportedForAqiraSuccessfully,
                ...ToastSuccessContent
              }
            })
          );
        }, 1000);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setTimeout(() => {
          appDispatch(
            uiApp_setStatusMessage({
              statusMessageParams: null
            })
          );
          appDispatch(
            uiToast_add({
              content: {
                title: labels.exportForAqiraFailed,
                message: labels.networkExportForAqiraUnsuccessful,
                ...ToastErrorContent
              }
            })
          );
          if ("type" in e && e.type === "api_error") {
            openDialog({
              name: "ErrorMessageDialog",
              props: {
                onOk: () => {
                  closeDialog();
                },
                title: labels.errorExportingForAqira,
                message: labels.thereWasAnErrorExportingTheProjectForAqira,
                error: e
              }
            });
          }
        }, 1000);
      }
    },
    [appDispatch, closeDialog, exportNetworkAsPython, openDialog]
  );

  const [loadProject] = useLoadProjectMutation();
  const openProject = useCallback(
    async (path: string) => {
      appDispatch(
        uiApp_setStatusMessage({
          statusMessageParams: {
            title: labels.openProject_StatusTitle,
            message: labels.openProject_StatusMessage
          }
        })
      );
      try {
        clearLogMessagesMutation();
        const result = await loadProject({ filepath: path });
        if (result.error) throw result.error;
        if (workspaces && closeAllPopouts) closeAllPopouts(workspaces.map(({ id }) => id));
        setTimeout(() => {
          appDispatch(
            uiApp_setStatusMessage({
              statusMessageParams: null
            })
          );
        }, 1000);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setTimeout(() => {
          appDispatch(
            uiApp_setStatusMessage({
              statusMessageParams: null
            })
          );
          if ("type" in e && e.type === "api_error") {
            openDialog({
              name: "ErrorMessageDialog",
              props: {
                onOk: () => {
                  closeDialog();
                },
                title: labels.errorOpeningProject,
                message: labels.thereWasAnErrorOpeningTheSpecifiedProject,
                error: e
              }
            });
          }
        }, 1000);
      }
    },
    [appDispatch, closeDialog, clearLogMessagesMutation, closeAllPopouts, loadProject, openDialog, workspaces]
  );

  const handleOpen = useCallback(() => {
    if (shouldUseWindowsFileBrowser()) {
      sendWebMessage({
        Type: "File",
        Action: "OpenFile",
        Origin: "Project",
        Filter: "apj",
        FilterLabel: labels.advantageInsightsProject
      });
    } else {
      openDialog({
        name: "FileDialog",
        props: {
          title: labels.openProject,
          message: labels.pleaseSelectAProjectToOpen,
          onCancel: () => closeDialog(),
          onOk: (filepath: string) => {
            closeDialog();
            openProject(filepath);
          },
          action: FileBrowserAction.OpenFile,
          confirmButtonText: labels.open,
          nameInputLabel: labels.projectName,
          contentFileFilter: FileSystemContentFileFilter.Project
        }
      });
    }
  }, [closeDialog, openProject, openDialog]);

  const [saveProject] = useSaveProjectMutation();
  const handleSave = useCallback(
    async (filepath: string) => {
      appDispatch(
        uiApp_setStatusMessage({
          statusMessageParams: {
            title: labels.saveProject,
            message: labels.savingProject
          }
        })
      );
      try {
        const result = await saveProject({ filepath });
        if (result.error) throw result.error;
        setTimeout(() => {
          appDispatch(
            uiApp_setStatusMessage({
              statusMessageParams: null
            })
          );
        }, 1000);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setTimeout(() => {
          appDispatch(
            uiApp_setStatusMessage({
              statusMessageParams: null
            })
          );
          if ("type" in e && e.type === "api_error") {
            openDialog({
              name: "ErrorMessageDialog",
              props: {
                onOk: () => {
                  closeDialog();
                },
                title: labels.errorSavingProject,
                message: labels.thereWasAnErrorSavingTheProject,
                error: e
              }
            });
          }
        }, 1000);
      }
    },
    [appDispatch, closeDialog, saveProject, openDialog]
  );

  const handleSaveAs = useCallback(() => {
    if (shouldUseWindowsFileBrowser()) {
      sendWebMessage({
        Type: "File",
        Action: "SaveFile",
        Origin: "Project",
        Filter: "apj",
        FilterLabel: labels.advantageInsightsProject_Save
      });
    } else {
      openDialog({
        name: "FileDialog",
        props: {
          title: labels.saveProjectAs,
          message: labels.pleaseSpecifyAProjectFileNameToSaveTo,
          onCancel: () => closeDialog(),
          onOk: (filepath: string) => {
            closeDialog();
            handleSave(ensureProjectFileExtension(filepath));
          },
          action: FileBrowserAction.SaveFile,
          confirmButtonText: labels.save,
          nameInputLabel: labels.projectName_Save,
          contentFileFilter: FileSystemContentFileFilter.Project
        }
      });
    }
  }, [closeDialog, handleSave, openDialog]);

  const handleExportAsPython = useCallback(
    (networkId: string) => {
      if (shouldUseWindowsFileBrowser()) {
        sendWebMessage({
          Type: "FilePython",
          Action: "SaveFile",
          Origin: "Python",
          Filter: "py",
          FilterLabel: labels.aqiraPythonRunner,
          NetworkId: networkId
        });
      } else {
        openDialog({
          name: "FileDialog",
          props: {
            title: labels.exportForAqira,
            message: labels.pleaseSpecifyAFileNameToExportTheProjectForAqira,
            onCancel: () => closeDialog(),
            onOk: (filepath: string) => {
              closeDialog();
              exportAsPython(networkId, filepath);
            },
            action: FileBrowserAction.SaveFile,
            confirmButtonText: labels.export,
            nameInputLabel: labels.fileName,
            contentFileFilter: FileSystemContentFileFilter.Python
          }
        });
      }
    },
    [closeDialog, exportAsPython, openDialog]
  );

  const handleConfirmUnsaved = useCallback(
    (title: string, message: string, nextOk: () => void, nextCancel?: () => void) => {
      openDialog({
        name: "ConfirmDialog",
        props: {
          title,
          message,
          onCancel: () => {
            closeDialog();
            if (nextCancel) nextCancel();
          },
          onOk: () => {
            closeDialog();
            nextOk();
          },
          okLabel: labels.continue
        }
      });
    },
    [openDialog, closeDialog]
  );

  const clearWebMessageResponse = useCallback(
    () => appDispatch(uiWebMessage_setWebMessageResponse({ webMessageResponse: null })),
    [appDispatch]
  );

  const handleWebMessageResponse = useCallback(
    (webMessageResponse: WebMessageResponse) => {
      if (webMessageResponse.Origin === "Project") {
        if (webMessageResponse.Action === FileBrowserAction.OpenFile) {
          if (webMessageResponse.Path) {
            openProject(webMessageResponse.Path);
            clearWebMessageResponse();
          }
        } else if (webMessageResponse.Action === FileBrowserAction.SaveFile) {
          if (webMessageResponse.Path) {
            handleSave(webMessageResponse.Path);
            clearWebMessageResponse();
          }
        }
      } else if (webMessageResponse.Origin === "Python" && webMessageResponse.Action === FileBrowserAction.SaveFile) {
        if (webMessageResponse.Path && webMessageResponse.NetworkId) {
          exportAsPython(webMessageResponse.NetworkId, webMessageResponse.Path);
          clearWebMessageResponse();
        }
      }
    },
    [clearWebMessageResponse, exportAsPython, handleSave, openProject]
  );

  useEffect(() => {
    if (!subscribe) return;

    if (webMessageResponse) {
      handleWebMessageResponse(webMessageResponse);
    }
  }, [subscribe, webMessageResponse, handleWebMessageResponse]);

  return { handleOpen, handleSave, handleSaveAs, handleExportAsPython, handleConfirmUnsaved };
};
