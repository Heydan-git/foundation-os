"use client";

/**
 * AspectRatio — passthrough Radix (`@radix-ui/react-aspect-ratio`).
 * Trivial : aucun style, juste `data-slot` pour targeting.
 */
import * as React from "react";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
