"use client";

/**
 * Pagination — inspire des lignes 1448-1466 de `DashboardDesignSystem.tsx`
 * (pagination de table).
 *
 * Iso template :
 *   - Chevrons : size 10 text-ds-fg/40
 *   - Link     : text-ds-fg/70 hover:text-ds-fg/90 rounded-ds-md px-ds-3 py-ds-1_5
 *                hover:bg-ds-fg/[0.03]
 *   - Active   : bg-ds-blue/10 text-ds-blue border border-ds-blue/20
 *                shadow [0_0_10px_rgba(59,130,246,0.1)]
 *   - Ellipsis : text-ds-fg/30 font-mono
 */
import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "./utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-ds-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "inline-flex items-center justify-center rounded-ds-md px-ds-3 py-ds-1_5 text-ds-sm font-mono transition-all",
        isActive
          ? "bg-ds-blue/10 text-ds-blue border border-ds-blue/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
          : "text-ds-fg/70 hover:text-ds-fg/90 hover:bg-ds-fg/[0.03] border border-transparent",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("gap-ds-1 px-ds-2_5", className)}
      {...props}
    >
      <ChevronLeft size={10} className="text-ds-fg/40" />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("gap-ds-1 px-ds-2_5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRight size={10} className="text-ds-fg/40" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex items-center justify-center px-ds-2 text-ds-fg/30 font-mono text-ds-sm",
        className,
      )}
      {...props}
    >
      <MoreHorizontal size={10} />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
