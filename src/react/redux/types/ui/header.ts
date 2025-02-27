import { RefObject } from "react";

export type ScrollTo = (index: number) => void;

export type ScrollToRef = RefObject<ScrollTo | null>;
