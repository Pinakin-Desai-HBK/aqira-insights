import { useMemo } from "react";

type ToastStore = {
  toastMessages: string[];
};

type AppToastManager = {
  recordToast: (toast: string) => void;
  hasToast: (toast: string) => boolean;
  isLastToast: (toast: string) => boolean;
  getLastToast: () => string | null;
};

declare global {
  interface Window {
    getAppToastManager: () => AppToastManager | null;
    setAppToastManager: (toastManager: AppToastManager) => void;
  }
}

(() => {
  let AppToastManager: AppToastManager | null = null;
  window.getAppToastManager = () => AppToastManager;
  window.setAppToastManager = (toastManager) => (AppToastManager = toastManager);
})();

const getToastManager = (): AppToastManager => {
  const found = window.getAppToastManager();
  if (found !== null) {
    return found;
  }

  const toastStore: ToastStore = {
    toastMessages: []
  };

  const toastManager: AppToastManager = {
    recordToast: (toast) => {
      toastStore.toastMessages.push(toast);
    },
    hasToast: (toast) => toastStore.toastMessages.includes(toast),
    isLastToast: (toast) => toastStore.toastMessages[toastStore.toastMessages.length - 1] === toast,
    getLastToast: () => {
      if (toastStore.toastMessages.length > 0) {
        const result = toastStore.toastMessages[toastStore.toastMessages.length - 1];
        return result !== undefined ? result : null;
      }
      return null;
    }
  };
  window.setAppToastManager(toastManager);
  return toastManager;
};

export const useToastManager = () => {
  const recordToast = useMemo(() => {
    const { recordToast } = getToastManager();
    return recordToast;
  }, []);
  const hasToast = useMemo(() => {
    const { hasToast } = getToastManager();
    return hasToast;
  }, []);
  const isLastToast = useMemo(() => {
    const { isLastToast } = getToastManager();
    return isLastToast;
  }, []);
  const getLastToast = useMemo(() => {
    const { getLastToast } = getToastManager();
    return getLastToast;
  }, []);
  return { recordToast, hasToast, isLastToast, getLastToast };
};
