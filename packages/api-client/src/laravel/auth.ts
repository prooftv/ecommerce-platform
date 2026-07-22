import type { LaravelSuccessResponse, LaravelAuthTokens, LaravelAuthUser } from "@ecommerce/types";
import { laravelFetch } from "./fetch";

export async function laravelLogin(email: string, password: string) {
  return laravelFetch<LaravelSuccessResponse<LaravelAuthTokens & { user: LaravelAuthUser }>>(
    "/api/v1/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
}

export async function laravelRefresh(refreshToken: string) {
  return laravelFetch<LaravelSuccessResponse<LaravelAuthTokens>>(
    "/api/v1/auth/refresh",
    { method: "POST", body: JSON.stringify({ refresh_token: refreshToken }) }
  );
}

export async function laravelLogout(token: string) {
  await laravelFetch("/api/v1/auth/logout", { method: "POST", token });
}
