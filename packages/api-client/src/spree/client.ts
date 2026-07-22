// Spree SDK wrapper.
// All Spree API calls go through @spree/sdk.
// This package provides a consistent initialisation point for both apps.
// Auth cookie handling remains in apps/storefront/src/lib/spree — it is
// Next.js-specific and cannot be shared until apps/operations is scaffolded.

export { makeClient } from "@spree/sdk";

export function getSpreeBaseUrl(): string {
  const url = process.env.SPREE_API_URL;
  if (!url) throw new Error("SPREE_API_URL is not set");
  return url;
}
