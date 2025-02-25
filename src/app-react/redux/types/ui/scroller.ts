import { ReactNode } from "react";
import { ScrollToRef } from "./header";

export type IntervalRef = { interval: NodeJS.Timeout; dir: "left" | "right" } | { interval: null; dir: null };

export type ScrollerProps = {
  setRef: (element: HTMLElement | null) => void;
  scrollToRef: ScrollToRef;
  children: Array<ReactNode>;
};
