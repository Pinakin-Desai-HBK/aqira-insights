import { UIWorkspaceSlice } from "src/redux/types/redux/workspaces";

/**
 * Sets propertiesVisible value
 */
export const setPropertiesVisible = (state: UIWorkspaceSlice) => {
  state.propertiesVisible = !state.blockProperties && state.selectedWorkspaceItem !== null;
};

/**
 * Sets blockProperties and blockPropertiesLocked values
 */
export const setBlockProperties = (
  state: UIWorkspaceSlice,
  details: { blockProperties: boolean; blockPropertiesLocked: boolean | undefined }
) => {
  const { blockProperties, blockPropertiesLocked } = details;
  const hasBlockPropertiesLockedValue = blockPropertiesLocked !== undefined;

  const newBlockProperties = hasBlockPropertiesLockedValue
    ? blockProperties
    : state.blockPropertiesLocked
      ? state.blockProperties
      : blockProperties;

  const newBlockPropertiesLocked = hasBlockPropertiesLockedValue ? blockPropertiesLocked : state.blockPropertiesLocked;
  state.blockProperties = newBlockProperties;
  state.blockPropertiesLocked = newBlockPropertiesLocked;
  setPropertiesVisible(state);
};
