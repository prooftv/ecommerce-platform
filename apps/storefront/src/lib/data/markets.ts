"use server";

import type { Market } from "@spree/sdk";
import { unstable_cache } from "next/cache";
import { getClient, getLocaleOptions } from "@/lib/spree";

export async function getMarkets(options?: {
  locale?: string;
  country?: string;
}): Promise<{ data: Market[] }> {
  const resolvedOptions = options ?? (await getLocaleOptions());
  return unstable_cache(
    () => getClient().markets.list(resolvedOptions),
    ["markets", resolvedOptions.locale ?? "", resolvedOptions.country ?? ""],
    { revalidate: 3600, tags: ["markets"] },
  )();
}

export async function resolveMarket(country: string) {
  const options = await getLocaleOptions();
  return unstable_cache(
    () => getClient().markets.resolve(country, options),
    ["resolved-market", country, options.locale ?? ""],
    { revalidate: 3600, tags: ["resolved-market"] },
  )();
}

export async function getMarketCountries(marketId: string) {
  const options = await getLocaleOptions();
  return unstable_cache(
    () => getClient().markets.countries.list(marketId, options),
    ["market-countries", marketId, options.locale ?? ""],
    { revalidate: 3600, tags: ["market-countries"] },
  )();
}

export async function resolveCurrency(
  country: string,
): Promise<string | undefined> {
  const { data: markets } = await getMarkets();
  const iso = country.toLowerCase();
  for (const market of markets) {
    const match = market.countries?.some((c) => c.iso.toLowerCase() === iso);
    if (match) return market.currency;
  }
  return undefined;
}
