"use client";

/**
 * Select — iso `DashboardDesignSystem.tsx` lines 926-962 section "Select / Dropdown".
 *
 * Trigger (lines 930-941) :
 *   w-full flex items-center justify-between px-ds-3 py-ds-2 bg-ds-surface-1
 *   border ds-border/8 hover:border ds-border/15 rounded-ds-md text-ds-base
 *   text-ds-fg/90 shadow inset + open: border ds-blue/50 + glow blue
 *
 * Content (lines 949-960) :
 *   bg-ds-surface-2 border ds-border/10 rounded-ds-lg shadow dropdown + inset highlight
 *
 * Item :
 *   px-ds-3 py-ds-2 text-ds-base text-ds-fg/70 hover ds-fg/[0.03]
 *   selected: bg ds-blue/10 text ds-blue + Check icon ds-blue
 */
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

import { cn } from "./utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "w-full flex items-center justify-between gap-ds-2 px-ds-3 py-ds-2 bg-ds-surface-1 border border-ds-border/8 hover:border-ds-border/15 rounded-ds-md text-ds-base text-ds-fg/90 shadow-[var(--ds-shadow-inset)] data-[state=open]:border-ds-blue/50 data-[state=open]:shadow-[0_0_12px_rgba(59,130,246,0.1)] transition-all outline-none focus-visible:border-ds-blue/50 focus-visible:shadow-[0_0_12px_rgba(59,130,246,0.1)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
        "data-[size=default]:h-9 data-[size=sm]:h-8",
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-ds-2",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-3 text-ds-fg/40 data-[state=open]:rotate-180 transition-transform" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) bg-ds-surface-2 border border-ds-border/10 rounded-ds-lg shadow-[var(--ds-shadow-dropdown),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-ds-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-ds-3 py-ds-1_5 text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative w-full flex items-center justify-between gap-ds-2 px-ds-3 py-ds-2 text-ds-base text-ds-fg/70 rounded-ds-sm outline-none cursor-pointer transition-colors select-none",
        "hover:bg-ds-fg/[0.03] data-[highlighted]:bg-ds-fg/[0.03]",
        "data-[state=checked]:bg-ds-blue/10 data-[state=checked]:text-ds-blue",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        "*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-ds-2",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-3 text-ds-blue" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-ds-1 h-px bg-ds-border/5", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-ds-1 text-ds-fg/40",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-3" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-ds-1 text-ds-fg/40",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-3" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
