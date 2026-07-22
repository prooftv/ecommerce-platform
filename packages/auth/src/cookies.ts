import { cookies } from "next/headers";

const ACCESS_TOKEN_KEY = "ops_access_token";
const REFRESH_TOKEN_KEY = "ops_refresh_token";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function getOpsAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_TOKEN_KEY)?.value;
}

export async function getOpsRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_TOKEN_KEY)?.value;
}

export async function setOpsTokens(accessToken: string, refreshToken: string, expiresIn: number) {
  const jar = await cookies();
  jar.set(ACCESS_TOKEN_KEY, accessToken, {
    ...COOKIE_OPTS,
    maxAge: expiresIn,
  });
  jar.set(REFRESH_TOKEN_KEY, refreshToken, {
    ...COOKIE_OPTS,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearOpsTokens() {
  const jar = await cookies();
  jar.delete(ACCESS_TOKEN_KEY);
  jar.delete(REFRESH_TOKEN_KEY);
}
