import { LocalStorage } from "src/insights/enums/enums";

const getTabLockKey = (tabId: string | null) => `${tabId}${LocalStorage.WorkspaceLock}`;

/**
 * Retrieves the locked status for a workspace (dashboards)
 */
export const getTabLockValue = (tabId: string | null) => {
  const tabLockKey = getTabLockKey(tabId);
  return localStorage.getItem(tabLockKey) === "true";
};

/**
 * Stores the locked status for a workspace (dashboards)
 */
export const setTabLockValue = (tabId: string | null, value: boolean) => {
  const tabLockKey = getTabLockKey(tabId);
  localStorage.setItem(tabLockKey, value ? "true" : "false");
};
