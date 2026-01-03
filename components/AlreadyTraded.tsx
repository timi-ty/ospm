"use client";

import { formatProbability, formatNumber } from "@/lib/lmsr";

interface Trade {
  id: string;
  side: string;
  amountSpent: number;
  sharesGot: number;
  priceBefore: number;
  priceAfter: number;
  createdAt: string;
}

interface AlreadyTradedProps {
  trade: Trade;
}

export default function AlreadyTraded({ trade }: AlreadyTradedProps) {
  const isYes = trade.side === "YES";
  const priceChange = trade.priceAfter - trade.priceBefore;
  const tradeDate = new Date(trade.createdAt);

  return (
    <div className="card">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--yes-color)]/10 mb-4">
          <svg
            className={`w-7 h-7 ${isYes ? "text-[var(--yes-color)]" : "text-[var(--no-color)]"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">You&apos;ve Placed Your Bet!</h3>
        <p className="text-sm text-muted mt-2">
          Your prediction is locked in. Watch how the market moves.
        </p>
      </div>

      {/* Trade Summary */}
      <div
        className={`p-4 rounded-xl border ${
          isYes
            ? "bg-[var(--yes-color)]/5 border-[var(--yes-color)]/20"
            : "bg-[var(--no-color)]/5 border-[var(--no-color)]/20"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span
            className={`text-2xl font-bold ${
              isYes ? "text-[var(--yes-color)]" : "text-[var(--no-color)]"
            }`}
          >
            {trade.side}
          </span>
          <span className="text-xs text-muted">
            {tradeDate.toLocaleDateString()} at{" "}
            {tradeDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted font-medium uppercase tracking-wider">
              Spent
            </div>
            <div className="font-mono text-lg mt-1">
              {formatNumber(trade.amountSpent)} tokens
            </div>
          </div>
          <div>
            <div className="text-xs text-muted font-medium uppercase tracking-wider">
              Shares
            </div>
            <div
              className={`font-mono text-lg mt-1 ${
                isYes ? "text-[var(--yes-color)]" : "text-[var(--no-color)]"
              }`}
            >
              {formatNumber(trade.sharesGot)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted font-medium uppercase tracking-wider">
              Entry Price
            </div>
            <div className="font-mono mt-1">{formatProbability(trade.priceBefore)}</div>
          </div>
          <div>
            <div className="text-xs text-muted font-medium uppercase tracking-wider">
              Price Impact
            </div>
            <div
              className={`font-mono mt-1 ${
                priceChange > 0 ? "text-[var(--price-up)]" : "text-[var(--price-down)]"
              }`}
            >
              {priceChange > 0 ? "+" : ""}
              {formatProbability(priceChange)}
            </div>
          </div>
        </div>
      </div>

      {/* Potential Payout */}
      <div className="mt-4 p-4 rounded-xl bg-[var(--background)] border border-[var(--border-color)]">
        <div className="text-xs text-muted font-medium uppercase tracking-wider mb-2">
          If {trade.side} Wins
        </div>
        <div className="text-2xl font-bold text-[var(--accent)]">
          {formatNumber(trade.sharesGot)} tokens
        </div>
        <p className="text-xs text-muted mt-1">
          Each winning share pays out 1 token
        </p>
      </div>

      {/* Info */}
      <p className="text-xs text-center text-muted mt-6">
        Want to trade again? Clear your cookies or use a different browser.
      </p>
    </div>
  );
}
