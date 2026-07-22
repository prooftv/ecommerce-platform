// Operations Dashboard UI state types.
// These are frontend-only — they describe UI structure, not API responses.
// API response types live in laravel.ts and spree.ts.

export type OperationsModule =
  | "overview"
  | "orders"
  | "products"
  | "customers"
  | "inventory"
  | "reports"
  | "workflows"
  | "notifications"
  | "content"
  | "settings"
  | "vendors";

export interface OperationsNavItem {
  id: OperationsModule;
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  phase?: 2 | 3;
}

export interface OperationsSession {
  user: {
    id: number;
    name: string;
    email: string;
    role: "admin" | "operator" | "viewer";
  };
  accessToken: string;
  expiresAt: number;
}
