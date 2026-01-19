import useSWR from "swr";
import { getMarkets, getMarket } from "./client";
import type { MarketsParams, MarketsResponse, MarketResponse } from "./types";

export function useMarkets(params?: MarketsParams) {
  return useSWR<MarketsResponse>(
    ["markets", params],
    () => getMarkets(params),
    { refreshInterval: 30000 }
  );
}

export function useMarket(id: string | null) {
  return useSWR<MarketResponse>(
    id ? ["market", id] : null,
    () => getMarket(id!)
  );
}
