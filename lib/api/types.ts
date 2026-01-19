export interface Market {
  id: string;
  question: string;
  description: string | null;
  category: string;
  sourceUrl: string;
  bettingClosesAt: string;
  resolvesAt: string;
  status: string;
  createdAt: string;
}

export interface MarketsResponse {
  markets: Market[];
  total: number;
  hasMore: boolean;
}

export interface MarketResponse {
  market: Market;
}

export interface MarketsParams {
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}
