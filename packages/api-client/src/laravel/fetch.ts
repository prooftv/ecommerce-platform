export function getLaravelBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_LARAVEL_API_URL is not set");
  return url.replace(/\/$/, "");
}

export async function laravelFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const res = await fetch(`${getLaravelBaseUrl()}${path}`, {
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
    throw new Error((error as { message?: string }).message ?? `Laravel API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
