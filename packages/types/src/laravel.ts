// Laravel API types.
// These define the contract the frontend expects from the Laravel backend.
// Documented in docs/04_API_CONTRACTS.md.
// Update here first, then update the API contract doc.

// ─── Response envelope ────────────────────────────────────────────────────────

export interface LaravelSuccessResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface LaravelErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

export interface LaravelPaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LaravelAuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "operator" | "viewer";
  created_at: string;
}

export interface LaravelAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: "Bearer";
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface LaravelDashboardSummary {
  orders_today: number;
  orders_this_month: number;
  revenue_today: LaravelMoney;
  revenue_this_month: LaravelMoney;
  new_customers_this_month: number;
  pending_orders: number;
}

// ─── Reporting ────────────────────────────────────────────────────────────────

export interface LaravelOrderReportRow {
  date: string;
  order_count: number;
  revenue: LaravelMoney;
  average_order_value: LaravelMoney;
}

export interface LaravelRevenueReportRow {
  date: string;
  gross: LaravelMoney;
  refunds: LaravelMoney;
  net: LaravelMoney;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface LaravelNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
  data?: Record<string, unknown>;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

export interface LaravelMoney {
  amount: number;
  currency: string;
  formatted: string;
}
