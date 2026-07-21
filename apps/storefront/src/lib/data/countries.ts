"use server";

import { unstable_cache } from "next/cache";
import { getClient, getLocaleOptions } from "@/lib/spree";

export async function getCountries() {
  const options = await getLocaleOptions();
  return getClient().countries.list(options);
}

export async function getCountry(iso: string) {
  const options = await getLocaleOptions();
  return unstable_cache(
    () => getClient().countries.get(iso, { expand: ["states"] }, options),
    ["country", iso, options.locale ?? ""],
    { revalidate: 3600, tags: ["country", `country-${iso}`] },
  )();
}
