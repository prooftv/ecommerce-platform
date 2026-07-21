"use server";

import type { CategoryListParams, ProductListParams } from "@spree/sdk";
import { unstable_cache } from "next/cache";
import { getAccessToken, getClient, getLocaleOptions } from "@/lib/spree";

export async function getCategories(params?: CategoryListParams) {
  const options = await getLocaleOptions();
  return unstable_cache(
    () => getClient().categories.list(params, options),
    ["categories", JSON.stringify(params), options.locale ?? "", options.country ?? ""],
    { revalidate: 3600, tags: ["categories"] },
  )();
}

export async function getCategory(
  idOrPermalink: string,
  params?: { expand?: string[] },
) {
  const options = await getLocaleOptions();
  return unstable_cache(
    () => getClient().categories.get(idOrPermalink, params, options),
    ["category", idOrPermalink, JSON.stringify(params), options.locale ?? "", options.country ?? ""],
    { revalidate: 600, tags: ["category"] },
  )();
}

export async function getCategoryProducts(
  categoryId: string,
  params?: ProductListParams,
) {
  const options = await getLocaleOptions();
  const userToken = await getAccessToken();
  return unstable_cache(
    () => getClient().products.list({ ...params, in_category: categoryId }, options),
    ["category-products", categoryId, JSON.stringify(params), options.locale ?? "", options.country ?? "", userToken ?? ""],
    { revalidate: 600, tags: ["products", `category-products:${categoryId}`] },
  )();
}
