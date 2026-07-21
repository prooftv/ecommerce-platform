"use server";

import type { ProductListParams } from "@spree/sdk";
import { unstable_cache } from "next/cache";
import { getAccessToken, getClient, getLocaleOptions } from "@/lib/spree";

/**
 * Cached product list fetch. Cache key includes locale, country, and
 * userToken for per-user cache segmentation (B2B / loyalty pricing).
 * Guest users pass undefined so all guests share one cache entry.
 */
export async function getProducts(params?: ProductListParams) {
  const options = await getLocaleOptions();
  const userToken = await getAccessToken();
  return unstable_cache(
    () => getClient().products.list(params, options),
    ["products", JSON.stringify(params), options.locale ?? "", options.country ?? "", userToken ?? ""],
    { revalidate: 600, tags: ["products"] },
  )();
}

export async function getProduct(
  slugOrId: string,
  params?: { expand?: string[] },
) {
  const options = await getLocaleOptions();
  const userToken = await getAccessToken();
  const expand = params?.expand ?? [];
  return unstable_cache(
    () => getClient().products.get(slugOrId, { expand }, options),
    ["product", slugOrId, JSON.stringify(expand), options.locale ?? "", options.country ?? "", userToken ?? ""],
    { revalidate: 600, tags: ["products", `product:${slugOrId}`] },
  )();
}

export async function getProductFilters(params?: Record<string, unknown>) {
  const options = await getLocaleOptions();
  const userToken = await getAccessToken();
  return unstable_cache(
    () => getClient().products.filters(params, options),
    ["product-filters", JSON.stringify(params), options.locale ?? "", options.country ?? "", userToken ?? ""],
    { revalidate: 600, tags: ["product-filters"] },
  )();
}
