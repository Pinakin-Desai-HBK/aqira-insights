import { useCallback, useEffect, useMemo, useState } from "react";
import { MenuActionHandler } from "../../../redux/types/actions";
import { createHeaderMenuItems } from "../utils/createHeaderMenuItems";
import { useProjectIO } from "./useProjectIO";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { useClearLogMessagesMutation, useGetCurrentProjectQuery, useNewProjectMutation } from "src/redux/api/appApi";
import usePopoutManager from "src/popout-manager/usePopoutManager";
import { MenuItem } from "src/redux/types/ui/menu";
import { make_selectStore_UI_Project_ForHeaderMenuItemsHook } from "src/redux/slices/ui/project/combinedSelectors";

const useHeaderMenuItems = () => {
  const projectSelector = useMemo(make_selectStore_UI_Project_ForHeaderMenuItemsHook, []);
  const { isDirty, previouslySaved, workspaces } = useAppSelector(projectSelector);
  const { data: project } = useGetCurrentProjectQuery();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { handleOpen, handleSave, handleSaveAs, handleConfirmUnsaved } = useProjectIO(true);
  const [newProject] = useNewProjectMutation();
  const { closeAllPopouts } = usePopoutManager();
  const [clearLogMessagesMutation] = useClearLogMessagesMutation();

  const handleNewProject = useCallback(async () => {
    clearLogMessagesMutation();
    await newProject();
    if (workspaces && closeAllPopouts) closeAllPopouts(workspaces.map(({ id }) => id));
  }, [closeAllPopouts, newProject, workspaces, clearLogMessagesMutation]);

  const handler: MenuActionHandler = useCallback<MenuActionHandler>(
    ({ type }) => {
      switch (type) {
        case "CreateNewProjectAction":
          if (isDirty)
            handleConfirmUnsaved(
              `Confirm Create New Project`,
              `Are you sure you wish to continue without saving the current project? Any unsaved changes will be lost.`,
              handleNewProject
            );
          else handleNewProject();
          break;
        case "OpenProjectAction":
          if (isDirty)
            handleConfirmUnsaved(
              `Confirm Open Project`,
              `Are you sure you wish to continue without saving the current project? Any unsaved changes will be lost.`,
              handleOpen
            );
          else handleOpen();
          break;
        case "SaveProjectAction":
          if (previouslySaved && project && project?.filepath) {
            handleSave(project.filepath);
          } else {
            handleSaveAs();
          }
          break;
        case "SaveProjectAsAction":
          handleSaveAs();
          break;
      }
    },
    [isDirty, handleConfirmUnsaved, handleNewProject, handleOpen, previouslySaved, project, handleSaveAs, handleSave]
  );

  useEffect(() => {
    const items = createHeaderMenuItems(isDirty, previouslySaved, handler);
    setMenuItems(items);
  }, [handler, isDirty, previouslySaved]);

  return menuItems;
};

export default useHeaderMenuItems;
