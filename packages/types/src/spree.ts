// Shared Spree response primitives used across apps.
// Full Spree types come from @spree/sdk — these are platform-level
// wrappers and shared structures only.

export interface SpreeApiMeta {
  count: number;
  total_count: number;
  total_pages: number;
}

export interface SpreeApiLinks {
  self: string;
  next?: string;
  prev?: string;
  last?: string;
  first?: string;
}

export interface SpreeListResponse<T> {
  data: T[];
  meta: SpreeApiMeta;
  links: SpreeApiLinks;
}

export interface SpreeMoneyValue {
  amount: string;
  currency: string;
}
