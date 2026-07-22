import type { OperationsNavItem } from "@ecommerce/types";

export const NAV_ITEMS: OperationsNavItem[] = [
  { id: "overview",      label: "Overview",       href: "/dashboard" },
  { id: "orders",        label: "Orders",          href: "/dashboard/orders" },
  { id: "products",      label: "Products",        href: "/dashboard/products" },
  { id: "customers",     label: "Customers",       href: "/dashboard/customers" },
  { id: "inventory",     label: "Inventory",       href: "/dashboard/inventory" },
  { id: "reports",       label: "Reports",         href: "/dashboard/reports" },
  { id: "workflows",     label: "Workflows",       href: "/dashboard/workflows" },
  { id: "notifications", label: "Notifications",   href: "/dashboard/notifications" },
  { id: "content",       label: "Content",         href: "/dashboard/content" },
  { id: "settings",      label: "Settings",        href: "/dashboard/settings" },
];
