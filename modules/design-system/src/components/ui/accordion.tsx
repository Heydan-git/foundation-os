"use client";

/**
 * Accordion — iso mission DS rebuild spec (simple border-b style).
 *
 * Visual :
 *   - Item    : border-b border-ds-border/5
 *   - Trigger : flex flex-1 items-center justify-between py-ds-3 text-ds-base
 *               text-ds-fg/90 hover:text-ds-fg transition-colors outline-none
 *               [&[data-state=open]>svg]:rotate-180
 *   - Chevron : ChevronDown size-3.5 shrink-0 text-ds-fg/60 transition-transform duration-200
 *   - Content : pb-ds-3 text-ds-sm text-ds-fg/60
 *               animate-accordion-up / animate-accordion-down
 */
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "./utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-ds-border/5", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-center justify-between py-ds-3 text-ds-base text-ds-fg/90 hover:text-ds-fg transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="size-3.5 shrink-0 text-ds-fg/60 transition-transform duration-200"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-ds-3 text-ds-sm text-ds-fg/60", className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
