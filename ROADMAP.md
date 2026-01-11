# OSPM (Open Source Prediction Market) - Project Roadmap

> **Version:** 1.0.0  
> **Network:** Base Sepolia (Testnet) → Base Mainnet (Production)  
> **Last Updated:** January 2026

---

## Table of Contents

1. [Project Overview & Architecture](#section-1-project-overview--architecture)
2. [Authentication & Identity Layer](#section-2-authentication--identity-layer)
3. [Smart Account & Wallet Infrastructure](#section-3-smart-account--wallet-infrastructure)
4. [Smart Contracts - Token & Core](#section-4-smart-contracts---token--core)
5. [Smart Contracts - Market System](#section-5-smart-contracts---market-system)
6. [Frontend Application](#section-6-frontend-application)
7. [Backend Services & Database](#section-7-backend-services--database)
8. [AI Market Generation Engine](#section-8-ai-market-generation-engine)
9. [Oracle & Settlement System](#section-9-oracle--settlement-system)
10. [Gas Sponsorship & Paymaster](#section-10-gas-sponsorship--paymaster)

---

## Section 1: Project Overview & Architecture

### 1.1 Vision

OSPM is an open-source prediction market platform that provides a seamless "Web2" experience while leveraging "Web3" rails. Users can sign up and place predictions in under 30 seconds without ever purchasing ETH or managing seed phrases.

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER LAYER                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Google    │  │    Email    │  │    Phone    │  │   Passkey   │        │
│  │   OAuth     │  │    Auth     │  │    Auth     │  │  (FaceID)   │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         └────────────────┴────────────────┴────────────────┘                │
│                                    │                                         │
│                            ┌───────▼───────┐                                │
│                            │    PRIVY      │                                │
│                            │  (Auth Layer) │                                │
│                            └───────┬───────┘                                │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                           WALLET LAYER                                       │
│                            ┌───────▼───────┐                                │
│                            │  Embedded EOA │                                │
│                            │   (Signer)    │                                │
│                            └───────┬───────┘                                │
│                                    │                                         │
│                            ┌───────▼───────┐                                │
│                            │   Coinbase    │                                │
│                            │ Smart Wallet  │                                │
│                            └───────┬───────┘                                │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                         EXECUTION LAYER                                      │
│    ┌───────────────┐       ┌──────▼──────┐       ┌───────────────┐         │
│    │  CDP Paymaster│◄──────│ Transaction │──────►│  Base Sepolia │         │
│    │(Gas Sponsor)  │       │   Bundle    │       │   (Testnet)   │         │
│    └───────────────┘       └─────────────┘       └───────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15 (App Router) | UI/UX, Market Discovery |
| **Styling** | Tailwind CSS | Responsive Design |
| **Auth** | Privy | Social Login, Embedded Wallets |
| **Wallet** | Coinbase Smart Wallet | Account Abstraction |
| **Web3** | wagmi + viem | Contract Interaction |
| **Backend** | Node.js + Express | API Layer |
| **Database** | PostgreSQL | Persistent Storage |
| **AI** | Python + OpenAI | Market Generation |
| **Contracts** | Solidity + Foundry | On-chain Logic |
| **Network** | Base Sepolia | Testnet Deployment |
| **Hosting (FE)** | Vercel | Frontend Deployment |
| **Hosting (BE)** | AWS Lightsail | VPS Backend |

### 1.4 Repository Structure

```
ospm/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── contracts/              # Solidity smart contracts
│   ├── src/
│   │   ├── PlayToken.sol
│   │   ├── MarketFactory.sol
│   │   └── BinaryMarket.sol
│   ├── script/
│   ├── test/
│   └── foundry.toml
├── lib/                    # Shared utilities
├── prisma/                 # Database schema
├── server/                 # Backend API (VPS)
│   ├── api/
│   ├── oracle/
│   └── scraper/
├── ai/                     # AI market generation
│   └── market-agent/
└── docs/                   # Documentation
```

### 1.5 Environment Configuration

```env
# Authentication
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=

# Blockchain
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
ORACLE_PRIVATE_KEY=

# Contracts
NEXT_PUBLIC_PLAY_TOKEN_ADDRESS=
NEXT_PUBLIC_MARKET_FACTORY_ADDRESS=

# Paymaster
CDP_API_KEY=
CDP_API_SECRET=
PAYMASTER_URL=

# Backend
DATABASE_URL=postgresql://...
VPS_API_SECRET=
NEXT_PUBLIC_VPS_API_URL=

# AI
OPENAI_API_KEY=
```

### 1.6 Deliverables Checklist

- [ ] Architecture diagram finalized
- [ ] Repository structure created
- [ ] Environment variables documented
- [ ] Development environment setup guide
- [ ] CI/CD pipeline configured

---

## Section 2: Authentication & Identity Layer

### 2.1 Overview

The identity layer removes the "seed phrase" barrier entirely. Users authenticate using familiar Web2 methods (Google, Email, Phone) while Privy handles wallet creation in the background.

### 2.2 Privy Integration

#### 2.2.1 Installation

```bash
npm install @privy-io/react-auth @privy-io/wagmi
```

#### 2.2.2 Provider Configuration

```typescript
// app/providers.tsx
'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['google', 'email', 'sms'],
        appearance: {
          theme: 'dark',
          accentColor: '#22c55e',
          logo: '/logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
```

#### 2.2.3 Authentication Hook

```typescript
// hooks/useAuth.ts
import { usePrivy, useWallets } from '@privy-io/react-auth';

export function useAuth() {
  const { 
    login, 
    logout, 
    authenticated, 
    user, 
    ready 
  } = usePrivy();
  
  const { wallets } = useWallets();
  
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy'
  );

  return {
    login,
    logout,
    isAuthenticated: authenticated,
    isReady: ready,
    user,
    address: embeddedWallet?.address,
    wallet: embeddedWallet,
  };
}
```

### 2.3 Login Flow

```
1. User clicks "Sign In"
2. Privy modal opens with options (Google/Email/Phone)
3. User completes authentication
4. Privy creates embedded EOA wallet
5. EOA address stored in user session
6. User redirected to dashboard with wallet ready
```

### 2.4 Phone Number Authentication (Nigeria Focus)

```typescript
// For Nigerian phone numbers (+234)
config: {
  loginMethods: ['sms'],
  appearance: {
    defaultCountryCode: 'NG',
  },
}
```

### 2.5 Session Management

```typescript
// components/AuthGuard.tsx
'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready) return <LoadingSkeleton />;
  if (!authenticated) return null;

  return <>{children}</>;
}
```

### 2.6 Deliverables Checklist

- [ ] Privy app created in dashboard
- [ ] PrivyProvider configured with correct app ID
- [ ] Login methods enabled (Google, Email, SMS)
- [ ] Embedded wallet creation on signup
- [ ] Auth hook implemented
- [ ] Protected routes configured
- [ ] User can log in and see their Base Sepolia address
- [ ] Session persistence working

---

## Section 3: Smart Account & Wallet Infrastructure

### 3.1 Overview

The Coinbase Smart Wallet provides Account Abstraction (AA), enabling passkey authentication (FaceID/TouchID) and gasless transactions through the Paymaster.

### 3.2 Smart Wallet Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Authentication                       │
│  ┌─────────────┐                      ┌─────────────┐       │
│  │   Passkey   │                      │  Privy EOA  │       │
│  │  (Signer 1) │                      │  (Signer 2) │       │
│  └──────┬──────┘                      └──────┬──────┘       │
│         │                                    │               │
│         └────────────┬───────────────────────┘               │
│                      │                                       │
│              ┌───────▼───────┐                              │
│              │    Coinbase   │                              │
│              │  Smart Wallet │                              │
│              │   (ERC-4337)  │                              │
│              └───────┬───────┘                              │
│                      │                                       │
│              ┌───────▼───────┐                              │
│              │   UserOp to   │                              │
│              │   Bundler     │                              │
│              └───────────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Coinbase Smart Wallet Integration

#### 3.3.1 Installation

```bash
npm install @coinbase/onchainkit
```

#### 3.3.2 Smart Wallet Provider

```typescript
// lib/smartWallet.ts
import { createConfig } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'OSPM',
      preference: 'smartWalletOnly',
    }),
  ],
});
```

### 3.4 Passkey Configuration

```typescript
// hooks/usePasskey.ts
import { usePrivy } from '@privy-io/react-auth';

export function usePasskey() {
  const { user, linkPasskey, unlinkPasskey } = usePrivy();

  const hasPasskey = user?.linkedAccounts?.some(
    (account) => account.type === 'passkey'
  );

  const setupPasskey = async () => {
    try {
      await linkPasskey();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    hasPasskey,
    setupPasskey,
    removePasskey: unlinkPasskey,
  };
}
```

### 3.5 Transaction Signing Flow

```typescript
// hooks/useSmartWalletTransaction.ts
import { useSendTransaction } from 'wagmi';
import { encodeFunctionData } from 'viem';

export function useSmartWalletTransaction() {
  const { sendTransaction, isPending, isSuccess, error } = useSendTransaction();

  const executeTrade = async (
    marketAddress: `0x${string}`,
    outcome: boolean,
    amount: bigint
  ) => {
    const data = encodeFunctionData({
      abi: BinaryMarketABI,
      functionName: 'placeBet',
      args: [outcome, amount],
    });

    return sendTransaction({
      to: marketAddress,
      data,
      value: 0n,
    });
  };

  return {
    executeTrade,
    isPending,
    isSuccess,
    error,
  };
}
```

### 3.6 Wallet Recovery Strategy

```typescript
// Recovery options for users
const recoveryConfig = {
  // Primary: Passkey (FaceID/TouchID)
  passkey: {
    enabled: true,
    platform: 'cross-platform',
  },
  // Secondary: Email recovery
  email: {
    enabled: true,
    verificationRequired: true,
  },
  // Tertiary: Phone recovery
  phone: {
    enabled: true,
    otpLength: 6,
  },
};
```

### 3.7 Deliverables Checklist

- [ ] Coinbase Smart Wallet SDK integrated
- [ ] Smart wallet created for new users
- [ ] Passkey enrollment flow implemented
- [ ] FaceID/TouchID transaction signing working
- [ ] Wallet recovery mechanism configured
- [ ] Multi-signer setup (Passkey + EOA)
- [ ] Transaction simulation before execution

---

## Section 4: Smart Contracts - Token & Core

### 4.1 Overview

The $PLAY token is the play-money currency of the platform. It includes a faucet function allowing new users to claim tokens for free.

### 4.2 $PLAY Token Contract

```solidity
// contracts/src/PlayToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PlayToken is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 1000 * 10**18; // 1,000 PLAY
    uint256 public constant FAUCET_COOLDOWN = 24 hours;
    
    mapping(address => uint256) public lastFaucetClaim;
    
    event FaucetClaimed(address indexed user, uint256 amount);
    
    constructor() ERC20("OSPM Play Token", "PLAY") Ownable(msg.sender) {
        // Mint initial supply to deployer for liquidity
        _mint(msg.sender, 1_000_000 * 10**18);
    }
    
    /**
     * @notice Claim free PLAY tokens (once per 24 hours)
     */
    function faucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + FAUCET_COOLDOWN,
            "Faucet: cooldown not elapsed"
        );
        
        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
        
        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }
    
    /**
     * @notice Check if user can claim faucet
     */
    function canClaimFaucet(address user) external view returns (bool) {
        return block.timestamp >= lastFaucetClaim[user] + FAUCET_COOLDOWN;
    }
    
    /**
     * @notice Time remaining until next faucet claim
     */
    function timeUntilNextClaim(address user) external view returns (uint256) {
        uint256 nextClaimTime = lastFaucetClaim[user] + FAUCET_COOLDOWN;
        if (block.timestamp >= nextClaimTime) return 0;
        return nextClaimTime - block.timestamp;
    }
    
    /**
     * @notice Admin mint for special events/promotions
     */
    function adminMint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
```

### 4.3 Contract Configuration

```typescript
// lib/contracts/playToken.ts
export const PLAY_TOKEN_ABI = [
  // Read functions
  'function balanceOf(address account) view returns (uint256)',
  'function canClaimFaucet(address user) view returns (bool)',
  'function timeUntilNextClaim(address user) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  
  // Write functions
  'function faucet() external',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  
  // Events
  'event FaucetClaimed(address indexed user, uint256 amount)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
] as const;
```

### 4.4 Frontend Integration

```typescript
// hooks/usePlayToken.ts
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';

export function usePlayToken() {
  const { address } = useAccount();
  
  // Read balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: PLAY_TOKEN_ADDRESS,
    abi: PLAY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  });

  // Check faucet availability
  const { data: canClaim } = useReadContract({
    address: PLAY_TOKEN_ADDRESS,
    abi: PLAY_TOKEN_ABI,
    functionName: 'canClaimFaucet',
    args: [address!],
    query: { enabled: !!address },
  });

  // Claim faucet
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const claimFaucet = () => {
    writeContract({
      address: PLAY_TOKEN_ADDRESS,
      abi: PLAY_TOKEN_ABI,
      functionName: 'faucet',
    });
  };

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    balance: balance ? formatEther(balance) : '0',
    canClaim,
    claimFaucet,
    isPending: isPending || isConfirming,
    isSuccess,
    refetchBalance,
  };
}
```

### 4.5 Faucet UI Component

```typescript
// components/FaucetButton.tsx
'use client';

import { usePlayToken } from '@/hooks/usePlayToken';

export function FaucetButton() {
  const { canClaim, claimFaucet, isPending, isSuccess } = usePlayToken();

  return (
    <button
      onClick={claimFaucet}
      disabled={!canClaim || isPending}
      className="btn-primary"
    >
      {isPending ? 'Claiming...' : 'Claim 1,000 $PLAY'}
    </button>
  );
}
```

### 4.6 Deployment Script

```typescript
// contracts/script/DeployPlayToken.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PlayToken.sol";

contract DeployPlayToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        PlayToken token = new PlayToken();
        
        console.log("PlayToken deployed at:", address(token));
        
        vm.stopBroadcast();
    }
}
```

### 4.7 Deliverables Checklist

- [ ] PlayToken.sol contract written and tested
- [ ] Faucet function with 24-hour cooldown
- [ ] Contract deployed to Base Sepolia
- [ ] Contract verified on BaseScan
- [ ] Frontend hook for token interactions
- [ ] "Claim 1,000 $PLAY" button working
- [ ] Balance display component
- [ ] Token approval flow for markets

---

## Section 5: Smart Contracts - Market System

### 5.1 Overview

The market system consists of two contracts: `MarketFactory` (deploys new markets) and `BinaryMarket` (handles individual market logic, betting, and settlement).

### 5.2 BinaryMarket Contract

```solidity
// contracts/src/BinaryMarket.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BinaryMarket is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum MarketStatus { OPEN, CLOSED, PROPOSED, RESOLVED, DISPUTED }
    
    struct Bet {
        uint256 amount;
        bool outcome;
        bool claimed;
    }

    // Immutables
    IERC20 public immutable playToken;
    address public immutable oracle;
    address public immutable factory;
    
    // Market details
    string public question;
    string public sourceUrl;
    uint256 public bettingCloseTimestamp;
    uint256 public resolutionTimestamp;
    
    // Market state
    MarketStatus public status;
    bool public resolvedOutcome;
    uint256 public proposedTimestamp;
    uint256 public constant DISPUTE_WINDOW = 2 hours;
    
    // Betting pools
    uint256 public yesPool;
    uint256 public noPool;
    mapping(address => Bet) public bets;
    
    // Events
    event BetPlaced(address indexed user, bool outcome, uint256 amount);
    event MarketResolutionProposed(bool outcome, uint256 timestamp);
    event MarketResolved(bool outcome);
    event MarketDisputed(address indexed disputer, string reason);
    event WinningsClaimed(address indexed user, uint256 amount);
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle");
        _;
    }
    
    modifier marketOpen() {
        require(status == MarketStatus.OPEN, "Market not open");
        require(block.timestamp < bettingCloseTimestamp, "Betting closed");
        _;
    }

    constructor(
        address _playToken,
        address _oracle,
        string memory _question,
        string memory _sourceUrl,
        uint256 _bettingCloseTimestamp,
        uint256 _resolutionTimestamp
    ) {
        playToken = IERC20(_playToken);
        oracle = _oracle;
        factory = msg.sender;
        question = _question;
        sourceUrl = _sourceUrl;
        bettingCloseTimestamp = _bettingCloseTimestamp;
        resolutionTimestamp = _resolutionTimestamp;
        status = MarketStatus.OPEN;
    }

    /**
     * @notice Place a bet on this market
     * @param _outcome true = YES, false = NO
     * @param _amount Amount of PLAY tokens to bet
     */
    function placeBet(bool _outcome, uint256 _amount) external nonReentrant marketOpen {
        require(_amount > 0, "Amount must be > 0");
        require(bets[msg.sender].amount == 0, "Already placed bet");
        
        playToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        bets[msg.sender] = Bet({
            amount: _amount,
            outcome: _outcome,
            claimed: false
        });
        
        if (_outcome) {
            yesPool += _amount;
        } else {
            noPool += _amount;
        }
        
        emit BetPlaced(msg.sender, _outcome, _amount);
    }

    /**
     * @notice Oracle proposes the market resolution
     * @param _outcome The proposed outcome
     */
    function proposeResolution(bool _outcome) external onlyOracle {
        require(status == MarketStatus.OPEN || status == MarketStatus.CLOSED, "Invalid status");
        require(block.timestamp >= resolutionTimestamp, "Too early to resolve");
        
        status = MarketStatus.PROPOSED;
        resolvedOutcome = _outcome;
        proposedTimestamp = block.timestamp;
        
        emit MarketResolutionProposed(_outcome, block.timestamp);
    }

    /**
     * @notice Finalize resolution after dispute window
     */
    function finalizeResolution() external {
        require(status == MarketStatus.PROPOSED, "Not in proposed state");
        require(
            block.timestamp >= proposedTimestamp + DISPUTE_WINDOW,
            "Dispute window active"
        );
        
        status = MarketStatus.RESOLVED;
        emit MarketResolved(resolvedOutcome);
    }

    /**
     * @notice Dispute the proposed resolution
     * @param _reason Reason for dispute
     */
    function disputeResolution(string calldata _reason) external {
        require(status == MarketStatus.PROPOSED, "Not in proposed state");
        require(
            block.timestamp < proposedTimestamp + DISPUTE_WINDOW,
            "Dispute window closed"
        );
        require(bets[msg.sender].amount > 0, "Must have bet to dispute");
        
        status = MarketStatus.DISPUTED;
        emit MarketDisputed(msg.sender, _reason);
    }

    /**
     * @notice Claim winnings after market resolution
     */
    function claimWinnings() external nonReentrant {
        require(status == MarketStatus.RESOLVED, "Market not resolved");
        
        Bet storage bet = bets[msg.sender];
        require(bet.amount > 0, "No bet placed");
        require(!bet.claimed, "Already claimed");
        require(bet.outcome == resolvedOutcome, "Did not win");
        
        bet.claimed = true;
        
        uint256 totalPool = yesPool + noPool;
        uint256 winningPool = resolvedOutcome ? yesPool : noPool;
        uint256 winnings = (bet.amount * totalPool) / winningPool;
        
        playToken.safeTransfer(msg.sender, winnings);
        
        emit WinningsClaimed(msg.sender, winnings);
    }

    /**
     * @notice Get current odds
     */
    function getOdds() external view returns (uint256 yesOdds, uint256 noOdds) {
        uint256 total = yesPool + noPool;
        if (total == 0) return (50, 50);
        
        yesOdds = (yesPool * 100) / total;
        noOdds = (noPool * 100) / total;
    }
}
```

### 5.3 MarketFactory Contract

```solidity
// contracts/src/MarketFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BinaryMarket.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketFactory is Ownable {
    address public playToken;
    address public oracle;
    
    address[] public markets;
    mapping(address => bool) public isMarket;
    
    event MarketCreated(
        address indexed market,
        string question,
        uint256 bettingCloseTimestamp,
        uint256 resolutionTimestamp
    );
    
    constructor(address _playToken, address _oracle) Ownable(msg.sender) {
        playToken = _playToken;
        oracle = _oracle;
    }

    /**
     * @notice Create a new prediction market
     * @param _question The market question
     * @param _sourceUrl URL for result verification
     * @param _bettingCloseTimestamp When betting closes (15 min before event)
     * @param _resolutionTimestamp When market can be resolved
     */
    function createMarket(
        string calldata _question,
        string calldata _sourceUrl,
        uint256 _bettingCloseTimestamp,
        uint256 _resolutionTimestamp
    ) external onlyOwner returns (address) {
        require(_bettingCloseTimestamp < _resolutionTimestamp, "Invalid timestamps");
        require(_bettingCloseTimestamp > block.timestamp, "Close time in past");
        
        BinaryMarket market = new BinaryMarket(
            playToken,
            oracle,
            _question,
            _sourceUrl,
            _bettingCloseTimestamp,
            _resolutionTimestamp
        );
        
        address marketAddress = address(market);
        markets.push(marketAddress);
        isMarket[marketAddress] = true;
        
        emit MarketCreated(
            marketAddress,
            _question,
            _bettingCloseTimestamp,
            _resolutionTimestamp
        );
        
        return marketAddress;
    }

    /**
     * @notice Get all market addresses
     */
    function getMarkets() external view returns (address[] memory) {
        return markets;
    }

    /**
     * @notice Get market count
     */
    function getMarketCount() external view returns (uint256) {
        return markets.length;
    }

    /**
     * @notice Update oracle address
     */
    function setOracle(address _oracle) external onlyOwner {
        oracle = _oracle;
    }
}
```

### 5.4 Anti-Frontrunning Mechanism

```
Event Time: 3:00 PM
Betting Close: 2:45 PM (15 minutes before)
Resolution Time: 5:00 PM (after event concludes)

Timeline:
├─────────────────┼──────────────┼─────────────────┤
Open             2:45 PM      3:00 PM         5:00 PM
(Betting)        (Close)      (Event)         (Resolve)
```

### 5.5 Dispute Window Flow

```
Resolution Proposed ──► 2-Hour Window ──► Finalized
                           │
                           ▼
                    User Dispute ──► Admin Review ──► Manual Resolution
```

### 5.6 Deliverables Checklist

- [ ] BinaryMarket.sol contract written and tested
- [ ] MarketFactory.sol contract written and tested
- [ ] Anti-frontrunning timestamp logic (15 min buffer)
- [ ] 2-hour dispute window implemented
- [ ] Contracts deployed to Base Sepolia
- [ ] Contracts verified on BaseScan
- [ ] Frontend hooks for market interactions
- [ ] One manual market deployed and resolved

---

## Section 6: Frontend Application

### 6.1 Overview

The frontend is a Next.js 15 application with App Router, deployed on Vercel. It provides market discovery, trading interface, and user dashboard.

### 6.2 Page Structure

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Homepage / Market discovery
├── globals.css             # Global styles
├── markets/
│   ├── page.tsx            # All markets list
│   └── [address]/
│       └── page.tsx        # Individual market page
├── dashboard/
│   └── page.tsx            # User dashboard (bets, history)
├── leaderboard/
│   └── page.tsx            # Top traders
├── how-it-works/
│   └── page.tsx            # Explainer page
└── api/
    ├── markets/
    │   └── route.ts        # Proxy to VPS API
    └── user/
        └── route.ts        # User data endpoints
```

### 6.3 Key Components

```
components/
├── auth/
│   ├── LoginButton.tsx     # Privy login trigger
│   ├── UserMenu.tsx        # Logged-in user dropdown
│   └── AuthGuard.tsx       # Protected route wrapper
├── market/
│   ├── MarketCard.tsx      # Market preview card
│   ├── MarketList.tsx      # Grid of market cards
│   ├── MarketDetail.tsx    # Full market view
│   └── MarketFilters.tsx   # Category/status filters
├── trading/
│   ├── TradePanel.tsx      # Buy YES/NO interface
│   ├── PriceChart.tsx      # Odds visualization
│   ├── TradeHistory.tsx    # User's bet history
│   └── AlreadyTraded.tsx   # Post-bet view
├── wallet/
│   ├── WalletBalance.tsx   # $PLAY balance display
│   ├── FaucetButton.tsx    # Claim tokens
│   └── PasskeySetup.tsx    # Enable FaceID/TouchID
└── ui/
    ├── Button.tsx
    ├── Card.tsx
    ├── Modal.tsx
    └── Toast.tsx
```

### 6.4 State Management

```typescript
// lib/wagmi.ts
import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'viem/chains';

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
});
```

### 6.5 Market Discovery Page

```typescript
// app/page.tsx
import { MarketList } from '@/components/market/MarketList';
import { MarketFilters } from '@/components/market/MarketFilters';

export default async function HomePage() {
  const markets = await fetchMarkets();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Active Markets</h1>
      <MarketFilters />
      <MarketList markets={markets} />
    </main>
  );
}

async function fetchMarkets() {
  const res = await fetch(`${process.env.VPS_API_URL}/markets`, {
    headers: { 'X-OSPM-Secret': process.env.VPS_API_SECRET! },
    next: { revalidate: 60 },
  });
  return res.json();
}
```

### 6.6 Trade Panel Component

```typescript
// components/trading/TradePanel.tsx
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

interface TradePanelProps {
  marketAddress: `0x${string}`;
  yesOdds: number;
  noOdds: number;
}

export function TradePanel({ marketAddress, yesOdds, noOdds }: TradePanelProps) {
  const [outcome, setOutcome] = useState<boolean | null>(null);
  const [amount, setAmount] = useState('');
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleTrade = async () => {
    if (outcome === null || !amount) return;
    
    // First approve tokens
    await writeContract({
      address: PLAY_TOKEN_ADDRESS,
      abi: PLAY_TOKEN_ABI,
      functionName: 'approve',
      args: [marketAddress, parseEther(amount)],
    });
    
    // Then place bet
    writeContract({
      address: marketAddress,
      abi: BINARY_MARKET_ABI,
      functionName: 'placeBet',
      args: [outcome, parseEther(amount)],
    });
  };

  return (
    <div className="trade-panel">
      <div className="outcome-buttons">
        <button 
          className={`yes-btn ${outcome === true ? 'selected' : ''}`}
          onClick={() => setOutcome(true)}
        >
          YES ({yesOdds}%)
        </button>
        <button 
          className={`no-btn ${outcome === false ? 'selected' : ''}`}
          onClick={() => setOutcome(false)}
        >
          NO ({noOdds}%)
        </button>
      </div>
      
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in $PLAY"
      />
      
      <button 
        onClick={handleTrade}
        disabled={isPending || isConfirming || outcome === null}
      >
        {isPending || isConfirming ? 'Processing...' : 'Place Bet'}
      </button>
    </div>
  );
}
```

### 6.7 Responsive Design Requirements

- Mobile-first approach
- Touch-friendly bet buttons (minimum 44px tap targets)
- Swipe gestures for market navigation
- Bottom sheet for trade panel on mobile
- Progressive Web App (PWA) support

### 6.8 Deliverables Checklist

- [ ] Next.js 15 App Router structure
- [ ] Privy + wagmi providers configured
- [ ] Homepage with market discovery
- [ ] Individual market page with trading
- [ ] User dashboard with bet history
- [ ] Wallet balance and faucet integration
- [ ] Responsive design for mobile
- [ ] Loading states and error handling
- [ ] Toast notifications for transactions
- [ ] Deployed to Vercel

---

## Section 7: Backend Services & Database

### 7.1 Overview

The backend runs on AWS Lightsail VPS, hosting the PostgreSQL database, API layer, and background services (Oracle, AI Agent).

### 7.2 VPS Setup

```bash
# AWS Lightsail: Ubuntu 22.04, 2GB RAM minimum

# 1. Initial setup
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx

# 2. Setup 2GB Swap (prevent build crashes)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 3. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Install PM2 for process management
sudo npm install -g pm2
```

### 7.3 Database Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  privyUserId   String   @unique
  address       String   @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  bets          Bet[]
}

model Market {
  id                    String       @id @default(cuid())
  contractAddress       String       @unique
  question              String
  description           String?
  category              String
  sourceUrl             String
  imageUrl              String?
  
  bettingCloseTimestamp DateTime
  resolutionTimestamp   DateTime
  
  status                MarketStatus @default(PENDING)
  resolvedOutcome       Boolean?
  
  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt
  deployedAt            DateTime?
  resolvedAt            DateTime?
  
  bets                  Bet[]
  aiLogs                AILog[]
}

model Bet {
  id            String   @id @default(cuid())
  userId        String
  marketId      String
  txHash        String   @unique
  
  outcome       Boolean
  amount        Decimal  @db.Decimal(36, 18)
  
  claimed       Boolean  @default(false)
  claimTxHash   String?
  
  createdAt     DateTime @default(now())
  
  user          User     @relation(fields: [userId], references: [id])
  market        Market   @relation(fields: [marketId], references: [id])
  
  @@index([userId])
  @@index([marketId])
}

model AILog {
  id          String   @id @default(cuid())
  marketId    String?
  prompt      String
  response    String
  model       String
  tokensUsed  Int
  createdAt   DateTime @default(now())
  
  market      Market?  @relation(fields: [marketId], references: [id])
}

enum MarketStatus {
  PENDING
  DEPLOYED
  OPEN
  CLOSED
  PROPOSED
  DISPUTED
  RESOLVED
  CANCELLED
}
```

### 7.4 API Layer

```typescript
// server/api/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
});
app.use(limiter);

// API authentication
app.use((req, res, next) => {
  const secret = req.headers['x-ospm-secret'];
  if (secret !== process.env.VPS_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Routes
app.use('/api/markets', marketsRouter);
app.use('/api/users', usersRouter);
app.use('/api/oracle', oracleRouter);
app.use('/api/admin', adminRouter);

app.listen(3001, () => {
  console.log('API server running on port 3001');
});
```

### 7.5 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/markets` | List all markets (with filters) |
| GET | `/api/markets/:address` | Get market details |
| POST | `/api/markets` | Create new market (admin) |
| GET | `/api/users/:address/bets` | Get user's bet history |
| POST | `/api/oracle/propose` | Propose market resolution |
| POST | `/api/oracle/finalize` | Finalize resolution |
| GET | `/api/admin/pending` | Markets pending resolution |

### 7.6 Database Backup Script

```bash
#!/bin/bash
# scripts/backup_db.sh

BACKUP_DIR="/var/backups/postgres"
S3_BUCKET="ospm-backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME="ospm_backup_${DATE}.sql.gz"

# Create backup
pg_dump $DATABASE_URL | gzip > "${BACKUP_DIR}/${FILENAME}"

# Upload to S3
aws s3 cp "${BACKUP_DIR}/${FILENAME}" "s3://${S3_BUCKET}/${FILENAME}"

# Keep only last 7 days locally
find ${BACKUP_DIR} -type f -mtime +7 -delete

echo "Backup completed: ${FILENAME}"
```

### 7.7 Cron Jobs

```bash
# /etc/cron.d/ospm

# Daily database backup at 3 AM
0 3 * * * ospm /home/ospm/scripts/backup_db.sh >> /var/log/ospm/backup.log 2>&1

# Check for expired markets every 5 minutes
*/5 * * * * ospm /home/ospm/server/oracle/check_expired.sh >> /var/log/ospm/oracle.log 2>&1

# AI market generation daily at 8 AM
0 8 * * * ospm /home/ospm/ai/generate_markets.sh >> /var/log/ospm/ai.log 2>&1
```

### 7.8 Deliverables Checklist

- [ ] AWS Lightsail VPS provisioned
- [ ] 2GB swap configured
- [ ] PostgreSQL installed and configured
- [ ] Prisma schema migrated
- [ ] Express API server running with PM2
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate (Let's Encrypt)
- [ ] Rate limiting enabled
- [ ] API authentication via X-OSPM-Secret header
- [ ] Daily database backup to S3
- [ ] Monitoring and logging setup

---

## Section 8: AI Market Generation Engine

### 8.1 Overview

The AI Market Generation Engine automatically scrapes relevant data sources, generates market proposals via LLM, and deploys them to the blockchain.

### 8.2 Data Sources (Nigeria Focus)

| Source | Type | URL Pattern |
|--------|------|-------------|
| NBS | Economic Stats | https://nigerianstat.gov.ng |
| NPFL | Football | https://npfl.ng |
| News | Current Events | RSS feeds from major outlets |
| CBN | Finance | https://cbn.gov.ng |

### 8.3 Scraper Architecture

```python
# ai/scraper/main.py
import asyncio
import aiohttp
from bs4 import BeautifulSoup
from dataclasses import dataclass
from typing import List

@dataclass
class ScrapedEvent:
    title: str
    description: str
    source_url: str
    event_date: str
    category: str
    raw_data: dict

class BaseScraper:
    async def scrape(self) -> List[ScrapedEvent]:
        raise NotImplementedError

class NPFLScraper(BaseScraper):
    BASE_URL = "https://npfl.ng/fixtures"
    
    async def scrape(self) -> List[ScrapedEvent]:
        async with aiohttp.ClientSession() as session:
            async with session.get(self.BASE_URL) as response:
                html = await response.text()
                return self.parse_fixtures(html)
    
    def parse_fixtures(self, html: str) -> List[ScrapedEvent]:
        soup = BeautifulSoup(html, 'html.parser')
        events = []
        
        for fixture in soup.select('.fixture-item'):
            events.append(ScrapedEvent(
                title=fixture.select_one('.teams').text,
                description=f"NPFL Match: {fixture.select_one('.teams').text}",
                source_url=f"{self.BASE_URL}/{fixture['data-id']}",
                event_date=fixture.select_one('.date').text,
                category="sports",
                raw_data={}
            ))
        
        return events

async def run_all_scrapers():
    scrapers = [
        NPFLScraper(),
        NBSScraper(),
        NewsScraper(),
    ]
    
    all_events = []
    for scraper in scrapers:
        try:
            events = await scraper.scrape()
            all_events.extend(events)
        except Exception as e:
            logger.error(f"Scraper failed: {e}")
    
    return all_events
```

### 8.4 AI Agent (Market Generator)

```python
# ai/agent/market_generator.py
import openai
from typing import List, Optional
from pydantic import BaseModel

class MarketProposal(BaseModel):
    question: str
    description: str
    category: str
    source_url: str
    betting_close_offset_hours: int
    resolution_offset_hours: int
    verification_keywords: List[str]

SYSTEM_PROMPT = """You are a prediction market creator for OSPM.
Generate binary YES/NO market questions from news events.

Rules:
1. Questions must be objectively verifiable
2. Questions should be interesting and engaging
3. Include the exact verification keywords
4. Set appropriate timeframes
5. Keep questions concise (< 100 chars)

Output JSON format:
{
  "question": "Will [event] happen by [date]?",
  "description": "Context about the event...",
  "category": "sports|politics|economics|entertainment",
  "source_url": "verification URL",
  "betting_close_offset_hours": 1-24,
  "resolution_offset_hours": 2-48,
  "verification_keywords": ["keyword1", "keyword2"]
}
"""

async def generate_market(event: ScrapedEvent) -> Optional[MarketProposal]:
    client = openai.AsyncOpenAI()
    
    response = await client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"""
                Event: {event.title}
                Description: {event.description}
                Date: {event.event_date}
                Source: {event.source_url}
                Category: {event.category}
                
                Generate a prediction market for this event.
            """}
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )
    
    try:
        data = json.loads(response.choices[0].message.content)
        return MarketProposal(**data)
    except Exception as e:
        logger.error(f"Failed to parse market proposal: {e}")
        return None
```

### 8.5 Sanity Check (Pre-deployment Validation)

```python
# ai/agent/validator.py
import aiohttp
from typing import Tuple

async def validate_market(proposal: MarketProposal) -> Tuple[bool, str]:
    """
    Validate market before deployment:
    1. Source URL returns 200 OK
    2. Page contains verification keywords
    3. Timeframes are reasonable
    """
    
    # Check source URL
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(proposal.source_url, timeout=10) as response:
                if response.status != 200:
                    return False, f"Source URL returned {response.status}"
                
                html = await response.text()
                
                # Check for keywords
                found_keywords = sum(
                    1 for kw in proposal.verification_keywords 
                    if kw.lower() in html.lower()
                )
                
                if found_keywords < len(proposal.verification_keywords) // 2:
                    return False, "Insufficient keyword matches in source"
                    
        except Exception as e:
            return False, f"Failed to fetch source: {e}"
    
    # Validate timeframes
    if proposal.betting_close_offset_hours < 1:
        return False, "Betting close too soon"
    
    if proposal.resolution_offset_hours < proposal.betting_close_offset_hours:
        return False, "Resolution before betting close"
    
    return True, "Validation passed"
```

### 8.6 Deployment Worker

```typescript
// server/workers/deployMarket.ts
import { ethers } from 'ethers';
import { prisma } from '../lib/prisma';

const MARKET_FACTORY_ABI = [...];

export async function deployMarket(proposal: MarketProposal) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);
  
  const factory = new ethers.Contract(
    process.env.MARKET_FACTORY_ADDRESS!,
    MARKET_FACTORY_ABI,
    wallet
  );

  const bettingCloseTimestamp = Math.floor(Date.now() / 1000) + 
    (proposal.betting_close_offset_hours * 3600);
  
  const resolutionTimestamp = Math.floor(Date.now() / 1000) + 
    (proposal.resolution_offset_hours * 3600);

  const tx = await factory.createMarket(
    proposal.question,
    proposal.source_url,
    bettingCloseTimestamp,
    resolutionTimestamp
  );

  const receipt = await tx.wait();
  const marketAddress = receipt.logs[0].args.market;

  // Save to database
  await prisma.market.create({
    data: {
      contractAddress: marketAddress,
      question: proposal.question,
      description: proposal.description,
      category: proposal.category,
      sourceUrl: proposal.source_url,
      bettingCloseTimestamp: new Date(bettingCloseTimestamp * 1000),
      resolutionTimestamp: new Date(resolutionTimestamp * 1000),
      status: 'DEPLOYED',
      deployedAt: new Date(),
    },
  });

  return marketAddress;
}
```

### 8.7 Daily Generation Pipeline

```python
# ai/pipeline/daily_markets.py
import asyncio
from datetime import datetime

async def generate_daily_markets(target_count: int = 5):
    """Generate up to 5 markets per day"""
    
    # 1. Scrape all sources
    events = await run_all_scrapers()
    logger.info(f"Scraped {len(events)} events")
    
    # 2. Generate market proposals
    proposals = []
    for event in events[:target_count * 2]:  # Get extras for validation failures
        proposal = await generate_market(event)
        if proposal:
            proposals.append(proposal)
    
    # 3. Validate proposals
    valid_proposals = []
    for proposal in proposals:
        is_valid, reason = await validate_market(proposal)
        if is_valid:
            valid_proposals.append(proposal)
        else:
            logger.warning(f"Rejected: {proposal.question} - {reason}")
    
    # 4. Deploy markets (up to target_count)
    deployed = 0
    for proposal in valid_proposals[:target_count]:
        try:
            address = await deploy_market(proposal)
            logger.info(f"Deployed market: {address}")
            deployed += 1
        except Exception as e:
            logger.error(f"Deployment failed: {e}")
    
    return deployed

if __name__ == "__main__":
    asyncio.run(generate_daily_markets())
```

### 8.8 Deliverables Checklist

- [ ] Scraper implementations for 3+ sources
- [ ] OpenAI integration for market generation
- [ ] Sanity check validator (URL + keywords)
- [ ] Market deployment worker (Node.js)
- [ ] Daily pipeline script
- [ ] Cron job for automated generation
- [ ] AI logging to database
- [ ] Error handling and retry logic
- [ ] 5 markets/day generation target

---

## Section 9: Oracle & Settlement System

### 9.1 Overview

The Oracle Gateway is a secure Node.js service that monitors markets for expiration and triggers settlement. It holds the admin/oracle private key and is the only entity authorized to resolve markets.

### 9.2 Oracle Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ORACLE GATEWAY (VPS)                     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   Market    │    │   Result    │    │  Settlement │    │
│  │   Monitor   │───►│   Fetcher   │───►│   Executor  │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│         │                   │                   │          │
│         ▼                   ▼                   ▼          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                   PostgreSQL DB                      │  │
│  │  (Market status, resolution proposals, disputes)     │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                                │
│                           ▼                                │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Oracle Private Key (Secure)             │  │
│  └─────────────────────────────────────────────────────┘  │
│                           │                                │
└───────────────────────────┼────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Base Sepolia │
                    │  (Blockchain) │
                    └───────────────┘
```

### 9.3 Market Monitor Service

```typescript
// server/oracle/monitor.ts
import { ethers } from 'ethers';
import { prisma } from '../lib/prisma';
import { notifyAdmin } from './notifications';

const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

export class MarketMonitor {
  private provider: ethers.JsonRpcProvider;
  
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  }

  async start() {
    console.log('Oracle Market Monitor started');
    
    setInterval(async () => {
      await this.checkExpiredMarkets();
      await this.checkProposedMarkets();
    }, CHECK_INTERVAL);
  }

  async checkExpiredMarkets() {
    const expiredMarkets = await prisma.market.findMany({
      where: {
        status: { in: ['DEPLOYED', 'OPEN', 'CLOSED'] },
        resolutionTimestamp: { lte: new Date() },
      },
    });

    for (const market of expiredMarkets) {
      console.log(`Market ready for resolution: ${market.id}`);
      await this.queueForResolution(market);
    }
  }

  async checkProposedMarkets() {
    const proposedMarkets = await prisma.market.findMany({
      where: {
        status: 'PROPOSED',
      },
    });

    for (const market of proposedMarkets) {
      const contract = new ethers.Contract(
        market.contractAddress,
        BINARY_MARKET_ABI,
        this.provider
      );
      
      const proposedTimestamp = await contract.proposedTimestamp();
      const disputeWindow = await contract.DISPUTE_WINDOW();
      const canFinalize = Date.now() / 1000 >= proposedTimestamp + disputeWindow;
      
      if (canFinalize) {
        await this.finalizeResolution(market);
      }
    }
  }

  async queueForResolution(market: Market) {
    // Add to resolution queue for manual or automatic resolution
    await prisma.market.update({
      where: { id: market.id },
      data: { status: 'PENDING_RESOLUTION' },
    });
    
    await notifyAdmin(`Market ready for resolution: ${market.question}`);
  }
}
```

### 9.4 Result Fetcher

```typescript
// server/oracle/resultFetcher.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchResult(
  sourceUrl: string,
  verificationKeywords: string[]
): Promise<{ outcome: boolean | null; confidence: number; evidence: string }> {
  try {
    const response = await axios.get(sourceUrl, { timeout: 10000 });
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract text content
    const text = $('body').text().toLowerCase();
    
    // Check for outcome indicators
    const positiveIndicators = ['won', 'passed', 'approved', 'yes', 'confirmed'];
    const negativeIndicators = ['lost', 'failed', 'rejected', 'no', 'denied'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    for (const indicator of positiveIndicators) {
      if (text.includes(indicator)) positiveCount++;
    }
    
    for (const indicator of negativeIndicators) {
      if (text.includes(indicator)) negativeCount++;
    }
    
    // Check keyword presence
    const keywordMatches = verificationKeywords.filter(kw => 
      text.includes(kw.toLowerCase())
    ).length;
    
    const keywordConfidence = keywordMatches / verificationKeywords.length;
    
    if (keywordConfidence < 0.5) {
      return { outcome: null, confidence: 0, evidence: 'Insufficient keyword matches' };
    }
    
    const outcome = positiveCount > negativeCount ? true : 
                   negativeCount > positiveCount ? false : null;
    
    const confidence = Math.abs(positiveCount - negativeCount) / 
                      (positiveCount + negativeCount + 1);
    
    return {
      outcome,
      confidence,
      evidence: `Found ${positiveCount} positive, ${negativeCount} negative indicators`,
    };
  } catch (error) {
    return { outcome: null, confidence: 0, evidence: `Fetch error: ${error}` };
  }
}
```

### 9.5 Settlement Executor

```typescript
// server/oracle/executor.ts
import { ethers } from 'ethers';
import { prisma } from '../lib/prisma';
import { notifyAdmin } from './notifications';

export class SettlementExecutor {
  private wallet: ethers.Wallet;
  
  constructor() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY!, provider);
  }

  async proposeResolution(marketAddress: string, outcome: boolean) {
    const contract = new ethers.Contract(
      marketAddress,
      BINARY_MARKET_ABI,
      this.wallet
    );

    const tx = await contract.proposeResolution(outcome);
    const receipt = await tx.wait();

    await prisma.market.update({
      where: { contractAddress: marketAddress },
      data: {
        status: 'PROPOSED',
        resolvedOutcome: outcome,
      },
    });

    await notifyAdmin(
      `Resolution proposed for ${marketAddress}: ${outcome ? 'YES' : 'NO'}`
    );

    return receipt;
  }

  async finalizeResolution(marketAddress: string) {
    const contract = new ethers.Contract(
      marketAddress,
      BINARY_MARKET_ABI,
      this.wallet
    );

    const tx = await contract.finalizeResolution();
    const receipt = await tx.wait();

    await prisma.market.update({
      where: { contractAddress: marketAddress },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });

    return receipt;
  }
}
```

### 9.6 Dispute Handler

```typescript
// server/oracle/disputes.ts
import { prisma } from '../lib/prisma';
import { notifyAdmin } from './notifications';

export async function handleDispute(
  marketAddress: string,
  disputer: string,
  reason: string
) {
  await prisma.market.update({
    where: { contractAddress: marketAddress },
    data: { status: 'DISPUTED' },
  });

  // Notify admin via Telegram/Discord
  await notifyAdmin(`
    🚨 MARKET DISPUTED 🚨
    
    Market: ${marketAddress}
    Disputer: ${disputer}
    Reason: ${reason}
    
    Action required: Manual review
  `);

  // Create dispute record
  await prisma.dispute.create({
    data: {
      marketAddress,
      disputer,
      reason,
      status: 'PENDING_REVIEW',
    },
  });
}
```

### 9.7 Admin Dashboard API

```typescript
// server/api/admin.ts
import { Router } from 'express';
import { SettlementExecutor } from '../oracle/executor';

const router = Router();
const executor = new SettlementExecutor();

// List markets pending resolution
router.get('/pending', async (req, res) => {
  const markets = await prisma.market.findMany({
    where: { status: 'PENDING_RESOLUTION' },
    orderBy: { resolutionTimestamp: 'asc' },
  });
  res.json(markets);
});

// Manually propose resolution
router.post('/propose', async (req, res) => {
  const { marketAddress, outcome } = req.body;
  
  try {
    const receipt = await executor.proposeResolution(marketAddress, outcome);
    res.json({ success: true, txHash: receipt.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manually finalize resolution
router.post('/finalize', async (req, res) => {
  const { marketAddress } = req.body;
  
  try {
    const receipt = await executor.finalizeResolution(marketAddress);
    res.json({ success: true, txHash: receipt.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Review dispute
router.post('/disputes/:id/review', async (req, res) => {
  const { id } = req.params;
  const { resolution, override_outcome } = req.body;
  
  // Handle dispute resolution...
});

export default router;
```

### 9.8 Notification Service

```typescript
// server/oracle/notifications.ts
import axios from 'axios';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

export async function notifyAdmin(message: string) {
  // Telegram notification
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }
    );
  }

  // Discord webhook (alternative)
  if (process.env.DISCORD_WEBHOOK_URL) {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      content: message,
    });
  }

  // Also log to database
  console.log('[ADMIN NOTIFICATION]', message);
}
```

### 9.9 Deliverables Checklist

- [ ] Market Monitor service running
- [ ] Result Fetcher with keyword matching
- [ ] Settlement Executor with secure key management
- [ ] Dispute detection and handling
- [ ] 2-hour dispute window enforced
- [ ] Admin API for manual resolution
- [ ] Telegram/Discord notification bot
- [ ] One market manually resolved via admin dashboard
- [ ] Dispute flow tested end-to-end

---

## Section 10: Gas Sponsorship & Paymaster

### 10.1 Overview

The Paymaster sponsors gas fees for users, making all $PLAY token transactions appear "free". This is powered by the Coinbase Developer Platform (CDP).

### 10.2 How Paymasters Work

```
User Transaction Flow (Without Paymaster):
User ──► Signs Tx ──► Pays Gas (ETH) ──► Tx Executed

User Transaction Flow (With Paymaster):
User ──► Signs UserOp ──► Paymaster Sponsors Gas ──► Tx Executed
                              │
                              └──► Your VPS pays (sponsored)
```

### 10.3 CDP Paymaster Setup

```bash
# 1. Create CDP account at https://portal.cdp.coinbase.com
# 2. Create a new project
# 3. Enable Paymaster for Base Sepolia
# 4. Get API credentials
```

### 10.4 Paymaster Configuration

```typescript
// lib/paymaster.ts
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { paymasterClient } from '@coinbase/onchainkit';

export const paymasterConfig = {
  paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL!,
  sponsorshipPolicyId: process.env.CDP_SPONSORSHIP_POLICY_ID!,
};

export async function getPaymasterData(userOp: UserOperation) {
  const response = await fetch(paymasterConfig.paymasterUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CDP_API_KEY}`,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'pm_sponsorUserOperation',
      params: [userOp, paymasterConfig.sponsorshipPolicyId],
      id: 1,
    }),
  });

  const data = await response.json();
  return data.result;
}
```

### 10.5 Wagmi Integration with Paymaster

```typescript
// hooks/useSponsoredTransaction.ts
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { useCapabilities, useWriteContracts } from 'wagmi/experimental';

export function useSponsoredTransaction() {
  const { data: capabilities } = useCapabilities();
  
  const { writeContracts, data: hash, isPending } = useWriteContracts();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const executeSponsoredTx = async (
    contracts: WriteContractsParameters['contracts']
  ) => {
    const paymasterCapability = capabilities?.[baseSepolia.id]?.paymasterService;
    
    writeContracts({
      contracts,
      capabilities: paymasterCapability ? {
        paymasterService: {
          url: process.env.NEXT_PUBLIC_PAYMASTER_URL!,
        },
      } : undefined,
    });
  };

  return {
    executeSponsoredTx,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}
```

### 10.6 Sponsored Trade Example

```typescript
// components/trading/SponsoredTradePanel.tsx
'use client';

import { useSponsoredTransaction } from '@/hooks/useSponsoredTransaction';
import { parseEther } from 'viem';

export function SponsoredTradePanel({ marketAddress }: { marketAddress: `0x${string}` }) {
  const { executeSponsoredTx, isPending } = useSponsoredTransaction();
  
  const handleTrade = async (outcome: boolean, amount: string) => {
    await executeSponsoredTx([
      // First: Approve tokens
      {
        address: PLAY_TOKEN_ADDRESS,
        abi: PLAY_TOKEN_ABI,
        functionName: 'approve',
        args: [marketAddress, parseEther(amount)],
      },
      // Second: Place bet
      {
        address: marketAddress,
        abi: BINARY_MARKET_ABI,
        functionName: 'placeBet',
        args: [outcome, parseEther(amount)],
      },
    ]);
  };

  return (
    <div>
      {/* Trade UI */}
      <p className="text-green-500 text-sm">✓ Gas fees sponsored</p>
    </div>
  );
}
```

### 10.7 Sponsorship Policy (CDP Dashboard)

```json
{
  "name": "OSPM Play Token Transactions",
  "chainId": 84532,
  "rules": {
    "maxSpendPerUser": "0.01",
    "maxSpendPerUserPeriod": "daily",
    "allowedContracts": [
      "${PLAY_TOKEN_ADDRESS}",
      "${MARKET_FACTORY_ADDRESS}"
    ],
    "allowedMethods": [
      "faucet()",
      "approve(address,uint256)",
      "placeBet(bool,uint256)",
      "claimWinnings()"
    ]
  }
}
```

### 10.8 Fallback: Manual Gas Funding

```typescript
// If paymaster fails, prompt user to get testnet ETH
export function GasWarning() {
  const { data: balance } = useBalance({ address });
  
  if (balance && balance.value < parseEther('0.001')) {
    return (
      <div className="warning-banner">
        <p>Low gas balance. Get testnet ETH from:</p>
        <a href="https://www.coinbase.com/faucets/base-sepolia-faucet">
          Base Sepolia Faucet
        </a>
      </div>
    );
  }
  
  return null;
}
```

### 10.9 Cost Monitoring

```typescript
// server/api/sponsorship.ts
// Track sponsorship costs

export async function logSponsoredTx(
  userAddress: string,
  txHash: string,
  gasCostWei: bigint
) {
  await prisma.sponsoredTransaction.create({
    data: {
      userAddress,
      txHash,
      gasCostWei: gasCostWei.toString(),
      gasCostUsd: await convertToUsd(gasCostWei),
      timestamp: new Date(),
    },
  });
}

// Daily cost report
export async function getDailySponsorshipCost() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const result = await prisma.sponsoredTransaction.aggregate({
    where: { timestamp: { gte: today } },
    _sum: { gasCostUsd: true },
    _count: true,
  });
  
  return {
    totalUsd: result._sum.gasCostUsd || 0,
    txCount: result._count,
  };
}
```

### 10.10 Deliverables Checklist

- [ ] CDP account created and configured
- [ ] Paymaster enabled for Base Sepolia
- [ ] Sponsorship policy defined (allowed contracts/methods)
- [ ] wagmi hooks integrated with paymaster
- [ ] Users can transact without holding ETH
- [ ] Faucet claims sponsored
- [ ] Trade transactions sponsored
- [ ] Fallback for paymaster failures
- [ ] Cost monitoring and logging
- [ ] Daily sponsorship budget alerts

---

## Appendix A: Development Setup

### Local Development

```bash
# Clone repository
git clone https://github.com/ospm/ospm.git
cd ospm

# Install dependencies
npm install

# Setup environment
cp env.example .env.local

# Start database
docker-compose up -d postgres

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables Template

```env
# .env.example

# Auth (Privy)
NEXT_PUBLIC_PRIVY_APP_ID=
PRIVY_APP_SECRET=

# Blockchain
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
DEPLOYER_PRIVATE_KEY=
ORACLE_PRIVATE_KEY=

# Contracts (fill after deployment)
NEXT_PUBLIC_PLAY_TOKEN_ADDRESS=
NEXT_PUBLIC_MARKET_FACTORY_ADDRESS=

# Paymaster (CDP)
NEXT_PUBLIC_PAYMASTER_URL=
CDP_API_KEY=
CDP_API_SECRET=
CDP_SPONSORSHIP_POLICY_ID=

# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/ospm
VPS_API_SECRET=your-secret-key-here
NEXT_PUBLIC_VPS_API_URL=https://api.yourdomain.com

# AI
OPENAI_API_KEY=

# Notifications
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=
DISCORD_WEBHOOK_URL=
```

---

## Appendix B: Deployment Checklist

### Pre-Launch

- [ ] All smart contracts deployed and verified
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to AWS Lightsail
- [ ] Database migrations complete
- [ ] SSL certificates configured
- [ ] Environment variables set in production
- [ ] Paymaster funded with ETH
- [ ] Admin wallet funded for oracle operations

### Post-Launch Monitoring

- [ ] Uptime monitoring (UptimeRobot/Better Stack)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Posthog/Mixpanel)
- [ ] Sponsorship cost alerts
- [ ] Database backup verification
- [ ] Security audit completed

---

## Appendix C: Security Considerations

1. **Private Key Management**: Oracle and deployer keys stored in secure environment variables, never committed to git
2. **API Authentication**: All VPS endpoints protected with `X-OSPM-Secret` header
3. **Rate Limiting**: 100 requests per 15 minutes per IP
4. **Input Validation**: All user inputs sanitized before database storage
5. **Smart Contract Audits**: Recommend professional audit before mainnet
6. **Admin Access**: Multi-factor authentication for admin dashboard

---

## Appendix D: Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Code style and conventions
- Pull request process
- Issue reporting
- Testing requirements

---

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

**OSPM - Open Source Prediction Market**  
*Democratizing prediction markets with Web3 rails and Web2 UX*

