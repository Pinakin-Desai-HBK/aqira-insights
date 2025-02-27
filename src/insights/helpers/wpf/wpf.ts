import { WebMessage } from "src/insights/redux/types/redux/webMessage";

declare global {
  interface Window {
    useWindowsFileBrowser: boolean;
    chrome: { webview: { postMessage: (message: WebMessage) => void } };
  }
}

// window.chrome is defined with the type "unknown" in a node module (tslog) so we need to cast it to a usuable type
const windowChrome = window.chrome;

export const shouldUseWindowsFileBrowser = () => {
  // window.chrome.webview is a property that is only available in the WPF environment
  // window.useWindowsFileBrowser is a property provided by the shell wrapper

  try {
    return !!windowChrome.webview && window.useWindowsFileBrowser;
  } catch {
    return false;
  }
};

export const sendWebMessage = (message: WebMessage) => {
  if (windowChrome.webview) {
    windowChrome.webview.postMessage(message);
  }
};
