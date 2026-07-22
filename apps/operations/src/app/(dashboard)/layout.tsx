import { requireSession } from "@ecommerce/auth";
import { AppSidebar } from "@ecommerce/ui/dashboard";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { NAV_ITEMS } from "@/lib/nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession("/login");

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        items={NAV_ITEMS}
        logo={<span className="font-semibold text-sm">Operations</span>}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader user={session.user} />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
