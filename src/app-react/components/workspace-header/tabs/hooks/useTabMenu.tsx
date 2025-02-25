import { useCallback, useEffect, useState, useContext } from "react";
import { getLabelPart } from "src/components/workspace-header/tabs/utils/getLabelPart";
import { useAppDispatch } from "src/redux/hooks/hooks";
import { useUpdateWorkspaceNameMutation, useDeleteWorkspaceMutation } from "src/redux/api/appApi";
import { UseTabMenuParams } from "src/redux/types/ui/workspaceTabs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { uiProject_openPopout } from "src/redux/slices/ui/project/projectSlice";
import usePubSubManager from "src/pubsub-manager/usePubSubManager";
import { DialogContext } from "src/components/dialog/context/DialogContext";
import { useProjectIO } from "src/components/header/hooks/useProjectIO";
import { ActionTypes, MenuActionHandler } from "src/redux/types/actions";
import { workspaceTabNameValidator } from "../utils/workspaceTabNameValidator";
import { DeleteTabMessage } from "src/redux/types/ui/messages";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { PythonIcon } from "src/components/icon/Icon";
import { ArrowOutward } from "@mui/icons-material";
import { popoutDetails } from "src/popoutDetails";
import { MenuItem } from "src/redux/types/ui/menu";
import { MenuButton } from "src/components/menu/MenuButton";
import { appLabels } from "src/consts/labels";

const labels = appLabels.actions;

export const useTabMenu = ({ workspaceDetails, childOpen, setChildOpen, setParentOpen }: UseTabMenuParams) => {
  const { popoutId } = popoutDetails;
  const { closeDialog, openDialog } = useContext(DialogContext);
  const pubSub = usePubSubManager();
  const [showMenuButton, setShowMenuButtonState] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { handleExportAsPython } = useProjectIO(false);
  const appDispatch = useAppDispatch();
  const setShowMenuButton = useCallback((value: boolean) => {
    setShowMenuButtonState(value);
  }, []);

  const [mutateDeleteWorkspace] = useDeleteWorkspaceMutation();
  const deleteHandler = useCallback(
    (message: DeleteTabMessage) => {
      if (!workspaceDetails) return;
      const { type } = message;
      openDialog({
        name: "ConfirmDialog",
        props: {
          title: "Confirm the action",
          message: `Confirm ${getLabelPart(type)} deletion?`,
          onCancel: () => closeDialog(),
          onOk: () => {
            closeDialog();
            mutateDeleteWorkspace({ id: workspaceDetails.workspace.id });
            pubSub.publish("ReleasePopTab", { id: message.id, targetSubscriberType: "ANY" }, popoutId);
          }
        }
      });
    },
    [workspaceDetails, openDialog, closeDialog, mutateDeleteWorkspace, pubSub, popoutId]
  );

  const exportAsPythonHandler = useCallback(() => {
    if (!workspaceDetails) return;
    handleExportAsPython(workspaceDetails.workspace.id);
  }, [handleExportAsPython, workspaceDetails]);

  const [mutateUpdateWorkspaceName] = useUpdateWorkspaceNameMutation();
  useEffect(() => {
    if (!workspaceDetails) return;
    const {
      workspace: { type, name, id },
      index,
      poppedOut,
      isNameUnique
    } = workspaceDetails;
    const handler: MenuActionHandler = ({ message, type }) => {
      switch (type) {
        case "RenameTabAction": {
          const { id, name: currentName, type } = message;
          openDialog({
            name: "NameInputDialog",
            props: {
              title: `${getLabelPart(type)} Name`,
              message: `Please specify the ${getLabelPart(type)} name`,
              onCancel: () => closeDialog(),
              onOk: ({ value: newName }: { value: string }) => {
                closeDialog();
                if (currentName !== newName) {
                  mutateUpdateWorkspaceName({ id, newName });
                }
              },
              validator: (newName) => workspaceTabNameValidator({ value: newName, type, index, isNameUnique }),
              value: name
            }
          });
          break;
        }
        case "DeleteTabAction": {
          deleteHandler(message);
          break;
        }
        case "PopTabAction": {
          appDispatch(uiProject_openPopout(message.id));
          break;
        }
        case "ExportToPythonAction": {
          exportAsPythonHandler();
          break;
        }
      }
    };

    const deleteAction: MenuItem = {
      type: "Action",
      action: {
        handler,
        icon: <CloseIcon />,
        params: {
          type: ActionTypes.DeleteTabAction,
          message: { id, index, type },
          label: "Delete",
          tooltip: "Delete this tab"
        }
      }
    };

    const renameAction: MenuItem = {
      type: "Action",
      action: {
        handler,
        icon: <EditIcon />,
        params: {
          type: ActionTypes.RenameTabAction,
          message: { id, name, type },
          label: "Rename",
          tooltip: "Rename this tab"
        }
      }
    };

    const popoutAction: MenuItem = {
      type: "Action",
      action: {
        handler,
        icon: <ArrowOutward />,
        params: {
          type: ActionTypes.PopTabAction,
          message: { id },
          label: "Open in new window",
          tooltip: "Open this tab in a new window"
        }
      }
    };

    const divider: MenuItem = {
      type: "Divider"
    };

    const exportPythonAction: MenuItem = {
      type: "Action",
      action: {
        handler,
        icon: <PythonIcon />,
        params: {
          type: ActionTypes.ExportToPythonAction,
          message: { id },
          label: labels.exportForAqira,
          tooltip: labels.exportTheNetworkForAqira
        }
      }
    };

    const items: MenuItem[] = [deleteAction, renameAction];
    if (!poppedOut) {
      items.push(popoutAction);
    }
    if (type === "Network") {
      items.push(divider, exportPythonAction);
    }
    setMenuItems(items);
  }, [
    deleteHandler,
    appDispatch,
    exportAsPythonHandler,
    mutateUpdateWorkspaceName,
    workspaceDetails,
    openDialog,
    closeDialog
  ]);

  return workspaceDetails
    ? {
        setShowMenuButton,
        menu: (
          <span style={{ visibility: showMenuButton || workspaceDetails.selected ? "visible" : "hidden" }}>
            <MenuButton
              dataTestId="WorkspaceHeaderTabMenu"
              id={workspaceDetails.workspace.id}
              items={menuItems}
              prefix="tab-menu"
              onOpen={() => setChildOpen(true)}
              onClose={() => {
                setShowMenuButton(false);
                setChildOpen(false);
                setParentOpen(false);
              }}
              openElement={<KeyboardArrowDownIcon sx={{ cursor: "pointer" }} />}
              tooltip="Tab Menu"
              childOpen={childOpen}
              setChildOpen={setChildOpen}
            />
          </span>
        ),
        deleteHandler
      }
    : null;
};
