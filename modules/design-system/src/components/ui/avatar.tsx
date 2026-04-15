"use client";

/**
 * Avatar — iso `DashboardDesignSystem.tsx` "Avatars & Groupes" (lignes 1349-1375).
 *
 * Iso template :
 *   - Size default  : w-ds-8 h-ds-8 rounded-ds-full (32px, utilisee dans groupes)
 *   - Image         : object-cover (aspect-square size-full)
 *   - Fallback      : bg-ds-surface-1 border border-ds-border/8 text-ds-fg/80
 *                     font-mono text-ds-sm uppercase
 *   - Surcharge OK via `className` : h-8 w-8, bg-ds-blue/20 text-ds-blue, etc.
 *                     Template utilise aussi des gradients (from-ds-purple/30
 *                     to-ds-blue/30) en override.
 */
import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "./utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex w-ds-8 h-ds-8 shrink-0 overflow-hidden rounded-ds-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-ds-full bg-ds-surface-1 border border-ds-border/8 text-ds-fg/80 font-mono text-ds-sm uppercase",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
