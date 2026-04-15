"use client";

/**
 * Toaster (sonner) — iso `base DS/src/app/components/DashboardDesignSystem.tsx`
 * section "Toasts (Variantes)" (lines 1108-1129).
 * Variants : success / error / warning / info via toastOptions.classNames.
 *   - base    : bg-ds-surface-2/95 + border ds-border/8 + shadow card + rounded ds-lg
 *   - title   : text-ds-md ds-fg/90
 *   - desc    : text-ds-xs ds-fg/50
 *   - success : bg-ds-emerald/10 + border ds-emerald/20 + text ds-emerald
 *   - error   : bg-ds-rose/10    + border ds-rose/20    + text ds-rose
 *   - warning : bg-ds-amber/10   + border ds-amber/20   + text ds-amber
 *   - info    : bg-ds-blue/10    + border ds-blue/20    + text ds-blue
 */
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-ds-surface-2/95 border border-ds-border/8 shadow-[0_4px_20px_rgba(0,0,0,0.3)] rounded-ds-lg p-ds-2_5 flex items-start gap-ds-2_5",
          title: "text-ds-md text-ds-fg/90",
          description: "text-ds-xs text-ds-fg/50 mt-0.5",
          actionButton:
            "bg-ds-fg text-ds-surface-0 rounded-ds-sm px-ds-2 py-ds-1 text-ds-xs hover:bg-ds-fg/90 transition-colors",
          cancelButton:
            "bg-ds-fg/[0.03] border border-ds-border/8 text-ds-fg/70 rounded-ds-sm px-ds-2 py-ds-1 text-ds-xs hover:bg-ds-fg/8 transition-colors",
          success:
            "!bg-ds-emerald/10 !border-ds-emerald/20 !text-ds-emerald",
          error:
            "!bg-ds-rose/10 !border-ds-rose/20 !text-ds-rose",
          warning:
            "!bg-ds-amber/10 !border-ds-amber/20 !text-ds-amber",
          info:
            "!bg-ds-blue/10 !border-ds-blue/20 !text-ds-blue",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
