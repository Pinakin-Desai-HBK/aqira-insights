import { useEffect, useState, useMemo } from "react";
import usePopoutManager from "src/react/popout-manager/usePopoutManager";
import useShellHelper from "../../header/hooks/useShellHelper";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { InitallySelectableSideBarItemIdName, PalettePanelSideBarItem } from "src/react/redux/types/ui/palette";
import { popoutDetails } from "src/react/popoutDetails";
import { make_selectStore_UI_Project_ForMain } from "src/react/redux/slices/ui/project/combinedSelectors";

export const useMainContent = (): {
  initialSelectedPaletteItems: InitallySelectableSideBarItemIdName[];
  isPopout: boolean;
  selectedPaletteItems: PalettePanelSideBarItem[];
  setSelectedPaletteItems: React.Dispatch<React.SetStateAction<PalettePanelSideBarItem[]>>;
} => {
  useShellHelper();
  const projectSelector = useMemo(make_selectStore_UI_Project_ForMain, []);
  const { workspaces, poppedWorkspaceIds } = useAppSelector(projectSelector);
  const [previousWorkspaces, setPreviousWorkspaces] = useState(workspaces);
  const [selectedPaletteItems, setSelectedPaletteItems] = useState<PalettePanelSideBarItem[]>([]);
  const { isPopout } = popoutDetails;
  const { openPopout } = usePopoutManager();
  const [initialSelectedPaletteItems, setInitialSelectedPaletteItems] = useState<InitallySelectableSideBarItemIdName[]>(
    []
  );

  useEffect(() => {
    if (!isPopout && workspaces) {
      workspaces.forEach((tab) => {
        if (poppedWorkspaceIds.includes(tab.id) && openPopout) openPopout({ name: tab.name, tabId: tab.id });
      });
    }
  }, [isPopout, openPopout, poppedWorkspaceIds, workspaces]);

  useEffect(() => {
    if (previousWorkspaces.length === 0 && workspaces.length > 0) {
      setInitialSelectedPaletteItems(["data", workspaces[0]!.type === "Network" ? "nodes" : "visualizations"]);
    }
    setPreviousWorkspaces(workspaces);
  }, [workspaces, previousWorkspaces]);

  return {
    initialSelectedPaletteItems,
    isPopout,
    selectedPaletteItems,
    setSelectedPaletteItems
  };
};
