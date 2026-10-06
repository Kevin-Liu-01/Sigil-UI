"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import {
  Panel,
  Group as PanelGroup,
  Separator as PanelResizeHandle,
  type PanelImperativeHandle,
} from "react-resizable-panels";
import { cn } from "../utils";

export interface ResizablePanelGroupProps extends ComponentPropsWithoutRef<typeof PanelGroup> {}

export const ResizablePanelGroup = forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  function ResizablePanelGroup({ className, ...rest }, ref) {
    return (
      <PanelGroup
        data-slot="resizable-panel-group"
        className={cn(
          "flex h-full w-full aria-[orientation=horizontal]:flex-col",
          className,
        )}
        {...rest}
        elementRef={ref ?? rest.elementRef}
      />
    );
  },
);

export interface ResizablePanelProps extends ComponentPropsWithoutRef<typeof Panel> {}

export const ResizablePanel = forwardRef<PanelImperativeHandle, ResizablePanelProps>(
  function ResizablePanel(props, ref) {
    return <Panel data-slot="resizable-panel" {...props} panelRef={ref ?? props.panelRef} />;
  },
);

export interface ResizableHandleProps extends ComponentPropsWithoutRef<typeof PanelResizeHandle> {
  withHandle?: boolean;
}

export const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps>(
  function ResizableHandle({ withHandle, className, ...rest }, ref) {
    return (
      <PanelResizeHandle
        aria-label="Resize panels"
        data-slot="resizable-handle"
        className={cn(
          "relative flex w-px items-center justify-center",
          "bg-[var(--s-border)] transition-colors duration-[var(--s-duration-fast,150ms)]",
          "after:absolute after:inset-y-0 after:-left-1 after:-right-1",
          "hover:bg-[var(--s-primary)]/40",
          "focus-visible:outline-none focus-visible:ring-[length:var(--s-focus-ring-width)] focus-visible:ring-[var(--s-focus-ring-color)] focus-visible:ring-offset-[var(--s-focus-ring-offset)]",
          "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full",
          "aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:-top-1 aria-[orientation=horizontal]:after:-bottom-1 aria-[orientation=horizontal]:after:left-auto aria-[orientation=horizontal]:after:right-auto",
          className,
        )}
        {...rest}
        elementRef={ref ?? rest.elementRef}
      >
        {withHandle && (
          <div className="z-10 flex h-4 w-3 items-center justify-center rounded-[var(--s-radius-sm)] border border-[color:var(--s-border)] bg-[var(--s-surface)]">
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="text-[var(--s-text-muted)]">
              <path d="M1 1v8M5 1v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </PanelResizeHandle>
    );
  },
);
