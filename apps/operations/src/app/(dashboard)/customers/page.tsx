import type { Metadata } from "next";
import { PageHeader, EmptyState } from "@ecommerce/ui/dashboard";
export const metadata: Metadata = { title: "Customers" };
export default function CustomersPage() {
  return <div><PageHeader title="Customers" description="View and manage customer accounts" /><EmptyState title="Customers will appear here" description="Connected to Spree via packages/api-client" /></div>;
}
