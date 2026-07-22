// Centralised site URL resolution.
// Used by: apps/storefront, apps/operations (future), sanity.config.ts
//
// Resolution order:
//   1. NEXT_PUBLIC_SITE_URL  — set in production and staging
//   2. VERCEL_URL            — set automatically by Vercel on preview deployments
//   3. window.location.origin — Studio running in browser (no env var available)
//   4. http://localhost:3001  — local development fallback

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3001";
}

export const defaultCountry = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY ?? "us";
export const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en";
