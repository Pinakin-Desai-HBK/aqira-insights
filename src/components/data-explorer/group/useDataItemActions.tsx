import { MouseEvent, useCallback, useContext, useState } from "react";
import { ActionTypes, MenuActionHandler } from "src/redux/types/actions";
import { MenuItem } from "src/redux/types/ui/menu";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import { Menu } from "src/components/menu/Menu";
import { DataGroupItem } from "src/redux/types/ui/dataExplorer";
import { DialogContext } from "src/components/dialog/context/DialogContext";
import { appLabels } from "src/consts/labels";
import { filesize } from "filesize";

const labels = appLabels.useDataItemActions;
const actionLabels = appLabels.actions;

export const useDataItemActions = ({ folder }: { folder: string }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const { closeDialog, openDialog } = useContext(DialogContext);

  const openColumnDetails = useCallback(
    ({ source }: { source: DataGroupItem }) => {
      const dataItemType = source.type;
      if (dataItemType !== "DataFile") {
        return;
      }
      const filePath = source.item.fullName.replaceAll("\\", "/");
      const { creationTimeUtc, fileSize, lastWriteTimeUtc, name } = source.item;
      openDialog({
        name: "ColumnDetailsDialog",
        props: {
          title: labels.details,
          dataFileDetails: {
            filename: name,
            filePath,
            folder,
            created: new Date(creationTimeUtc).toLocaleString(),
            modified: new Date(lastWriteTimeUtc).toLocaleString(),
            size: filesize(fileSize, { base: 2, standard: "jedec" })
          },
          onOk: () => {
            closeDialog();
          }
        }
      });
    },
    [closeDialog, folder, openDialog]
  );

  const menuHandler: MenuActionHandler = useCallback(
    (params) => {
      if (params.type === ActionTypes.ViewColumnDetails) {
        const {
          message: { source }
        } = params;
        openColumnDetails({ source });
      }
    },
    [openColumnDetails]
  );

  const openMenu = useCallback(
    (e: MouseEvent<HTMLDivElement>, source: DataGroupItem) => {
      const dataItemType = source.type;
      if (dataItemType !== "DataFile") {
        return;
      }

      const viewColumnDetailsAction: MenuItem = {
        type: "Action",
        action: {
          handler: menuHandler,
          icon: <ViewColumnIcon />,
          params: {
            type: ActionTypes.ViewColumnDetails,
            message: { source },
            label: actionLabels.viewDataInformation,
            tooltip: actionLabels.viewDataInformationForThisFile
          }
        }
      };
      setMenuItems(() => {
        setMenuAnchorEl(e.currentTarget);
        return [viewColumnDetailsAction];
      });
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    [menuHandler]
  );

  const closeMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuAnchorEl(null);
    return false;
  }, []);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  return {
    menu: (
      <Menu
        items={menuItems}
        anchorEl={menuAnchorEl}
        dataTestId="AI-data-explorer-file-menu"
        id="dataExplorerFileMenu"
        prefix=""
        positionProps={{
          anchorOrigin: { vertical: "bottom", horizontal: "center" },
          transformOrigin: { vertical: "top", horizontal: "center" }
        }}
        closeMenu={closeMenu}
      />
    ),
    openMenu,
    openColumnDetails
  };
};
