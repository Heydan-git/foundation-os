"use client";

/**
 * Slider — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * (section "Toggles & Sliders", lines 718-732).
 *
 * Custom HTML (not Radix) pour matcher EXACTEMENT le rendu template :
 *   - track gradient : linear-gradient blue 0% -> value% -> ds-surface-1
 *   - thumb : w-3 h-3 bg-ds-fg border-2 ds-blue shadow glow white
 *   - single-value range input (shadcn Slider etait multi-value, ici on simplifie iso).
 * API : value | defaultValue | min | max | step | onValueChange | disabled | id | className.
 */
import * as React from "react";

import { cn } from "./utils";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-label"?: string;
}

function Slider({
  value: controlled,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  id,
  className,
  ...props
}: SliderProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const isControlled = controlled !== undefined;
  const val = isControlled ? controlled : internal;
  const pct = ((val - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={val}
      onChange={handleChange}
      disabled={disabled}
      id={id}
      data-slot="slider"
      className={cn(
        "w-full h-1.5 bg-ds-surface-1 rounded-ds-full appearance-none cursor-pointer",
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3",
        "[&::-webkit-slider-thumb]:bg-ds-fg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ds-blue",
        "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(255,255,255,0.5)]",
        "[&::-webkit-slider-thumb]:cursor-pointer",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
      style={{
        background: `linear-gradient(to right, rgba(59,130,246,0.5) 0%, rgba(59,130,246,1) ${pct}%, #050505 ${pct}%)`,
      }}
      {...props}
    />
  );
}

export { Slider };
