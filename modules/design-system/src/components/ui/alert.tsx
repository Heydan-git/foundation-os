"use client";

/**
 * Alert — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * (section "Bannieres", lines 1085-1103).
 *
 * Variants :
 *   - default / info    : text-ds-blue    bg-ds-blue/10    border ds-blue/20    bar ds-blue/50
 *   - success           : text-ds-emerald bg-ds-emerald/10 border ds-emerald/20 bar ds-emerald/50
 *   - warning           : text-ds-amber   bg-ds-amber/10   border ds-amber/20   bar ds-amber/50
 *   - destructive       : text-ds-rose    bg-ds-rose/10    border ds-rose/20    bar ds-rose/50
 *
 * Structure : left absolute bar + icon + title + description (+ optional close).
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const alertVariants = cva(
  "relative w-full rounded-ds-lg border p-ds-3 flex gap-ds-3 overflow-hidden items-start [&>svg]:size-3.5 [&>svg]:shrink-0 [&>svg]:mt-0.5",
  {
    variants: {
      variant: {
        default: "bg-ds-blue/10 border-ds-blue/20 text-ds-blue",
        info: "bg-ds-blue/10 border-ds-blue/20 text-ds-blue",
        success: "bg-ds-emerald/10 border-ds-emerald/20 text-ds-emerald",
        warning: "bg-ds-amber/10 border-ds-amber/20 text-ds-amber",
        destructive: "bg-ds-rose/10 border-ds-rose/20 text-ds-rose",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const BAR_COLOR: Record<string, string> = {
  default: "bg-ds-blue/50",
  info: "bg-ds-blue/50",
  success: "bg-ds-emerald/50",
  warning: "bg-ds-amber/50",
  destructive: "bg-ds-rose/50",
};

export interface AlertProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof alertVariants> {}

function Alert({ className, variant = "default", children, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className={cn("absolute left-0 top-0 bottom-0 w-ds-1", BAR_COLOR[variant ?? "default"])} />
      {children}
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("text-ds-md text-ds-fg/90 leading-tight mb-0.5", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-ds-sm text-ds-fg/60 leading-relaxed", className)}
      {...props}
    />
  );
}

function AlertContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-content"
      className={cn("flex-1 min-w-0", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertContent };
