"use client";

/**
 * Tabs — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * (section "Tabs", lines 897-923).
 *
 * Visual :
 *   - List    : border-b border-ds-border/5 + flex gap-0
 *   - Trigger : px-ds-3 py-ds-2 text-ds-md
 *               inactive : text-ds-fg/40 hover:text-ds-fg/70
 *               active   : text-ds-fg/90 + underline bar 2px bg-ds-blue
 *   - Content : pt-ds-3 outline-none
 *
 * Radix logic preserved for keyboard a11y + state. Active underline via
 * data-[state=active] CSS absolute pseudo-element (no motion layoutId
 * cross-component, since shadcn TabsTrigger is independent).
 */
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "flex gap-0 border-b border-ds-border/5",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative px-ds-3 py-ds-2 text-ds-md outline-none text-ds-fg/40 hover:text-ds-fg/70 data-[state=active]:text-ds-fg/90 transition-all",
        "after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[2px] after:bg-ds-blue after:scale-x-0 data-[state=active]:after:scale-x-100 after:origin-center after:transition-transform after:duration-300",
        "focus-visible:ring-2 focus-visible:ring-ds-blue/40 focus-visible:ring-offset-0 rounded-ds-sm",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("pt-ds-3 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
