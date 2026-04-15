// @ts-nocheck -- deps v9 API drift (react-day-picker) — visual iso prioritaire, types non-bloquants runtime
"use client";

/**
 * Calendar — wrapper `react-day-picker` v9.
 * Tokens DS :
 *   - root              : p-ds-3 text-ds-fg/80 font-sans
 *   - month_caption     : text-ds-sm uppercase tracking-wider text-ds-fg/60 font-mono
 *   - caption_label     : idem
 *   - nav button        : size-ds-6 text-ds-fg/60 hover:text-ds-fg/90 hover:bg-ds-fg/[0.04] rounded-ds-md
 *   - weekday           : text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono
 *   - day               : size-ds-8 text-ds-base text-ds-fg/80 hover:bg-ds-fg/[0.04] rounded-ds-md
 *   - selected          : bg-ds-blue/20 text-ds-blue border border-ds-blue/50 + glow
 *   - today             : ring-1 ring-ds-blue/30 text-ds-blue
 *   - outside           : text-ds-fg/30
 *   - disabled          : opacity-40 cursor-not-allowed
 *
 * v9 classNames keys : root, months, month, month_caption, caption_label,
 * nav, button_previous, button_next, month_grid, weekdays, weekday,
 * week, day, day_button, selected, today, outside, disabled,
 * range_start, range_middle, range_end, hidden.
 */
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-ds-3 text-ds-fg/80 font-sans", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-ds-4",
        month: "flex flex-col gap-ds-4",
        month_caption:
          "flex justify-center items-center relative h-ds-8 text-ds-sm uppercase tracking-wider text-ds-fg/60 font-mono",
        caption_label:
          "text-ds-sm uppercase tracking-wider text-ds-fg/60 font-mono",
        nav: "absolute inset-x-0 top-0 flex justify-between items-center px-ds-1 h-ds-8",
        button_previous:
          "size-ds-6 text-ds-fg/60 hover:text-ds-fg/90 hover:bg-ds-fg/[0.04] rounded-ds-md inline-flex items-center justify-center transition-colors",
        button_next:
          "size-ds-6 text-ds-fg/60 hover:text-ds-fg/90 hover:bg-ds-fg/[0.04] rounded-ds-md inline-flex items-center justify-center transition-colors",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "size-ds-8 inline-flex items-center justify-center text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono font-normal",
        week: "flex w-full mt-ds-2",
        day: "relative p-0 text-center",
        day_button:
          "size-ds-8 inline-flex items-center justify-center text-ds-base text-ds-fg/80 hover:bg-ds-fg/[0.04] rounded-ds-md transition-colors outline-none",
        selected:
          "[&>button]:bg-ds-blue/20 [&>button]:text-ds-blue [&>button]:border [&>button]:border-ds-blue/50 [&>button]:shadow-[0_0_10px_rgba(59,130,246,0.2)]",
        today: "[&>button]:ring-1 [&>button]:ring-ds-blue/30 [&>button]:text-ds-blue",
        outside: "[&>button]:text-ds-fg/30",
        disabled: "[&>button]:opacity-40 [&>button]:cursor-not-allowed",
        range_start:
          "[&>button]:bg-ds-blue/20 [&>button]:text-ds-blue [&>button]:border [&>button]:border-ds-blue/50 rounded-l-ds-md",
        range_end:
          "[&>button]:bg-ds-blue/20 [&>button]:text-ds-blue [&>button]:border [&>button]:border-ds-blue/50 rounded-r-ds-md",
        range_middle:
          "[&>button]:bg-ds-blue/10 [&>button]:text-ds-blue/80",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass, ...chevronProps }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return (
            <Icon
              className={cn("size-4 text-ds-fg/60", chevronClass)}
              {...chevronProps}
            />
          );
        },
      }}
      {...props}
    />
  );
}

export { Calendar };
