import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Tailwind-merge etendu pour reconnaitre les tokens DS custom (font-size, text-color,
 * spacing, radius, colors, shadows). Sans cette extension, `cn(text-ds-sm, text-ds-fg/60)`
 * voit `text-*` prefix et dedupe a tort — il supprime la font-size OU la color.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "ds-2xs",
            "ds-xs",
            "ds-sm",
            "ds-md",
            "ds-base",
            "ds-lg",
            "ds-xl",
            "ds-2xl",
            "ds-display",
          ],
        },
      ],
      "text-color": [
        { text: ["ds-fg", "ds-blue", "ds-purple", "ds-emerald", "ds-amber", "ds-rose", "ds-cyan", "ds-teal", "ds-sky", "ds-violet", "ds-indigo", "ds-orange", "ds-surface-0", "ds-surface-1", "ds-surface-2", "ds-surface-3"] },
      ],
      "bg-color": [
        { bg: ["ds-fg", "ds-blue", "ds-purple", "ds-emerald", "ds-amber", "ds-rose", "ds-cyan", "ds-teal", "ds-sky", "ds-violet", "ds-indigo", "ds-orange", "ds-surface-0", "ds-surface-1", "ds-surface-2", "ds-surface-3", "ds-border"] },
      ],
      "border-color": [
        { border: ["ds-fg", "ds-blue", "ds-purple", "ds-emerald", "ds-amber", "ds-rose", "ds-cyan", "ds-teal", "ds-sky", "ds-violet", "ds-indigo", "ds-orange", "ds-surface-0", "ds-surface-1", "ds-surface-2", "ds-surface-3", "ds-border"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
