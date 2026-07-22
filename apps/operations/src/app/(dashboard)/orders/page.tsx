import type { Metadata } from "next";
import { PageHeader, EmptyState } from "@ecommerce/ui/dashboard";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <div>
      <PageHeader title="Orders" description="Manage and track customer orders" />
      <EmptyState
        title="Orders will appear here"
        description="Connected to Spree via packages/api-client"
      />
    </div>
  );
}
