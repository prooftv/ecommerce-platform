"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/cn";
import type { OperationsNavItem } from "@ecommerce/types";

interface AppSidebarProps {
  items: OperationsNavItem[];
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

function AppSidebar({ items, logo, footer, className }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex h-full w-60 flex-col border-r bg-background", className)}>
      {logo && (
        <div className="flex h-14 items-center border-b px-4 shrink-0">
          {logo}
        </div>
      )}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <span className="flex-1">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {footer && (
        <div className="border-t p-4 shrink-0">
          {footer}
        </div>
      )}
    </aside>
  );
}

export { AppSidebar };
