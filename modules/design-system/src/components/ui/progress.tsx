"use client";

/**
 * Progress — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * (section "Jauges", lines 527-570).
 *
 * Linear bar :
 *   - track : h-ds-1_5 bg-ds-surface-1 + border ds-border/5 + rounded-full
 *   - fill  : gradient from-<accent> to-<accent>/70 + glow shadow matching accent
 *             + white tip blur on right edge
 * Color variants : blue | purple (default) | emerald | amber | rose.
 */
import * as React from "react";
import { motion } from "motion/react";

import { cn } from "./utils";

const ACCENTS = {
  blue: {
    gradient: "from-ds-blue to-ds-blue/70",
    shadow: "shadow-[0_0_10px_rgba(59,130,246,0.3)]",
  },
  purple: {
    gradient: "from-ds-purple to-ds-purple/70",
    shadow: "shadow-[0_0_10px_rgba(168,85,247,0.3)]",
  },
  emerald: {
    gradient: "from-ds-emerald to-ds-emerald/70",
    shadow: "shadow-[0_0_10px_rgba(52,211,153,0.3)]",
  },
  amber: {
    gradient: "from-ds-amber to-ds-amber/70",
    shadow: "shadow-[0_0_10px_rgba(251,191,36,0.3)]",
  },
  rose: {
    gradient: "from-ds-rose to-ds-rose/70",
    shadow: "shadow-[0_0_10px_rgba(244,63,94,0.3)]",
  },
} as const;

export type ProgressColor = keyof typeof ACCENTS;

export interface ProgressProps extends React.ComponentProps<"div"> {
  value?: number;
  color?: ProgressColor;
}

function Progress({ className, value = 0, color = "purple", ...props }: ProgressProps) {
  const v = Math.max(0, Math.min(100, value));
  const accent = ACCENTS[color];

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-ds-1_5 w-full bg-ds-surface-1 rounded-ds-full overflow-hidden border border-ds-border/5",
        className,
      )}
      {...props}
    >
      <motion.div
        className={cn(
          "h-full bg-gradient-to-r rounded-ds-full relative",
          accent.gradient,
          accent.shadow,
        )}
        initial={{ width: "0%" }}
        animate={{ width: `${v}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-ds-fg/50 blur-[2px]" />
      </motion.div>
    </div>
  );
}

export { Progress };
