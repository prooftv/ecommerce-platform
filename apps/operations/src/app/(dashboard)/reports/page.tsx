import type { Metadata } from "next";
import { PageHeader, EmptyState } from "@ecommerce/ui/dashboard";
export const metadata: Metadata = { title: "Reports" };
export default function ReportsPage() {
  return <div><PageHeader title="Reports" description="Order and revenue analytics" /><EmptyState title="Reports will appear here" description="Connected to Laravel via packages/api-client" /></div>;
}
