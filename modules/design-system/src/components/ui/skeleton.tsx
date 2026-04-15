"use client";

/**
 * Skeleton — iso Void Glass style (loading placeholder matching DS surfaces).
 *
 * Visual : bg-ds-fg/[0.04] + inset shadow + animate-pulse + rounded-ds-md.
 * Matches the loading placeholders shown in DashboardDesignSystem (lines 1466+).
 */
import * as React from "react";

import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-ds-fg/[0.04] border border-ds-border/5 shadow-[var(--ds-shadow-inset)] animate-pulse rounded-ds-md",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
