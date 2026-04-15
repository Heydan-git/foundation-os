"use client";

/**
 * Toggle — Radix primitive.
 * Absent du template (Toggle individuel) → style Void Glass aligne sur
 * les toggles de section "Toggles & Sliders" (bg accent/15 + border accent/30 + glow).
 *
 * Variants :
 *   - default : off = bg-transparent (hover bg-ds-fg/[0.04])
 *               on  = bg-ds-blue/15 text-ds-blue border-ds-blue/30 + glow
 *   - outline : off = border-ds-border/8 bg-transparent
 *               on  = bg-ds-blue/15 text-ds-blue border-ds-blue/30 + glow
 *
 * Sizes : xs / sm / default / lg (text-ds-xs/sm/base/lg, height 24/28/32/36).
 */
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const toggleVariants = cva(
  [
    "inline-flex items-center justify-center gap-ds-1_5 rounded-ds-md font-mono whitespace-nowrap transition-all outline-none",
    "border border-transparent text-ds-fg/60",
    "hover:bg-ds-fg/[0.04] hover:text-ds-fg/90",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
    "focus-visible:ring-2 focus-visible:ring-ds-blue/40",
    "aria-invalid:border-ds-rose/30",
    "data-[state=on]:bg-ds-blue/15 data-[state=on]:text-ds-blue data-[state=on]:border-ds-blue/30 data-[state=on]:shadow-[0_0_12px_rgba(96,165,250,0.15)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "bg-transparent border-ds-border/8 hover:border-ds-border/15",
      },
      size: {
        xs: "h-6 min-w-6 px-ds-1_5 text-ds-xs",
        sm: "h-7 min-w-7 px-ds-2 text-ds-sm",
        default: "h-8 min-w-8 px-ds-2 text-ds-base",
        lg: "h-9 min-w-9 px-ds-2_5 text-ds-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
