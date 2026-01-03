"use client";

import { formatProbability, formatNumber } from "@/lib/lmsr";

interface Trade {
  id: string;
  visitorId: string;
  side: string;
  amountSpent: number;
  sharesGot: number;
  priceBefore: number;
  priceAfter: number;
  createdAt: string;
}

interface TradeHistoryProps {
  trades: Trade[];
}

export default function TradeHistory({ trades }: TradeHistoryProps) {
  if (trades.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-muted">No trades yet. Be the first!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">
        Recent Trades{" "}
        <span className="text-sm font-normal text-muted">({trades.length})</span>
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {trades.map((trade, index) => {
          const isYes = trade.side === "YES";
          const priceChange = trade.priceAfter - trade.priceBefore;
          const timeAgo = getTimeAgo(new Date(trade.createdAt));

          return (
            <div
              key={trade.id}
              className={`trade-item ${isYes ? "trade-item-yes" : "trade-item-no"} animate-slide-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center font-semibold text-xs ${
                    isYes
                      ? "bg-[var(--yes-color)]/10 text-[var(--yes-color)]"
                      : "bg-[var(--no-color)]/10 text-[var(--no-color)]"
                  }`}
                >
                  {trade.side}
                </div>
                <div>
                  <div className="font-mono text-sm">
                    <span className="text-muted">+</span>
                    {formatNumber(trade.sharesGot)}{" "}
                    <span className="text-muted">shares</span>
                  </div>
                  <div className="text-xs text-muted">
                    {formatNumber(trade.amountSpent)} tokens · {timeAgo}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-mono ${
                    priceChange > 0
                      ? "text-[var(--price-up)]"
                      : "text-[var(--price-down)]"
                  }`}
                >
                  {priceChange > 0 ? "↑" : "↓"} {formatProbability(Math.abs(priceChange))}
                </div>
                <div className="text-xs text-muted font-mono">
                  → {formatProbability(trade.priceAfter)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
