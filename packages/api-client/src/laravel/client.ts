import type {
  LaravelSuccessResponse,
  LaravelPaginatedResponse,
  LaravelAuthTokens,
  LaravelAuthUser,
  LaravelDashboardSummary,
  LaravelOrderReportRow,
  LaravelRevenueReportRow,
  LaravelNotification,
} from "@ecommerce/types/laravel";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_LARAVEL_API_URL is not set");
  return url.replace(/\/$/, "");
}

async function request<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...fetchOptions } = options ?? {};
  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message ?? `Laravel API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function laravelLogin(
  email: string,
  password: string
): Promise<LaravelSuccessResponse<LaravelAuthTokens & { user: LaravelAuthUser }>> {
  return request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function laravelRefresh(
  refreshToken: string
): Promise<LaravelSuccessResponse<LaravelAuthTokens>> {
  return request("/api/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function laravelLogout(token: string): Promise<void> {
  await request("/api/v1/auth/logout", { method: "POST", token });
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardSummary(
  token: string
): Promise<LaravelSuccessResponse<LaravelDashboardSummary>> {
  return request("/api/v1/dashboard/summary", { token });
}

// ─── Reporting ────────────────────────────────────────────────────────────────

export async function getOrderReport(
  token: string,
  params: { from: string; to: string }
): Promise<LaravelPaginatedResponse<LaravelOrderReportRow>> {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/v1/reports/orders?${qs}`, { token });
}

export async function getRevenueReport(
  token: string,
  params: { from: string; to: string }
): Promise<LaravelPaginatedResponse<LaravelRevenueReportRow>> {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/v1/reports/revenue?${qs}`, { token });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(
  token: string
): Promise<LaravelPaginatedResponse<LaravelNotification>> {
  return request("/api/v1/notifications", { token });
}

export async function markNotificationRead(
  token: string,
  id: string
): Promise<void> {
  await request(`/api/v1/notifications/${id}/read`, { method: "PATCH", token });
}
