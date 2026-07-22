import type { Metadata } from "next";
import { requireSession } from "@ecommerce/auth";
import { PageHeader, MetricCard, EmptyState } from "@ecommerce/ui/dashboard";

export const metadata: Metadata = { title: "Overview" };

export default async function DashboardPage() {
  const session = await requireSession();

  // getDashboardSummary(session.accessToken) — wires in when Laravel is live
  return (
    <div>
      <PageHeader
        title="Overview"
        description={`Welcome back, ${session.user.name || session.user.email}`}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Orders today" value="—" description="Awaiting Laravel API" />
        <MetricCard title="Revenue today" value="—" description="Awaiting Laravel API" />
        <MetricCard title="Orders this month" value="—" description="Awaiting Laravel API" />
        <MetricCard title="New customers" value="—" description="Awaiting Laravel API" />
      </div>
    </div>
  );
}
