"use client";

import { formatProbability } from "@/lib/lmsr";

interface MarketCardProps {
  question: string;
  pYes: number;
  pNo: number;
  qYes: number;
  qNo: number;
  totalTrades: number;
  b: number;
}

export default function MarketCard({
  question,
  pYes,
  pNo,
  qYes,
  qNo,
  totalTrades,
  b,
}: MarketCardProps) {
  const yesPercent = pYes * 100;

  return (
    <div className="card animate-fade-in-up">
      {/* Question */}
      <div className="mb-6">
        <div className="text-xs font-medium uppercase tracking-wider text-muted mb-2">
          The Question
        </div>
        <h2 className="text-xl md:text-2xl font-semibold leading-tight">
          {question}
        </h2>
      </div>

      {/* Probability Display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-5 rounded-xl bg-[var(--yes-color)]/5 border border-[var(--yes-color)]/20">
          <div className="price-display price-yes">
            {formatProbability(pYes)}
          </div>
          <div className="text-sm text-muted mt-2 font-medium">
            Yes
          </div>
          <div className="text-xs text-muted mt-1 font-mono">
            {qYes.toFixed(1)} shares
          </div>
        </div>
        <div className="text-center p-5 rounded-xl bg-[var(--no-color)]/5 border border-[var(--no-color)]/20">
          <div className="price-display price-no">
            {formatProbability(pNo)}
          </div>
          <div className="text-sm text-muted mt-2 font-medium">
            No
          </div>
          <div className="text-xs text-muted mt-1 font-mono">
            {qNo.toFixed(1)} shares
          </div>
        </div>
      </div>

      {/* Probability Bar */}
      <div className="mb-6">
        <div className="probability-bar h-3">
          <div
            className="probability-bar-fill probability-bar-yes transition-all duration-500"
            style={{ width: `${yesPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted mt-2">
          <span>0%</span>
          <span className="text-[var(--accent)]">Market Probability</span>
          <span>100%</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-5 border-t border-[var(--border-color)]">
        <div>
          <div className="text-xs text-muted font-medium uppercase tracking-wider">
            Total Trades
          </div>
          <div className="text-xl font-semibold text-[var(--accent)] mt-1">{totalTrades.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-muted font-medium uppercase tracking-wider">
            Liquidity (b)
          </div>
          <div className="text-xl font-semibold mt-1">{b}</div>
        </div>
      </div>
    </div>
  );
}
