import type { LaravelSuccessResponse, LaravelDashboardSummary } from "@ecommerce/types";
import { laravelFetch } from "./fetch";

export async function getDashboardSummary(token: string) {
  return laravelFetch<LaravelSuccessResponse<LaravelDashboardSummary>>(
    "/api/v1/dashboard/summary",
    { token }
  );
}
