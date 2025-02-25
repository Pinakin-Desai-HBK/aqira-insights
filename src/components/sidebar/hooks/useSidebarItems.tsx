import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DialogContext } from "../../dialog/context/DialogContext";
import { useAppDispatch, useAppSelector } from "src/redux/hooks/hooks";
import { useGetAboutDataQuery } from "src/redux/api/appApi";
import {
  selectStore_UI_Project_SelectedWorkspace,
  uiProject_setScrollToSelected
} from "src/redux/slices/ui/project/projectSlice";
import {
  InitallySelectableSideBarItemIdName,
  PalettePanelSideBarItem,
  SideBarItem,
  UIPanelSideBarEventlessItem,
  UIPanelSideBarItem
} from "src/redux/types/ui/palette";
import { selectStore_UI_LogPanel_ShowLogPanel, uiLogPanel_toggle } from "src/redux/slices/ui/logPanel/logPanelSlice";
import {
  selectStore_UI_DataPanel_ShowDataPanel,
  uiDataPanel_show,
  uiDataPanel_toggle
} from "src/redux/slices/ui/dataPanel/dataPanelSlice";
import { popoutDetails } from "src/popoutDetails";
import { allSidebarItems } from "../allSidebarItems";
import { appLabels } from "src/consts/labels";
import useTheme from "@mui/material/styles/useTheme";

const aboutLabels = appLabels.About;
const feedbackLabels = appLabels.Feedback;

export const useSidebarItems = (initialSelectedPaletteItems: InitallySelectableSideBarItemIdName[]) => {
  const theme = useTheme();
  const { isPopout } = popoutDetails;
  const showLogPanel = useAppSelector(selectStore_UI_LogPanel_ShowLogPanel);
  const showDataPanel = useAppSelector(selectStore_UI_DataPanel_ShowDataPanel);
  const selectedWorkspace = useAppSelector(selectStore_UI_Project_SelectedWorkspace);
  const { data: aboutData } = useGetAboutDataQuery();
  const appDispatch = useAppDispatch();
  const [sidebarItems, setSidebarItems] = useState<SideBarItem[]>(() => []);
  const { closeDialog, openDialog } = useContext(DialogContext);

  useEffect(() => {
    setSidebarItems((prev) => {
      return allSidebarItems
        .filter((item) => {
          if (item.idName === "nodes" && selectedWorkspace?.type !== "Network") return false;
          if (item.idName === "visualizations" && selectedWorkspace?.type !== "Dashboard") return false;
          return true;
        })
        .map((item) => {
          const prevItem = prev.find((prevItem) => prevItem.idName === item.idName);
          if (prevItem) return prevItem;

          if (item.idName === "nodes") {
            const prevVisualizations = prev.find((prevItem) => prevItem.idName === "visualizations");
            return prevVisualizations
              ? {
                  ...item,
                  selected: prevVisualizations.type === "palettePanelItem" ? prevVisualizations.selected : false
                }
              : item;
          }

          if (item.idName === "visualizations") {
            const prevVisualizations = prev.find((prevItem) => prevItem.idName === "nodes");
            return prevVisualizations
              ? {
                  ...item,
                  selected: prevVisualizations.type === "palettePanelItem" ? prevVisualizations.selected : false
                }
              : item;
          }
          return item;
        });
    });
  }, [selectedWorkspace?.type, theme]);

  const updateItem = useCallback(
    (selected: boolean, sidebarItem: UIPanelSideBarItem | PalettePanelSideBarItem | UIPanelSideBarEventlessItem) => {
      const updated: SideBarItem[] = sidebarItems.map((item) =>
        sidebarItem.idName !== item.idName
          ? item
          : {
              ...item,
              selected
            }
      );
      setSidebarItems(updated);
    },
    [sidebarItems]
  );

  const openHelpWindow = () => {
    const helpFilePath = `/help/welcome.html`;
    window.open(helpFilePath, "_blank", "width=800,height=600");
  };

  const handleSidebarItemClick = useCallback(
    (sidebarItem: SideBarItem) => {
      if (sidebarItem.type === "uiPanelEventlessItem" && sidebarItem.idName === "about") {
        if (!aboutData) return;
        updateItem(!sidebarItem.selected, sidebarItem);
        openDialog({
          name: "AboutDialog",
          props: {
            title: aboutLabels.title,
            onOk: () => {
              updateItem(false, sidebarItem);
              closeDialog();
            }
          }
        });
      } else if (sidebarItem.idName === "feedback") {
        openDialog({ name: "FeedbackDialog", props: { title: feedbackLabels.feedback } });
      } else if (sidebarItem.idName === "log") {
        appDispatch(uiLogPanel_toggle());
      } else if (sidebarItem.idName === "data") {
        appDispatch(uiDataPanel_toggle());
      } else if (sidebarItem.idName === "help") {
        openHelpWindow();
      } else if (sidebarItem.type === "palettePanelItem") {
        updateItem(!sidebarItem.selected, sidebarItem);
        if (selectedWorkspace) {
          appDispatch(uiProject_setScrollToSelected(true));
        }
      }
    },
    [aboutData, appDispatch, closeDialog, selectedWorkspace, openDialog, updateItem]
  );

  useEffect(() => {
    const found = sidebarItems.find(
      (item): item is UIPanelSideBarItem =>
        item.idName === "log" && item.type === "uiPanelItem" && item.selected !== showLogPanel
    );
    if (found) updateItem(showLogPanel, found);
  }, [updateItem, showLogPanel, sidebarItems]);

  useEffect(() => {
    const found = sidebarItems.find(
      (item): item is UIPanelSideBarItem =>
        item.idName === "data" && item.type === "palettePanelItem" && item.selected !== showDataPanel
    );
    if (found) updateItem(showDataPanel, found);
  }, [updateItem, showDataPanel, sidebarItems]);

  useEffect(() => {
    if (initialSelectedPaletteItems.includes("data")) {
      appDispatch(uiDataPanel_show({ show: true }));
    }

    setTimeout(() => {
      setSidebarItems((prev) =>
        prev.map((item) =>
          item.idName === "data"
            ? item
            : {
                ...item,
                selected: initialSelectedPaletteItems.includes(item.idName as InitallySelectableSideBarItemIdName)
              }
        )
      );
    }, 0);
  }, [initialSelectedPaletteItems, appDispatch]);

  const paletteItems = useMemo<PalettePanelSideBarItem[]>(
    () =>
      sidebarItems
        .filter((item): item is PalettePanelSideBarItem => item.type === "palettePanelItem")
        .filter((item) => item.selected),
    [sidebarItems]
  );

  const filteredItems = useMemo<SideBarItem[]>(
    () =>
      sidebarItems.filter((item) => {
        if (isPopout) {
          if (item.idName === "visualizations") return selectedWorkspace?.type === "Dashboard";
          if (item.idName === "nodes") return selectedWorkspace?.type === "Network";
          return item.type === "palettePanelItem" || item.includeInPopout;
        }
        return true;
      }),
    [isPopout, selectedWorkspace, sidebarItems]
  );

  return {
    paletteItems,
    handleSidebarItemClick,
    filteredItems
  };
};
