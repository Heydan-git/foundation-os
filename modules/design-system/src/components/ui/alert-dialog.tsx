"use client";

/**
 * AlertDialog — iso Dialog pattern + destructive-oriented buttons.
 * Derived from `DashboardDesignSystem.tsx` Modal/Dialog section (lines 1141-1188)
 * with buttons adapted from alert/button variants (rose bar + glass cancel).
 *
 * AlertDialogAction  : bg-ds-rose text-ds-surface-0 hover shadow glow rose
 * AlertDialogCancel  : bg-ds-fg/[0.03] border ds-border/8 text-ds-fg/80
 */
import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "./utils";

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "fixed top-[50%] left-[50%] z-[100] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg bg-ds-surface-2 border border-ds-border/10 rounded-ds-xl shadow-[var(--ds-shadow-modal)] p-ds-6 outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200",
          className,
        )}
        {...props}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ds-rose/40 to-transparent" />
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-ds-2 mb-ds-4", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("flex justify-end gap-ds-2 mt-ds-4", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-ds-lg text-ds-fg/90 leading-tight", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-ds-sm text-ds-fg/60 leading-relaxed", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(
        "inline-flex items-center justify-center px-ds-4 py-ds-2 rounded-ds-md bg-ds-rose text-ds-surface-0 text-ds-base hover:bg-ds-rose/90 shadow-[0_0_12px_rgba(244,63,94,0.2)] hover:shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-ds-rose/40 disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(
        "inline-flex items-center justify-center px-ds-4 py-ds-2 rounded-ds-md bg-ds-fg/[0.03] border border-ds-border/8 text-ds-base text-ds-fg/80 hover:bg-ds-fg/8 hover:border-ds-border/15 transition-all active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-ds-blue/40 disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
