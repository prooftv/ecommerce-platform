"use client";

import { Button } from "@ecommerce/ui/base";
import { logoutAction } from "@/lib/actions/auth";
import type { OperationsSession } from "@ecommerce/types";

interface DashboardHeaderProps {
  user: OperationsSession["user"];
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6 shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{user.email}</span>
        <form action={logoutAction}>
          <Button variant="ghost" size="sm" type="submit">Sign out</Button>
        </form>
      </div>
    </header>
  );
}
