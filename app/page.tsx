"use client";

import Image from "next/image";
import { useMarkets } from "@/lib/api/hooks";
import MarketCard from "@/components/MarketCard";

export default function Home() {
  const { data, error, isLoading } = useMarkets();

  return (
    <main className="min-h-screen">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--background)]/80 border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="OSPM"
              width={40}
              height={40}
              className="rounded-md"
              priority
            />
            <span className="font-bold tracking-tight text-lg hidden sm:block">
              OSPM
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--foreground)]/5 border border-[var(--foreground)]/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--yes-color)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--yes-color)]"></span>
            </span>
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Live
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Hero Section */}
        <div className="py-12 md:py-20 max-w-3xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-6">
            Why This Exists
          </h2>
          <h1 className="text-2xl md:text-4xl font-medium leading-tight mb-8 text-foreground/90">
            Prediction markets will have a{" "}
            <span className="text-foreground decoration-2 decoration-[var(--accent)]/30 underline underline-offset-2">
              profound feedback effect
            </span>{" "}
            on decision making — similar to how the stock market influences
            public companies.
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl">
            Leading prediction markets must be{" "}
            <span className="text-[var(--accent)] font-medium">open source</span>{" "}
            to truly democratize the tools that shape our future decisions. This
            is an experiment in that transparency.
          </p>
          <div className="mt-8 p-4 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-xl inline-block text-left w-full sm:w-auto">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0 leading-none mt-0.5">✨</span>
              <p className="text-sm text-[var(--foreground)] font-medium leading-snug">
                Markets are AI-generated from real-world news sources,
                identifying upcoming events worth predicting.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-pulse-glow inline-block p-4 rounded-2xl bg-white/80 mb-4 shadow-sm">
              <svg
                className="w-10 h-10 text-[var(--accent)] animate-spin"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Loading Markets...</h2>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-4">
              Failed to Load Markets
            </h2>
            <p className="text-muted mb-6">
              Could not connect to the Oracle service. Make sure it&apos;s
              running on port 3001.
            </p>
            <code className="block p-4 bg-white rounded-xl text-sm text-[var(--accent)] border border-[var(--border-color)]">
              cd oracle && npm run dev
            </code>
          </div>
        )}

        {/* Markets Grid */}
        {data && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {data.total} Market{data.total !== 1 ? "s" : ""}
              </h2>
            </div>

            {data.markets.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📭</div>
                <h2 className="text-xl font-semibold mb-2">No Markets Yet</h2>
                <p className="text-muted">
                  Markets will appear here once the Data Service generates them.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.markets.map((market) => (
                  <MarketCard key={market.id} market={market} />
                ))}
              </div>
            )}

            {data.hasMore && (
              <div className="text-center mt-8">
                <button className="btn btn-outline">Load More</button>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-[var(--border-color)] text-center pb-8">
          <p className="text-sm text-muted">
            <a
              href="https://github.com/timi-ty/ospm-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Built with Next.js
            </a>
            {" · "}
            <a
              href="https://github.com/timi-ty/ospm-services"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Powered by Oracle Service
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
