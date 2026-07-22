import { makeClient } from "@spree/sdk";
import type { IQuery } from "@spree/sdk";

function client(baseUrl: string) {
  return makeClient({ host: baseUrl });
}

function base() {
  const url = process.env.SPREE_API_URL;
  if (!url) throw new Error("SPREE_API_URL is not set");
  return url;
}

export async function getCustomer(bearerToken: string, params: IQuery = {}) {
  return client(base()).account.get({ bearerToken }, params);
}

export async function getAddresses(bearerToken: string, params: IQuery = {}) {
  return client(base()).account.addressesList({ bearerToken }, params);
}
