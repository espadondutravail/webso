import { useStore } from "@nanostores/react";
import { findApplicableMedia } from "@webstudio-is/css-engine";
import { css, numericScrubControl, theme } from "@webstudio-is/design-system";
import { useEffect, useRef, useState } from "react";
import {
  canvasWidthStore,
  isCanvasPointerEventsEnabledStore,
} from "~/builder/shared/nano-states";
import { minCanvasWidth } from "~/shared/breakpoints";
import {
  breakpointsStore,
  isResizingCanvasStore,
  selectedBreakpointIdStore,
} from "~/shared/nano-states";

const handleStyle = css({
  position: "absolute",
  top: 0,
  width: 4,
  bottom: 0,
  cursor: "col-resize",
  pointerEvents: "auto",
  color: "transparent",
  "&::before": {
    position: "absolute",
    content: '""',
    inset: 0,
    background: "currentColor",
  },
  "& svg": {
    position: "absolute",
    top: "50%",
    right: 0,
    transform: "translateX(100%)",
    color: theme.colors.foregroundSubtle,
  },
  "&[data-state=hovering]": {
    "&::before, & svg": {
      color: theme.colors.backgroundPrimaryLight,
    },
  },
  "&[data-align=left]": {
    left: 0,
  },
  "&[data-align=right]": {
    right: 0,
  },
  "&[data-state=dragging]::before": {
    display: "none",
  },
});

const handleIcon = (
  <svg
    width="14"
    height="40"
    viewBox="0 0 14 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 0H10C12.2091 0 14 1.79086 14 4V36C14 38.2091 12.2091 40 10 40H0V0Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.5 8C4.77614 8 5 8.22386 5 8.5L5 31.5C5 31.7761 4.77614 32 4.5 32C4.22386 32 4 31.7761 4 31.5L4 8.5C4 8.22386 4.22386 8 4.5 8Z"
      fill="#C1C8CD"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.5 8C8.77614 8 9 8.22386 9 8.5L9 31.5C9 31.7761 8.77614 32 8.5 32C8.22386 32 8 31.7761 8 31.5L8 8.5C8 8.22386 8.22386 8 8.5 8Z"
      fill="#C1C8CD"
    />
  </svg>
);

const updateBreakpoint = (width: number) => {
  const applicableBreakpoint = findApplicableMedia(
    Array.from(breakpointsStore.get().values()),
    width
  );
  if (applicableBreakpoint) {
    selectedBreakpointIdStore.set(applicableBreakpoint.id);
  }
};

const useScrub = ({ side }: { side: "right" | "left" }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current === null) {
      return;
    }
    const scrub = numericScrubControl(ref.current, {
      getInitialValue() {
        return canvasWidthStore.get();
      },
      getValue(state, movement) {
        const value =
          side === "left"
            ? state.value - movement * 2
            : state.value + movement * 2;
        return Math.max(value, minCanvasWidth);
      },
      onStatusChange(status) {
        if (status === "scrubbing") {
          isCanvasPointerEventsEnabledStore.set(false);
          isResizingCanvasStore.set(true);
          return;
        }
        isCanvasPointerEventsEnabledStore.set(true);
        isResizingCanvasStore.set(false);
      },
      onValueInput(event) {
        canvasWidthStore.set(event.value);
        updateBreakpoint(event.value);
      },
    });
    return scrub.disconnectedCallback;
  }, []);

  return ref;
};

const useResize = () => {
  const isDragging = useStore(isCanvasPointerEventsEnabledStore) === false;
  const [isHovering, setIsHovering] = useState(false);
  const leftRef = useScrub({ side: "left" });
  const rightRef = useScrub({ side: "right" });

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseOut = () => setIsHovering(false);

  const state = isDragging ? "dragging" : isHovering ? "hovering" : "idle";

  return {
    state,
    leftRef,
    rightRef,
    handleMouseEnter,
    handleMouseOut,
  };
};

export const ResizeHandles = () => {
  const { state, leftRef, rightRef, handleMouseEnter, handleMouseOut } =
    useResize();

  return (
    <>
      <div
        ref={leftRef}
        onMouseEnter={handleMouseEnter}
        onMouseOut={handleMouseOut}
        data-state={state}
        data-align="left"
        className={handleStyle()}
      />
      <div
        ref={rightRef}
        onMouseEnter={handleMouseEnter}
        onMouseOut={handleMouseOut}
        data-state={state}
        data-align="right"
        className={handleStyle()}
      >
        {handleIcon}
      </div>
    </>
  );
};
