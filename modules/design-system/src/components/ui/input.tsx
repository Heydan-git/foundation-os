"use client";

/**
 * Input — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * (sections "Inputs" lines 503-525 + "Champs Texte" states lines 572-611).
 *
 * States :
 *   - default         : bg-ds-surface-1 border ds-border/8 + inset shadow + focus:border-ds-blue/50
 *   - aria-invalid    : border-ds-rose/30 + inset+rose glow shadow + focus:border-ds-rose/50
 *   - data-success    : border-ds-emerald/30 + inset+emerald glow shadow + focus:border-ds-emerald/50
 *   - disabled        : bg-ds-surface-1/50 border ds-border/[0.04] text-ds-fg/30
 */
import * as React from "react";

import { cn } from "./utils";

export interface InputProps extends React.ComponentProps<"input"> {
  success?: boolean;
}

function Input({ className, type, success, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      data-success={success ? "true" : undefined}
      className={cn(
        "w-full bg-ds-surface-1 border rounded-ds-md px-ds-3 py-ds-2 text-ds-base font-sans font-normal text-ds-fg/90 placeholder:text-ds-fg/30 shadow-[var(--ds-shadow-inset)] outline-none transition-all",
        // default border + focus
        "border-ds-border/8 hover:border-ds-border/15 focus:border-ds-blue/50",
        // success
        "data-[success=true]:border-ds-emerald/30 data-[success=true]:shadow-[var(--ds-shadow-inset),0_0_10px_rgba(52,211,153,0.1)] data-[success=true]:focus:border-ds-emerald/50",
        // error (aria-invalid)
        "aria-invalid:border-ds-rose/30 aria-invalid:shadow-[var(--ds-shadow-inset),0_0_10px_rgba(244,63,94,0.1)] aria-invalid:focus:border-ds-rose/50",
        // disabled
        "disabled:bg-ds-surface-1/50 disabled:border-ds-border/[0.04] disabled:text-ds-fg/30 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
