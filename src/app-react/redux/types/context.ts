export type WindowMap = { [k in string]: { win: Window; checkerInterval: NodeJS.Timeout; winListener: () => void } };
