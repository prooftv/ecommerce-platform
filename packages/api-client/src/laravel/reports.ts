import type { LaravelPaginatedResponse, LaravelOrderReportRow, LaravelRevenueReportRow } from "@ecommerce/types";
import { laravelFetch } from "./fetch";

export async function getOrderReport(
  token: string,
  params: { from: string; to: string }
) {
  const qs = new URLSearchParams(params).toString();
  return laravelFetch<LaravelPaginatedResponse<LaravelOrderReportRow>>(
    `/api/v1/reports/orders?${qs}`,
    { token }
  );
}

export async function getRevenueReport(
  token: string,
  params: { from: string; to: string }
) {
  const qs = new URLSearchParams(params).toString();
  return laravelFetch<LaravelPaginatedResponse<LaravelRevenueReportRow>>(
    `/api/v1/reports/revenue?${qs}`,
    { token }
  );
}
