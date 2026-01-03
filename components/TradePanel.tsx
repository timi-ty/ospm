"use client";

import { useState, useEffect } from "react";
import { simulateBuy, formatProbability, formatNumber } from "@/lib/lmsr";

interface TradePanelProps {
  qYes: number;
  qNo: number;
  b: number;
  pYes: number;
  pNo: number;
  onTrade: (side: "YES" | "NO", amount: number) => Promise<void>;
  isLoading: boolean;
}

export default function TradePanel({
  qYes,
  qNo,
  b,
  pYes,
  pNo,
  onTrade,
  isLoading,
}: TradePanelProps) {
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState<string>("10");
  const [preview, setPreview] = useState<{
    deltaShares: number;
    cost: number;
    pBefore: number;
    pAfter: number;
  } | null>(null);

  // Calculate preview whenever inputs change
  useEffect(() => {
    const spendAmount = parseFloat(amount);
    if (isNaN(spendAmount) || spendAmount <= 0) {
      setPreview(null);
      return;
    }

    const simulation = simulateBuy(side, qYes, qNo, b, spendAmount);
    setPreview(simulation);
  }, [side, amount, qYes, qNo, b]);

  const handleTrade = async () => {
    const spendAmount = parseFloat(amount);
    if (isNaN(spendAmount) || spendAmount <= 0) return;
    await onTrade(side, spendAmount);
  };

  const currentPrice = side === "YES" ? pYes : pNo;
  const priceChange = preview ? preview.pAfter - preview.pBefore : 0;
  const priceChangePercent = preview
    ? ((preview.pAfter - preview.pBefore) / preview.pBefore) * 100
    : 0;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">Place Your Bet</h3>
      <p className="text-sm text-muted mb-6">
        You can only place <span className="text-[var(--accent)] font-medium">one bet</span> from this
        browser. Choose wisely!
      </p>

      {/* Side Toggle */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setSide("YES")}
          className={`py-3 px-4 rounded-xl font-semibold transition-all ${
            side === "YES"
              ? "bg-[var(--yes-color)] text-white"
              : "bg-[var(--background)] text-muted border border-[var(--border-color)] hover:border-[var(--yes-color)]/50"
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => setSide("NO")}
          className={`py-3 px-4 rounded-xl font-semibold transition-all ${
            side === "NO"
              ? "bg-[var(--no-color)] text-white"
              : "bg-[var(--background)] text-muted border border-[var(--border-color)] hover:border-[var(--no-color)]/50"
          }`}
        >
          No
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm text-muted mb-2 font-medium">
          Amount to Spend (tokens)
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            max="1000"
            step="1"
            className="w-full text-lg pr-16"
            placeholder="Enter amount..."
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">
            tokens
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {[5, 10, 25, 50, 100].map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset.toString())}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                amount === preset.toString()
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "bg-[var(--background)] border-[var(--border-color)] hover:border-[var(--accent)]/50"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Trade Preview */}
      {preview && preview.deltaShares > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-[var(--background)] border border-[var(--border-color)]">
          <div className="text-xs font-medium uppercase tracking-wider text-muted mb-3">
            Trade Preview
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <span className="text-muted">You spend:</span>
              <span className="font-mono font-medium">{formatNumber(preview.cost)} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">You receive:</span>
              <span
                className={`font-mono font-medium ${
                  side === "YES" ? "text-[var(--yes-color)]" : "text-[var(--no-color)]"
                }`}
              >
                {formatNumber(preview.deltaShares)} {side} shares
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Current price:</span>
              <span className="font-mono">{formatProbability(currentPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Price after:</span>
              <span
                className={`font-mono ${
                  priceChange > 0 ? "text-[var(--price-up)]" : "text-[var(--price-down)]"
                }`}
              >
                {formatProbability(preview.pAfter)}
                <span className="text-xs ml-1">
                  ({priceChange > 0 ? "+" : ""}
                  {priceChangePercent.toFixed(1)}%)
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleTrade}
        disabled={isLoading || !preview || preview.deltaShares <= 0}
        className={`w-full py-4 rounded-xl font-semibold transition-all ${
          side === "YES" ? "btn-yes" : "btn-no"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Bet ${side}`
        )}
      </button>

      <p className="text-xs text-center text-muted mt-4">
        This is play money. No real value.
      </p>
    </div>
  );
}
