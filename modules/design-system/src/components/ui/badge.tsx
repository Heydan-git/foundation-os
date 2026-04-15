"use client";

/**
 * Badge — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * Status pills pattern used throughout DashboardDesignSystem template
 * (e.g. line 1047 "+2.4%" emerald pill, SEED DATA live badge in DashboardLayout).
 *
 * Variants :
 *   - default (info blue)  : text-ds-blue bg-ds-blue/10 border ds-blue/20
 *   - success              : text-ds-emerald bg-ds-emerald/10 border ds-emerald/20
 *   - warning              : text-ds-amber bg-ds-amber/10 border ds-amber/20
 *   - destructive (danger) : text-ds-rose bg-ds-rose/10 border ds-rose/20
 *   - purple               : text-ds-purple bg-ds-purple/10 border ds-purple/20
 *   - neutral (glass)      : text-ds-fg/60 bg-ds-fg/[0.03] border ds-border/8
 *   - outline              : text-ds-fg/80 bg-transparent border ds-border/10
 *   - live                 : success + pulse dot animated
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-ds-1_5 rounded-ds-sm border px-ds-2 py-0.5 text-ds-2xs font-mono uppercase tracking-wider w-fit whitespace-nowrap shrink-0 [&>svg]:size-2.5 [&>svg]:pointer-events-none transition-all",
  {
    variants: {
      variant: {
        default:
          "text-ds-blue bg-ds-blue/10 border-ds-blue/20",
        success:
          "text-ds-emerald bg-ds-emerald/10 border-ds-emerald/20",
        warning:
          "text-ds-amber bg-ds-amber/10 border-ds-amber/20",
        destructive:
          "text-ds-rose bg-ds-rose/10 border-ds-rose/20",
        purple:
          "text-ds-purple bg-ds-purple/10 border-ds-purple/20",
        neutral:
          "text-ds-fg/60 bg-ds-fg/[0.03] border-ds-border/8",
        outline:
          "text-ds-fg/80 bg-transparent border-ds-border/10",
        secondary:
          "text-ds-fg/90 bg-ds-surface-2 border-ds-border/8",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  live?: boolean;
}

function Badge({
  className,
  variant,
  asChild = false,
  live = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  const liveColor =
    variant === "success"
      ? "bg-ds-emerald shadow-[0_0_6px_rgba(52,211,153,0.8)]"
      : variant === "destructive"
        ? "bg-ds-rose shadow-[0_0_6px_rgba(244,63,94,0.8)]"
        : variant === "warning"
          ? "bg-ds-amber shadow-[0_0_6px_rgba(251,191,36,0.8)]"
          : variant === "purple"
            ? "bg-ds-purple shadow-[0_0_6px_rgba(168,85,247,0.8)]"
            : "bg-ds-blue shadow-[0_0_6px_rgba(59,130,246,0.8)]";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {live && <span className={cn("w-1 h-1 rounded-ds-full animate-pulse", liveColor)} />}
      {children}
    </Comp>
  );
}

export { Badge, badgeVariants };
