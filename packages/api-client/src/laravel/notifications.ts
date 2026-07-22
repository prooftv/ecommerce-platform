import type { LaravelPaginatedResponse, LaravelNotification } from "@ecommerce/types";
import { laravelFetch } from "./fetch";

export async function getNotifications(token: string) {
  return laravelFetch<LaravelPaginatedResponse<LaravelNotification>>(
    "/api/v1/notifications",
    { token }
  );
}

export async function markNotificationRead(token: string, id: string) {
  await laravelFetch(`/api/v1/notifications/${id}/read`, { method: "PATCH", token });
}
