import { makeClient } from "@spree/sdk";
import type { IQuery } from "@spree/sdk";

function client(baseUrl: string) {
  return makeClient({ host: baseUrl });
}

export function getSpreeBaseUrl(): string {
  const url = process.env.SPREE_API_URL;
  if (!url) throw new Error("SPREE_API_URL is not set");
  return url;
}

export async function getProducts(
  params: IQuery = {},
  options: { bearerToken?: string; orderToken?: string } = {}
) {
  return client(getSpreeBaseUrl()).products.list(
    { bearerToken: options.bearerToken, orderToken: options.orderToken },
    params
  );
}

export async function getProduct(
  slug: string,
  params: IQuery = {},
  options: { bearerToken?: string; orderToken?: string } = {}
) {
  return client(getSpreeBaseUrl()).products.show(
    { bearerToken: options.bearerToken, orderToken: options.orderToken },
    slug,
    params
  );
}
