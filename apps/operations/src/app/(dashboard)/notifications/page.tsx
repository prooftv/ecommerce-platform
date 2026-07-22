import type { Metadata } from "next";
import { PageHeader, EmptyState } from "@ecommerce/ui/dashboard";
export const metadata: Metadata = { title: "Notifications" };
export default function NotificationsPage() {
  return <div><PageHeader title="Notifications" description="Staff alerts and system notifications" /><EmptyState title="Notifications will appear here" description="Connected to Laravel via packages/api-client" /></div>;
}
