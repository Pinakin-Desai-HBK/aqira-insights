import { FileBrowserAction } from "../ui/fileBrowser";

type WebMessageOrigin = "Application" | "DataExplorer" | "Project" | "Python";

type WebMessageActionBase<T> = { Type: T; Action: string; Origin: WebMessageOrigin };
type WebMessageAction<T, P = undefined> = P extends undefined ? WebMessageActionBase<T> : WebMessageActionBase<T> & P;

type WebMessageFileFilter = {
  Filter: string | undefined;
  FilterLabel: string | undefined;
};

type WebMessageFile = WebMessageAction<"File", WebMessageFileFilter>;

type WebMessageFilePython = WebMessageAction<
  "FilePython",
  {
    NetworkId: string;
  } & WebMessageFileFilter
>;

type WebMessageFolder = WebMessageAction<"Folder">;

type WebMessageApplication = WebMessageAction<"Application">;

export type WebMessage = WebMessageApplication | WebMessageFilePython | WebMessageFile | WebMessageFolder;

export type WebMessageResponse = {
  Action: FileBrowserAction;
  NetworkId?: string;
  Origin: WebMessageOrigin;
  Path?: string;
};

export type UIWebMessageSlice = { webMessageResponse: WebMessageResponse | null };
