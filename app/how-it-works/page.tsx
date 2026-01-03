import Link from "next/link";

export default function HowItWorks() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-[var(--accent)] transition-colors mb-6"
          >
            ← Back to Market
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            How LMSR Works
          </h1>
          <p className="text-muted mt-3">
            Understanding the math behind prediction market pricing
          </p>
        </header>

        {/* Content */}
        <div className="space-y-6">
          {/* What is LMSR */}
          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-[var(--accent)]">
              What is LMSR?
            </h2>
            <p className="text-muted mb-4">
              LMSR stands for <strong className="text-foreground">Logarithmic Market Scoring Rule</strong>. 
              It&apos;s an automated market maker (AMM) designed specifically for prediction markets.
            </p>
            <p className="text-muted">
              Instead of matching buyers and sellers like a traditional exchange, LMSR uses a 
              mathematical formula to always provide a price. This guarantees liquidity—you can 
              always trade, even if no one else is online.
            </p>
          </section>

          {/* The Core Idea */}
          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-[var(--accent)]">
              The Core Idea
            </h2>
            <div className="space-y-4 text-muted">
              <p>
                The market tracks <strong className="text-foreground">how many shares</strong> exist 
                for each outcome:
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--yes-color)]/5 border border-[var(--yes-color)]/20 text-center">
                  <div className="text-2xl font-bold text-[var(--yes-color)]">qYes</div>
                  <div className="text-sm mt-1">Total YES shares</div>
                </div>
                <div className="p-4 rounded-xl bg-[var(--no-color)]/5 border border-[var(--no-color)]/20 text-center">
                  <div className="text-2xl font-bold text-[var(--no-color)]">qNo</div>
                  <div className="text-sm mt-1">Total NO shares</div>
                </div>
              </div>
              <p>
                When you buy shares, the market updates these quantities and recalculates the price.
              </p>
            </div>
          </section>

          {/* The Cost Function */}
          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-[var(--accent)]">
              The Cost Function
            </h2>
            <p className="text-muted mb-4">
              LMSR uses a <strong className="text-foreground">cost function</strong> to determine 
              how much you pay for shares:
            </p>
            <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border-color)] font-mono text-center text-lg mb-4">
              C(qYes, qNo) = b × ln(e<sup>qYes/b</sup> + e<sup>qNo/b</sup>)
            </div>
            <p className="text-muted mb-4">
              Where <strong className="text-[var(--accent)]">b</strong> is the liquidity parameter.
            </p>
            <p className="text-muted">
              When you buy shares, you pay the <em>difference</em> in the cost function:
            </p>
            <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border-color)] font-mono text-center mt-3">
              Your cost = C(after trade) − C(before trade)
            </div>
          </section>

          {/* Price as Probability */}
          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-[var(--accent)]">
              Price = Probability
            </h2>
            <p className="text-muted mb-4">
              The current price of YES shares is calculated as:
            </p>
            <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border-color)] font-mono text-center text-lg mb-4">
              pYes = e<sup>qYes/b</sup> ÷ (e<sup>qYes/b</sup> + e<sup>qNo/b</sup>)
            </div>
            <p className="text-muted">
              This is just a <strong className="text-foreground">softmax function</strong>! 
              The prices always sum to 1 (100%), so they can be interpreted as probabilities.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-[var(--yes-color)]/5 border border-[var(--yes-color)]/20">
              <p className="text-sm">
                <strong className="text-[var(--yes-color)]">Example:</strong> If pYes = 0.73, 
                the market thinks there&apos;s a 73% chance the event will happen.
              </p>
            </div>
          </section>

          {/* The Liquidity Parameter */}
          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-[var(--accent)]">
              The Liquidity Parameter (b)
            </h2>
            <p className="text-muted mb-4">
              The parameter <strong className="text-[var(--accent)]">b</strong> controls how 
              quickly prices move:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border-color)]">
                <h3 className="font-semibold mb-2">Small b</h3>
                <ul className="text-sm text-muted space-y-1">
                  <li>• Prices move quickly</li>
                  <li>• Less liquidity</li>
                  <li>• Lower market maker subsidy</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border-color)]">
                <h3 className="font-semibold mb-2">Large b</h3>
                <ul className="text-sm text-muted space-y-1">
                  <li>• Prices move slowly</li>
                  <li>• More liquidity</li>
                  <li>• Higher market maker subsidy</li>
                </ul>
              </div>
            </div>
            <p className="text-muted mt-4 text-sm">
              The maximum loss for the market maker is bounded by <strong>b × ln(2)</strong> for 
              a binary market. This is the &quot;subsidy&quot; paid for guaranteed liquidity.
            </p>
          </section>

          {/* Example Trade */}
          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-[var(--accent)]">
              Example Trade
            </h2>
            <p className="text-muted mb-4">
              Let&apos;s say the market starts at 50/50 (qYes = 0, qNo = 0) with b = 10:
            </p>
            <ol className="space-y-3 text-muted">
              <li className="flex gap-3">
                <span className="text-[var(--accent)] font-semibold">1.</span>
                <span>Initial price: pYes = 50%</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent)] font-semibold">2.</span>
                <span>You spend ~6.20 tokens to buy 10 YES shares</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent)] font-semibold">3.</span>
                <span>New state: qYes = 10, qNo = 0</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--accent)] font-semibold">4.</span>
                <span>New price: pYes = 73.1%</span>
              </li>
            </ol>
            <p className="text-muted mt-4 text-sm">
              Your average price was 0.62 per share, but the final price is 0.731. 
              Each additional share costs a bit more—that&apos;s the LMSR curve at work!
            </p>
          </section>

          {/* Why LMSR */}
          <section className="card">
            <h2 className="text-xl font-semibold mb-4 text-[var(--accent)]">
              Why Use LMSR?
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-5 rounded-xl bg-[var(--background)] border border-[var(--border-color)]">
                <div className="text-3xl mb-3">💧</div>
                <h3 className="font-semibold mb-1">Liquidity</h3>
                <p className="text-sm text-muted">Always a price, always tradeable</p>
              </div>
              <div className="text-center p-5 rounded-xl bg-[var(--background)] border border-[var(--border-color)]">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold mb-1">Probabilities</h3>
                <p className="text-sm text-muted">Prices are interpretable as odds</p>
              </div>
              <div className="text-center p-5 rounded-xl bg-[var(--background)] border border-[var(--border-color)]">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="font-semibold mb-1">Bounded Loss</h3>
                <p className="text-sm text-muted">Market maker risk is predictable</p>
              </div>
            </div>
          </section>

          {/* Back Link */}
          <div className="text-center pt-4">
            <Link href="/" className="btn btn-outline">
              ← Back to Trading
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-14 pt-8 border-t border-[var(--border-color)] text-center">
          <p className="text-sm text-muted">
            OSPM · LMSR Prediction Market Simulator
          </p>
        </footer>
      </div>
    </main>
  );
}
