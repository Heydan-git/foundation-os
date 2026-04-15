"use client";

/**
 * InputOTP — wrapper `input-otp` package.
 * Absent du template `DashboardDesignSystem.tsx` → style Void Glass aligne
 * sur Input : surface-1 + border ds-border/8 + inset shadow + focus ds-blue.
 *
 * Tokens :
 *   - Slot default : w-ds-8 h-ds-8 bg-ds-surface-1 border-ds-border/8
 *                    rounded-ds-md text-ds-lg text-ds-fg font-mono
 *                    shadow [var(--ds-shadow-inset)]
 *   - Active slot  : border-ds-blue/50 + glow ds-blue/10
 *   - Caret        : bg-ds-fg (animate-caret-blink)
 *   - Separator    : text-ds-fg/30
 */
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-react";

import { cn } from "./utils";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-ds-2 has-[:disabled]:opacity-50",
        containerClassName,
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center gap-ds-1", className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative flex items-center justify-center w-ds-8 h-ds-8 bg-ds-surface-1 border border-ds-border/8 rounded-ds-md text-ds-lg text-ds-fg font-mono shadow-[var(--ds-shadow-inset)] transition-all outline-none",
        "data-[active=true]:z-10 data-[active=true]:border-ds-blue/50 data-[active=true]:shadow-[var(--ds-shadow-inset),0_0_10px_rgba(96,165,250,0.15)]",
        "aria-invalid:border-ds-rose/50 data-[active=true]:aria-invalid:border-ds-rose/60",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-ds-fg h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn(
        "flex items-center justify-center text-ds-fg/30",
        className,
      )}
      {...props}
    >
      <Minus size={10} />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
