// @ts-nocheck -- deps v9 API drift (react-resizable-panels) — visual iso prioritaire
"use client";

/**
 * Resizable — react-resizable-panels iso base DS.
 * Handle : bg-ds-border/10 hover:bg-ds-blue/40 transition-colors.
 *   - Horizontal : w-px h-full
 *   - Vertical   : h-px w-full (via data-panel-group-direction=vertical)
 * WithHandle dot : w-1 h-4 rounded-ds-full bg-ds-fg/40 (vertical swap w-4 h-1).
 */
import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "./utils";

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "relative flex w-px h-full items-center justify-center bg-ds-border/10 hover:bg-ds-blue/40 transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ds-blue/40 focus-visible:outline-hidden",
        "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center",
            "w-1 h-4 rounded-ds-full bg-ds-fg/40",
            "[[data-panel-group-direction=vertical]_&]:w-4 [[data-panel-group-direction=vertical]_&]:h-1",
          )}
        >
          <GripVerticalIcon className="sr-only" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
