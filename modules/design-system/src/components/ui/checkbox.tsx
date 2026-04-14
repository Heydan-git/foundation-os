"use client";

/**
 * Checkbox — iso `base DS/src/app/components/DashboardDesignSystem.tsx` (section "Selection (interactif)", lines 612-648).
 * Custom HTML (not Radix) pour matcher EXACTEMENT le rendu template :
 *   - checked  : bg-ds-blue/20 + border ds-blue/50 + glow shadow + Check icon ds-blue
 *   - unchecked: bg-ds-surface-1 + border ds-border/10 + inset shadow
 * API : checked | defaultChecked | onCheckedChange | disabled | className | id.
 */
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

import { cn } from "./utils";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

function Checkbox({
  checked: controlled,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  id,
  className,
  ...props
}: CheckboxProps) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isControlled = controlled !== undefined;
  const isChecked = isControlled ? controlled : internal;

  const handleClick = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={disabled}
      id={id}
      data-slot="checkbox"
      data-state={isChecked ? "checked" : "unchecked"}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "w-ds-4 h-ds-4 rounded-ds-sm flex items-center justify-center transition-all shrink-0",
        isChecked
          ? "bg-ds-blue/20 border border-ds-blue/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
          : "bg-ds-surface-1 border border-ds-border/10 hover:border-ds-border/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]",
        disabled && "cursor-not-allowed opacity-40",
        !disabled && "cursor-pointer",
        className,
      )}
      {...props}
    >
      <AnimatePresence>
        {isChecked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check size={10} strokeWidth={3} className="text-ds-blue" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export { Checkbox };
