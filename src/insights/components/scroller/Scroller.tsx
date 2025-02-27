import { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import styles from "./Scroller.module.css";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowRight from "@mui/icons-material/ArrowRight";
import { useResizeDetector } from "react-resize-detector";
import { IntervalRef, ScrollerProps } from "src/insights/redux/types/ui/scroller";
import { clearIntervalRef, createEmptyIntervalRef, getButtonVisibility } from "./utils";
import Button from "@mui/material/Button";

export const Scroller = ({ setRef, scrollToRef, children }: ScrollerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<IntervalRef>(createEmptyIntervalRef());
  const [leftVisible, setLeftVisible] = useState<boolean>(false);
  const [rightVisible, setRightVisible] = useState<boolean>(false);

  const mouseDown = useCallback((dir: "left" | "right") => {
    clearIntervalRef(intervalRef);
    if (containerRef.current) {
      let adj = 10;
      intervalRef.current = {
        interval: setInterval(() => {
          if (containerRef.current)
            containerRef.current.scrollLeft = containerRef.current.scrollLeft + (dir === "left" ? -adj : adj);
          adj += 10;
        }, 100),
        dir
      };
    }
    return () => clearIntervalRef(intervalRef);
  }, []);

  const mouseUp: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    clearIntervalRef(intervalRef);
  }, []);

  const onClick = useCallback((dir: "left" | "right") => {
    if (containerRef.current) {
      const { children } = containerRef.current;
      const containerBounds = containerRef.current.getBoundingClientRect();
      if (dir === "left") {
        for (let i = children.length - 1; i >= 0; i--) {
          const child = children[i];
          if (!child) continue;
          const childBounds = child.getBoundingClientRect();
          if (childBounds.left + 1 < containerBounds.left) {
            child.scrollIntoView();
            break;
          }
        }
      } else {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (!child) continue;
          const childBounds = child.getBoundingClientRect();
          if (childBounds.left + childBounds.width - 1 > containerBounds.right) {
            child.scrollIntoView();
            break;
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) setRef(containerRef.current);
  }, [setRef]);

  useEffect(() => {
    scrollToRef.current = (index: number) =>
      setTimeout(() => containerRef.current?.children[index]?.scrollIntoView(), 0);
  }, [scrollToRef]);

  const checkButtons = useCallback(() => {
    const { showLeft, showRight } = getButtonVisibility(containerRef);
    if (leftVisible !== showLeft) setLeftVisible(showLeft);
    if (rightVisible !== showRight) setRightVisible(showRight);
    if (intervalRef.current.dir === "left" && !showLeft) clearIntervalRef(intervalRef);
    if (intervalRef.current.dir === "right" && !showRight) clearIntervalRef(intervalRef);
  }, [leftVisible, rightVisible]);

  useEffect(() => {
    if (children.length) checkButtons();
  }, [checkButtons, children]);

  useResizeDetector({
    handleHeight: false,
    handleWidth: true,
    onResize: checkButtons,
    targetRef: containerRef
  });

  return (
    <>
      {leftVisible || rightVisible ? (
        <Button
          data-testid="WorkspaceHeaderTabsLeft"
          style={{ visibility: leftVisible ? "visible" : "hidden" }}
          className={`AI_Tabs_Scroller_Button`}
          onMouseUp={mouseUp}
          onMouseDown={() => {
            mouseDown("left");
          }}
          onClick={() => onClick("left")}
        >
          <ArrowLeft />
        </Button>
      ) : null}
      <div
        data-testid="WorkspaceHeaderTabsScroller"
        onReset={checkButtons}
        onScroll={checkButtons}
        className={`AI_Tabs_Scroller`}
        ref={containerRef}
      >
        {children}
      </div>
      {leftVisible || rightVisible ? (
        <Button
          data-testid="WorkspaceHeaderTabsRight"
          style={{ visibility: rightVisible ? "visible" : "hidden" }}
          className={`AI_Tabs_Scroller_Button`}
          onMouseUp={mouseUp}
          onMouseDown={() => {
            mouseDown("right");
          }}
          onClick={() => onClick("right")}
        >
          <ArrowRight />
        </Button>
      ) : null}
    </>
  );
};
