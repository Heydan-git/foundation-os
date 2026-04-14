"use client";

/**
 * RadioGroup — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * (section "Selection (interactif)" > Radio Buttons, lines 649-677).
 *
 * Custom HTML (not Radix) pour matcher EXACTEMENT le rendu template :
 *   - selected   : bg-ds-surface-1 + border ds-purple/50 + shadow glow purple
 *                  inner dot bg-ds-purple + shadow glow purple
 *   - unselected : bg-ds-surface-1 + border ds-border/10 + inset shadow
 * API : value | defaultValue | onValueChange | disabled | className.
 *        RadioGroupItem : value | id | disabled.
 */
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";

import { cn } from "./utils";

type RadioContextT = {
  value: string | undefined;
  setValue: (v: string) => void;
  disabled?: boolean;
};

const RadioContext = React.createContext<RadioContextT | null>(null);

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function RadioGroup({
  value: controlled,
  defaultValue,
  onValueChange,
  disabled,
  children,
  className,
}: RadioGroupProps) {
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const isControlled = controlled !== undefined;
  const current = isControlled ? controlled : internal;

  const setValue = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternal(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange],
  );

  return (
    <RadioContext.Provider value={{ value: current, setValue, disabled }}>
      <div role="radiogroup" className={cn("space-y-ds-3", className)}>
        {children}
      </div>
    </RadioContext.Provider>
  );
}

export interface RadioGroupItemProps {
  value: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

function RadioGroupItem({ value, id, disabled, className }: RadioGroupItemProps) {
  const ctx = React.useContext(RadioContext);
  const isGroupDisabled = ctx?.disabled ?? false;
  const isDisabled = disabled ?? isGroupDisabled;
  const isSelected = ctx?.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-disabled={isDisabled}
      id={id}
      data-slot="radio-group-item"
      data-state={isSelected ? "checked" : "unchecked"}
      onClick={() => !isDisabled && ctx?.setValue(value)}
      disabled={isDisabled}
      className={cn(
        "w-ds-4 h-ds-4 rounded-ds-full flex items-center justify-center transition-all shrink-0",
        isSelected
          ? "bg-ds-surface-1 border border-ds-purple/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
          : "bg-ds-surface-1 border border-ds-border/10 hover:border-ds-border/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]",
        isDisabled && "cursor-not-allowed opacity-40",
        !isDisabled && "cursor-pointer",
        className,
      )}
    >
      <AnimatePresence>
        {isSelected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="w-ds-2 h-ds-2 rounded-ds-full bg-ds-purple shadow-[0_0_5px_rgba(168,85,247,0.8)]"
          />
        )}
      </AnimatePresence>
    </button>
  );
}

export { RadioGroup, RadioGroupItem };
