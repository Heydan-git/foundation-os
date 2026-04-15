"use client";

/**
 * Label — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * (used throughout, e.g. lines 577-606 as field labels).
 *
 * Visual : text-ds-sm text-ds-fg/60 font-mono (mono for label convention in template).
 * Peer-disabled state : opacity 50, cursor not-allowed.
 */
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "./utils";

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-ds-1 text-ds-sm text-ds-fg/60 font-mono leading-none select-none",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
