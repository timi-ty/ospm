import type { Market } from "@/lib/api/types";

interface MarketCardProps {
  market: Market;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "text-[var(--yes-color)]";
    case "pending":
      return "text-[var(--accent)]";
    case "resolved":
      return "text-muted";
    default:
      return "text-muted";
  }
}

export default function MarketCard({ market }: MarketCardProps) {
  return (
    <div className="card animate-fade-in-up">
      {/* Category & Status */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted bg-[var(--foreground)]/5 px-2 py-1 rounded">
          {market.category}
        </span>
        <span className={`text-xs font-medium uppercase tracking-wider ${getStatusColor(market.status)}`}>
          {market.status}
        </span>
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold leading-tight mb-3">
        {market.question}
      </h3>

      {/* Description */}
      {market.description && (
        <p className="text-sm text-muted mb-4 line-clamp-2">
          {market.description}
        </p>
      )}

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
        <div>
          <div className="text-xs text-muted font-medium uppercase tracking-wider">
            Betting Closes
          </div>
          <div className="text-sm font-medium mt-1">
            {formatDate(market.bettingClosesAt)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted font-medium uppercase tracking-wider">
            Resolves
          </div>
          <div className="text-sm font-medium mt-1">
            {formatDate(market.resolvesAt)}
          </div>
        </div>
      </div>

      {/* Source Link */}
      <a
        href={market.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1"
      >
        View Source →
      </a>
    </div>
  );
}
