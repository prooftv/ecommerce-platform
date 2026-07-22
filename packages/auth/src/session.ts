// Authentication session management.
// Provider: Laravel (Phase 1). Provider is swappable — apps import from
// this package, not from the provider directly. See ADR-015.

import { laravelLogin, laravelLogout, laravelRefresh } from "@ecommerce/api-client/laravel";
import type { OperationsSession } from "@ecommerce/types";
import {
  getOpsAccessToken,
  getOpsRefreshToken,
  setOpsTokens,
  clearOpsTokens,
} from "./cookies";

export async function login(
  email: string,
  password: string
): Promise<{ success: true; user: OperationsSession["user"] } | { success: false; error: string }> {
  try {
    const res = await laravelLogin(email, password);
    await setOpsTokens(
      res.data.access_token,
      res.data.refresh_token,
      res.data.expires_in
    );
    return { success: true, user: res.data.user };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Login failed" };
  }
}

export async function logout(): Promise<void> {
  const token = await getOpsAccessToken();
  if (token) {
    await laravelLogout(token).catch(() => {});
  }
  await clearOpsTokens();
}

export async function getSession(): Promise<OperationsSession | null> {
  const accessToken = await getOpsAccessToken();
  if (!accessToken) return null;

  // Decode expiry from JWT without verifying signature.
  // Signature verification happens on the Laravel API on every request.
  try {
    const payload = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64url").toString()
    );
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return refreshSession();
    }
    return {
      user: {
        id: payload.sub,
        name: payload.name ?? "",
        email: payload.email ?? "",
        role: payload.role ?? "viewer",
      },
      accessToken,
      expiresAt: payload.exp * 1000,
    };
  } catch {
    return null;
  }
}

async function refreshSession(): Promise<OperationsSession | null> {
  const refreshToken = await getOpsRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await laravelRefresh(refreshToken);
    await setOpsTokens(
      res.data.access_token,
      res.data.refresh_token,
      res.data.expires_in
    );
    return getSession();
  } catch {
    await clearOpsTokens();
    return null;
  }
}
