"use client";

/**
 * Separator — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * (used as border-ds-border/5 dividers, e.g. lines 718 pt-ds-4 border-t,
 * line 898 border-b border-ds-border/5).
 *
 * Visual : bg-ds-border/5 (very subtle divider matching template).
 */
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "./utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-ds-border/5",
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
