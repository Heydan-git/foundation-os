"use client";

/**
 * Menubar — Void Glass custom (absent template). Reuses Dropdown visual language
 * from `DashboardDesignSystem.tsx` lines 949-960 for content panel + item styling.
 *
 * Root    : flex items-center gap-ds-1 rounded-ds-md border ds-border/8
 *           bg-ds-fg/[0.02] p-ds-1
 * Trigger : px-ds-3 py-ds-1_5 text-ds-sm text-ds-fg/70 hover ds-fg/[0.03]
 *           + state-open ds-fg/[0.06] + rounded ds-sm
 */
import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "./utils";

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex items-center gap-ds-1 rounded-ds-md border border-ds-border/8 bg-ds-fg/[0.02] p-ds-1",
        className,
      )}
      {...props}
    />
  );
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  );
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "px-ds-3 py-ds-1_5 text-ds-sm text-ds-fg/70 rounded-ds-sm cursor-pointer outline-none transition-colors select-none",
        "hover:text-ds-fg/90 hover:bg-ds-fg/[0.03]",
        "data-[state=open]:bg-ds-fg/[0.06] data-[state=open]:text-ds-fg/90",
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) bg-ds-surface-2 border border-ds-border/10 rounded-ds-lg shadow-[var(--ds-shadow-dropdown),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden p-ds-1 outline-none",
          "data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </MenubarPortal>
  );
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex items-center gap-ds-2 px-ds-3 py-ds-1_5 text-ds-base text-ds-fg/70 rounded-ds-sm cursor-pointer outline-none transition-colors select-none",
        "hover:bg-ds-fg/[0.03] hover:text-ds-fg/90 data-[highlighted]:bg-ds-fg/[0.03] data-[highlighted]:text-ds-fg/90",
        "data-[variant=destructive]:text-ds-rose data-[variant=destructive]:hover:bg-ds-rose/10 data-[variant=destructive]:data-[highlighted]:bg-ds-rose/10",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[inset]:pl-ds-8",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "relative flex items-center gap-ds-2 px-ds-3 py-ds-1_5 pl-ds-8 text-ds-base text-ds-fg/70 rounded-ds-sm cursor-pointer outline-none transition-colors select-none",
        "hover:bg-ds-fg/[0.03] hover:text-ds-fg/90 data-[highlighted]:bg-ds-fg/[0.03] data-[highlighted]:text-ds-fg/90",
        "data-[state=checked]:text-ds-blue",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-ds-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-3 text-ds-blue" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "relative flex items-center gap-ds-2 px-ds-3 py-ds-1_5 pl-ds-8 text-ds-base text-ds-fg/70 rounded-ds-sm cursor-pointer outline-none transition-colors select-none",
        "hover:bg-ds-fg/[0.03] hover:text-ds-fg/90 data-[highlighted]:bg-ds-fg/[0.03] data-[highlighted]:text-ds-fg/90",
        "data-[state=checked]:text-ds-blue",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-ds-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-ds-blue text-ds-blue" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-ds-3 py-ds-1_5 text-ds-xs uppercase tracking-wider text-ds-fg/40 font-mono data-[inset]:pl-ds-8",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("bg-ds-border/5 my-ds-1 h-px", className)}
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-ds-xs font-mono text-ds-fg/40 tracking-wider",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex items-center gap-ds-2 px-ds-3 py-ds-1_5 text-ds-base text-ds-fg/70 rounded-ds-sm cursor-pointer outline-none transition-colors select-none",
        "hover:bg-ds-fg/[0.03] hover:text-ds-fg/90 data-[highlighted]:bg-ds-fg/[0.03] data-[highlighted]:text-ds-fg/90",
        "data-[state=open]:bg-ds-fg/[0.06] data-[state=open]:text-ds-fg/90",
        "data-[inset]:pl-ds-8",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-3 text-ds-fg/40" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) bg-ds-surface-2 border border-ds-border/10 rounded-ds-lg shadow-[var(--ds-shadow-dropdown),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden p-ds-1 outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
