import type { Metadata } from "next";
import { PageHeader, EmptyState } from "@ecommerce/ui/dashboard";
export const metadata: Metadata = { title: "Products" };
export default function ProductsPage() {
  return <div><PageHeader title="Products" description="Manage your product catalogue" /><EmptyState title="Products will appear here" description="Connected to Spree via packages/api-client" /></div>;
}
