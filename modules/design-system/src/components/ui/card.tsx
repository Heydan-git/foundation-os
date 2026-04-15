"use client";

/**
 * Card — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * GlassCard helper (lines 45-50) :
 *   rounded-ds-xl bg-ds-surface-2/80 backdrop-blur-2xl border border-ds-border/5
 *   + hover border-ds-border/8 + hover shadow card
 *   + top gradient line (hover reveal)
 *   + optional glow (prop: glow="bg-ds-blue/10 top-[-20%] left-[-10%]")
 *
 * Sub-components : CardHeader / CardTitle / CardDescription / CardContent /
 * CardFooter / CardAction.
 */
import * as React from "react";

import { cn } from "./utils";

export interface CardProps extends React.ComponentProps<"div"> {
  /**
   * Glow class (e.g. "top-[-20%] left-[-10%] bg-ds-blue/10"). Adds a blurred
   * radial accent that fades in on hover, matching the template GlassCard.
   */
  glow?: string;
}

function Card({ className, glow, children, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-ds-xl bg-ds-surface-2/80 backdrop-blur-2xl border border-ds-border/5 relative overflow-hidden group hover:border-ds-border/8 hover:shadow-[var(--ds-shadow-card)] transition-all duration-500 flex flex-col gap-ds-4 p-ds-5",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ds-fg/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
      {glow && (
        <div
          className={cn(
            "absolute w-[40%] h-[40%] blur-[80px] rounded-ds-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0",
            glow,
          )}
        />
      )}
      <div className="relative z-10 flex flex-col gap-ds-4">{children}</div>
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-ds-1 has-[[data-slot=card-action]]:grid-cols-[1fr_auto]",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn(
        "text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono leading-none",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-ds-sm text-ds-fg/60 leading-relaxed", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col gap-ds-3", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
