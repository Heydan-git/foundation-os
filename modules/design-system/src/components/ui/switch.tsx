"use client";

/**
 * Switch — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * (section "Toggles & Sliders", lines 682-716).
 *
 * Custom HTML (not Radix) pour matcher EXACTEMENT le rendu template :
 *   - on  : bg-ds-emerald/20 + border ds-emerald/30 + shadow glow emerald
 *           thumb bg-ds-emerald + shadow glow emerald, translate 19px
 *   - off : bg-ds-surface-1 + border ds-border/10 + inset shadow
 *           thumb bg-ds-fg/30, translate 3px
 * API : checked | defaultChecked | onCheckedChange | disabled | id | className.
 */
import * as React from "react";
import { motion } from "motion/react";

import { cn } from "./utils";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

function Switch({
  checked: controlled,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  id,
  className,
  ...props
}: SwitchProps) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isControlled = controlled !== undefined;
  const isOn = isControlled ? controlled : internal;

  const handleClick = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-disabled={disabled}
      id={id}
      data-slot="switch"
      data-state={isOn ? "checked" : "unchecked"}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "w-9 h-5 rounded-ds-full relative transition-all duration-300 shrink-0",
        isOn
          ? "bg-ds-emerald/20 border border-ds-emerald/30 shadow-[0_0_10px_rgba(52,211,153,0.1)]"
          : "bg-ds-surface-1 border border-ds-border/10 hover:border-ds-border/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]",
        disabled && "cursor-not-allowed opacity-40",
        !disabled && "cursor-pointer",
        className,
      )}
      {...props}
    >
      <motion.div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-ds-full transition-colors",
          isOn
            ? "bg-ds-emerald shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            : "bg-ds-fg/30",
        )}
        animate={{ left: isOn ? 19 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export { Switch };
