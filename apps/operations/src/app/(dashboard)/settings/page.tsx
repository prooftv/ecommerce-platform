import type { Metadata } from "next";
import { PageHeader, EmptyState } from "@ecommerce/ui/dashboard";
export const metadata: Metadata = { title: "Settings" };
export default function SettingsPage() {
  return <div><PageHeader title="Settings" description="Store and platform configuration" /><EmptyState title="Settings will appear here" description="Connected to Spree + Laravel via packages/api-client" /></div>;
}
