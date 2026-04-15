"use client";

/**
 * Tooltip — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * (section "Tooltip", lines 988-998).
 *
 * Visual :
 *   - Content : px-ds-3 py-ds-1_5 rounded-ds-md bg-ds-surface-2 border ds-border/10
 *               shadow-[0_10px_20px_rgba(0,0,0,0.5)]
 *   - Text    : text-ds-sm text-ds-fg/90 font-mono
 *   - Arrow   : ds-surface-2 matching background
 */
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "./utils";

function TooltipProvider({
  delayDuration = 100,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 6,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-ds-md bg-ds-surface-2 border border-ds-border/10 px-ds-3 py-ds-1_5 text-ds-sm text-ds-fg/90 font-mono shadow-[0_10px_20px_rgba(0,0,0,0.5)] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-ds-surface-2 fill-ds-surface-2 z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 border-r border-b border-ds-border/10" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
