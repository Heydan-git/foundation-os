"use client";

/**
 * Command — cmdk palette derive base DS (Void Glass fork).
 * Container : bg-ds-surface-2 + border ds-border/8 + rounded ds-lg + shadow dropdown.
 * Input : border-b ds-border/5 + transparent + text ds-base + placeholder ds-fg/30.
 * Item : text ds-fg/70 + hover bg ds-fg/[0.03] + selected bg ds-fg/[0.06] + text ds-fg/90.
 * Group heading : uppercase mono xs ds-fg/40.
 * Shortcut : ml-auto mono xs ds-fg/40.
 */
import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { cn } from "./utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-ds-lg bg-ds-surface-2 border border-ds-border/8 text-ds-fg/90 shadow-[var(--ds-shadow-dropdown)]",
        className,
      )}
      {...props}
    />
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string;
  description?: string;
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:text-ds-fg/40 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-ds-3 [&_[cmdk-group-heading]]:py-ds-2 [&_[cmdk-group]]:px-ds-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-ds-3 [&_[cmdk-item]]:py-ds-2_5 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex items-center gap-ds-2 border-b border-ds-border/5 px-ds-3 py-ds-2_5"
    >
      <SearchIcon className="size-4 shrink-0 text-ds-fg/40" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex w-full bg-transparent text-ds-base text-ds-fg/90 placeholder:text-ds-fg/30 outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-ds-6 text-center text-ds-sm text-ds-fg/40"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-ds-1 text-ds-fg/90 [&_[cmdk-group-heading]]:text-ds-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-ds-fg/40 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:px-ds-3 [&_[cmdk-group-heading]]:py-ds-2",
        className,
      )}
      {...props}
    />
  );
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("h-px bg-ds-border/5", className)}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-ds-2 rounded-ds-md px-ds-3 py-ds-2 text-ds-sm text-ds-fg/70 outline-hidden transition-colors",
        "hover:bg-ds-fg/[0.03]",
        "aria-selected:bg-ds-fg/[0.06] aria-selected:text-ds-fg/90",
        "data-[selected=true]:bg-ds-fg/[0.06] data-[selected=true]:text-ds-fg/90",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-ds-fg/40",
        className,
      )}
      {...props}
    />
  );
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-ds-xs font-mono text-ds-fg/40 tracking-wider",
        className,
      )}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
