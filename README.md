# OSPM

Open Source Prediction Market — a real-time LMSR prediction market simulator built with Next.js, Prisma, and PostgreSQL.

## The Question

> **"Will OSPM hit 1M trades, scaring establishment prediction marketplaces?"**

Every visitor can place **one bet** (Yes or No) from their browser. Watch the market probability shift in real-time as people trade!

## Features

- **LMSR Pricing**: Automated market maker using Logarithmic Market Scoring Rule
- **Real-time Updates**: See trades from other users within 2 seconds
- **One Trade Per Browser**: Simple cookie-based trade limiting
- **Play Money**: No real money involved - just for fun and learning
- **Educational**: Learn how prediction markets and AMMs work

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS with crypto/neon aesthetic
- **Database**: PostgreSQL (local) / Neon (production)
- **ORM**: Prisma 5
- **Real-time**: SWR polling

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (for local development)
- npm or yarn

### Local Development

1. **Clone and install dependencies**

   ```bash
   git clone <repo-url>
   cd ospm
   npm install
   ```

2. **Run setup script** (macOS with Homebrew)

   ```bash
   ./scripts/setup_db.sh
   ```

   This script:
   - Installs/starts PostgreSQL
   - Creates database and user
   - Creates `.env` file
   - Pushes Prisma schema
   - Seeds the market

3. **Start development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

### Manual Setup (alternative)

If you prefer manual setup or aren't on macOS:

```sql
CREATE DATABASE ospm_dev;
CREATE USER ospm_user WITH PASSWORD 'ospm_pass';
GRANT ALL PRIVILEGES ON DATABASE ospm_dev TO ospm_user;
```

```bash
echo 'DATABASE_URL="postgresql://ospm_user:ospm_pass@localhost:5432/ospm_dev?schema=public"' > .env
npx prisma db push
npm run db:seed
npm run dev
```

## Deployment (Vercel + Neon)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

3. **Add Neon Postgres from Vercel Marketplace**
   - In Vercel Dashboard → Your Project → Storage
   - Click "Connect Store" → Choose "Neon"
   - This automatically injects `DATABASE_URL` into your environment

4. **Deploy**
   - Vercel will automatically build and deploy
   - Prisma generates during the build step

5. **Seed the production market**
   - Option A: Use Vercel CLI
     ```bash
     vercel env pull .env.local
     npm run db:seed
     ```
   - Option B: Connect to Neon directly and run the seed

## How LMSR Works

The Logarithmic Market Scoring Rule (LMSR) is an automated market maker for prediction markets.

### Key Concepts

- **qYes, qNo**: Total outstanding shares for each outcome
- **b**: Liquidity parameter (higher = smoother prices)
- **Cost Function**: `C(q) = b * ln(exp(qYes/b) + exp(qNo/b))`
- **Price**: `pYes = exp(qYes/b) / (exp(qYes/b) + exp(qNo/b))`

### Properties

- Prices always between 0 and 1, sum to 1
- Guaranteed liquidity (always a price)
- Market maker max loss bounded by `b * ln(2)`

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run start      # Start production server
npm test           # Run LMSR unit tests
npm run db:seed    # Seed the OSPM market
npm run db:push    # Push schema changes to database
```

## Project Structure

```
ospm/
├── app/
│   ├── api/
│   │   ├── market/     # GET market state
│   │   └── trade/      # POST trade, GET trade status
│   ├── how-it-works/   # LMSR explainer page
│   ├── globals.css     # Crypto aesthetic styles
│   ├── layout.tsx
│   └── page.tsx        # Main market UI
├── components/
│   ├── MarketCard.tsx
│   ├── TradePanel.tsx
│   ├── AlreadyTraded.tsx
│   ├── PriceChart.tsx
│   └── TradeHistory.tsx
├── lib/
│   ├── lmsr.ts         # LMSR math functions
│   └── prisma.ts       # Prisma client
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── scripts/
│   └── setup_db.sh     # Local Postgres setup
└── __tests__/
    └── lmsr.test.ts
```

## License

MIT
