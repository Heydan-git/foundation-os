"use client";

/**
 * Button — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * (section "Buttons", lines 419-476).
 *
 * Variants (from template) :
 *   - default    : bg-ds-fg text-ds-surface-0 + shadow glow white
 *   - glass      : bg-ds-fg/[0.03] + border ds-border/8 + inset shadow
 *   - gradient   : bg-gradient blue->purple + border ds-blue/20 + glow blue
 *   - success    : bg-ds-emerald/10 + border ds-emerald/20 + text emerald + glow
 *   - danger     : bg-ds-rose/10 + border ds-rose/20 + text rose + glow
 *   - ghost      : transparent hover bg-ds-fg/[0.03]
 *   - link       : text-ds-blue underline ds-blue/30
 *   - icon       : p-ds-2 bg-ds-fg/[0.03] border ds-border/8 (no label)
 *
 * Sizes (from template) :
 *   - xs  : px-ds-2 py-ds-1 text-ds-xs rounded-ds-sm
 *   - sm  : px-ds-3 py-ds-1_5 text-ds-sm rounded-ds-md
 *   - md  : px-ds-3 py-ds-2 text-ds-base rounded-ds-md (default)
 *   - lg  : px-ds-4 py-ds-2 text-ds-base rounded-ds-lg
 *   - xl  : px-ds-5 py-ds-2_5 text-ds-base rounded-ds-lg
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-ds-2 whitespace-nowrap transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ds-blue/40",
  {
    variants: {
      variant: {
        default:
          "bg-ds-fg text-ds-surface-0 hover:bg-ds-fg/90 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]",
        glass:
          "bg-ds-fg/[0.03] border border-ds-border/8 hover:bg-ds-fg/8 hover:border-ds-border/15 text-ds-fg/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
        gradient:
          "bg-gradient-to-r from-ds-blue/10 to-ds-purple/10 border border-ds-blue/20 hover:border-ds-blue/40 text-ds-blue shadow-[0_0_10px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]",
        success:
          "bg-ds-emerald/10 border border-ds-emerald/20 hover:bg-ds-emerald/20 text-ds-emerald shadow-[0_0_10px_rgba(52,211,153,0.1)]",
        destructive:
          "bg-ds-rose/10 border border-ds-rose/20 hover:bg-ds-rose/20 text-ds-rose shadow-[0_0_10px_rgba(244,63,94,0.1)]",
        ghost:
          "text-ds-fg/40 hover:text-ds-fg/90 hover:bg-ds-fg/[0.03] border border-transparent hover:border-ds-border/5",
        link: "text-ds-blue hover:text-ds-blue/80 underline underline-offset-2 decoration-ds-blue/30 hover:decoration-ds-blue/60 shadow-none",
        outline:
          "bg-transparent border border-ds-border/10 hover:bg-ds-fg/[0.04] hover:border-ds-border/20 text-ds-fg/90",
        secondary:
          "bg-ds-surface-2 border border-ds-border/8 hover:bg-ds-fg/[0.04] text-ds-fg/90",
        icon:
          "bg-ds-fg/[0.03] border border-ds-border/8 hover:bg-ds-fg/8 hover:border-ds-border/15 text-ds-fg/60 hover:text-ds-fg/90",
      },
      size: {
        xs: "px-ds-2 py-ds-1 text-ds-xs rounded-ds-sm",
        sm: "px-ds-3 py-ds-1_5 text-ds-sm rounded-ds-md",
        default: "px-ds-3 py-ds-2 text-ds-base rounded-ds-md",
        lg: "px-ds-4 py-ds-2 text-ds-base rounded-ds-lg",
        xl: "px-ds-5 py-ds-2_5 text-ds-base rounded-ds-lg",
        icon: "p-ds-2 rounded-ds-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || loading;

  return (
    <Comp
      data-slot="button"
      disabled={isDisabled}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="size-3.5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
