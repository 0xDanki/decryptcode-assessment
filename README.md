# Counter dApp - Full Stack Web3 Application

A decentralized counter application built with Solidity, Node.js, and Next.js. Deployed on Base Sepolia testnet.

[![Deployed on Base Sepolia](https://img.shields.io/badge/Base-Sepolia-blue)](https://sepolia.basescan.org/address/0x27b7d12981dEE74D14CF9665FDd828f6a6eDdc60)
[![Smart Contract](https://img.shields.io/badge/Contract-Verified-success)](https://sepolia.basescan.org/address/0x27b7d12981dEE74D14CF9665FDd828f6a6eDdc60)

## Live Demo

- **Contract Address**: `0x27b7d12981dEE74D14CF9665FDd828f6a6eDdc60`
- **Network**: Base Sepolia (Chain ID: 84532)
- **Explorer**: [View on Basescan](https://sepolia.basescan.org/address/0x27b7d12981dEE74D14CF9665FDd828f6a6eDdc60)

## Overview

This is a complete full-stack Web3 application demonstrating best practices in blockchain development. The project consists of three main components:

1. **Smart Contract** (Solidity) - On-chain counter with event emissions and comprehensive tests
2. **Backend API** (Node.js + Express) - REST API serving contract configuration
3. **Frontend dApp** (Next.js + TypeScript) - Modern UI with RainbowKit wallet integration

## Key Features

- ✅ **Real-Time Updates** - Counter refreshes automatically via polling and event listening
- ✅ **UX Tweaks** - Warning system prevents failed transactions
- ✅ **Activity Tracking** - Displays last 10 interactions from any user
- ✅ **Basic UI** - Clean, modern interface with RainbowKit integration
- ✅ **Comprehensive Testing** - 15 test cases covering all contract functionality
- ✅ **Multi-Network Support** - Works on both local Hardhat and Base Sepolia
- ✅ **Complete Documentation** - Setup guides, rationale, and improvement recommendations

## Technology Stack

### Smart Contract
- Solidity 0.8.20
- Hardhat
- OpenZeppelin patterns
- Chai for testing

### Backend
- Node.js 18+
- Express.js
- dotenv for configuration
- CORS enabled

### Frontend
- Next.js 14 (App Router)
- TypeScript
- wagmi 2.5 + viem 2.0
- RainbowKit
- TanStack Query
- Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or compatible Web3 wallet
- Base Sepolia ETH (get from [Base faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet))

### 1. Clone and Install

```bash
git clone https://github.com/0xDanki/decryptcode-assessment.git
cd decryptcode-assessment/Assessment
```

### 2. Start Backend

```bash
cd backend
npm install

# Backend is pre-configured with deployed contract
npm run dev
```

Backend will run at `http://localhost:4000`

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at `http://localhost:3000`

### 4. Configure MetaMask

Add Base Sepolia network to MetaMask:
- **Network Name**: Base Sepolia
- **RPC URL**: `https://sepolia.base.org`
- **Chain ID**: `84532`
- **Currency**: ETH

### 5. Test the dApp

1. Open `http://localhost:3000`
2. Click "Connect Wallet" and select MetaMask
3. Ensure you're on Base Sepolia network
4. Try incrementing and decrementing the counter!

## Testing Guide

### Backend Testing

```bash
cd backend

# Test health endpoint
curl http://localhost:4000/api/health

# Test config endpoint
curl http://localhost:4000/api/config
```

Expected responses:
- Health: `{"status":"ok","timestamp":"...","uptime":...}`
- Config: `{"contractAddress":"0x27b7...dc60","chainId":84532}`

### Smart Contract Testing

```bash
cd contracts
npm install
npx hardhat test
```

All 15 tests should pass:
- Deployment tests
- Increment/decrement functionality
- Underflow protection
- Event emissions
- Access control
- Complex scenarios

### Frontend Testing

1. **Connect Wallet**: Verify wallet connection modal appears
2. **Wrong Network**: Test switching networks
3. **Counter Display**: Check current count loads correctly
4. **Increment**: Click increment, confirm transaction, verify count increases
5. **Decrement**: Click decrement, confirm transaction, verify count decreases
6. **Underflow Warning**: Try decrementing at 0, verify warning appears
7. **Real-Time Updates**: Open two windows, increment in one, watch other update
8. **Activity Feed**: Scroll down to see recent transactions

For detailed testing checklist, see [TESTING.md](./TESTING.md)

## Architecture & Design Decisions

### Smart Contract Design

**Solidity 0.8.20** was chosen for built-in overflow/underflow protection, eliminating the need for SafeMath libraries and reducing gas costs.

**Event Emissions**: Every state change emits events (`CounterIncremented`, `CounterDecremented`) enabling:
- Off-chain monitoring and indexing
- Real-time UI updates
- Transaction history tracking
- Audit trails

**NatSpec Documentation**: Comprehensive inline documentation for all functions and events, facilitating contract verification and maintainability.

**Testing Strategy**: 15 test cases provide complete coverage including edge cases, event emissions, and access control.

### Backend Architecture

**Express.js** provides a lightweight, proven framework for REST APIs with excellent middleware support.

**Environment-Based Config**: Contract address and chain ID are stored in `.env` files, allowing easy deployment across different networks without code changes.

**Error Handling**: Consistent HTTP status codes and JSON error responses:
- 200: Success
- 503: Contract not configured
- 404: Route not found

**CORS Enabled**: Supports cross-origin requests for local development and production deployments.

### Frontend Architecture

**Next.js 14 App Router** offers:
- Server-side rendering capabilities
- Built-in routing
- Optimal performance
- Excellent developer experience

**RainbowKit + wagmi**: Industry-standard wallet connection providing:
- Support for multiple wallets (MetaMask, Coinbase Wallet, WalletConnect)
- Beautiful, customizable UI
- Mobile wallet support
- Network switching prompts

**Real-Time Updates**: Dual approach for reliability:
1. **Polling** (Primary): Queries blockchain every 3 seconds
2. **Event Listening** (Secondary): Immediate updates when events detected

**UX Optimizations**:
- Loading states with spinners
- Transaction pending indicators
- Gas-saving warnings (prevent failed transactions)
- Activity feed showing recent interactions
- Basescan links for transaction verification

## Project Structure

```
Assessment/
├── contracts/              # Smart contract layer
│   ├── contracts/
│   │   └── Counter.sol    # Main counter contract
│   ├── test/
│   │   └── Counter.test.js # 15 comprehensive tests
│   ├── scripts/
│   │   └── deploy.js      # Deployment script
│   └── hardhat.config.js  # Network configurations
│
├── backend/                # API layer
│   ├── routes/
│   │   ├── health.js      # Health check endpoint
│   │   └── config.js      # Contract config endpoint
│   ├── middleware/
│   │   ├── logger.js      # Request logging
│   │   └── errorHandler.js # Error handling
│   ├── config.js          # Environment config
│   └── index.js           # Express app entry
│
├── frontend/               # Presentation layer
│   ├── app/
│   │   ├── layout.tsx     # Root layout with providers
│   │   ├── page.tsx       # Home page
│   │   └── providers.tsx  # Wagmi & RainbowKit setup
│   ├── components/
│   │   └── CounterWidget.tsx # Main counter interface
│   └── lib/
│       ├── wagmi.ts       # Wagmi configuration
│       ├── contract.ts    # Contract ABI
│       └── useAppConfig.ts # Config hook
│
├── SOLUTION.md             # Complete solution documentation
├── TESTING.md              # Testing checklist
├── UX_IMPROVEMENTS.md      # UX recommendations
└── README.md               # This file
```

## Features Implemented

### Core Requirements ✅
- [x] Smart contract with increment/decrement/getCount
- [x] Underflow protection (reverts at 0)
- [x] Backend REST API with health and config endpoints
- [x] Frontend wallet connection
- [x] Contract read/write operations
- [x] Error handling and loading states
- [x] Comprehensive documentation

### Enhanced Features ✅
- [x] Event emissions for all state changes
- [x] NatSpec documentation
- [x] 15 comprehensive test cases
- [x] Real-time counter updates (polling + events)
- [x] Gas-saving warning system
- [x] Activity feed (last 10 transactions)
- [x] RainbowKit integration
- [x] Multi-network support (Hardhat + Base Sepolia)
- [x] Basescan integration
- [x] Professional UI/UX

## Rationale & Trade-offs

### Why Polling Over Pure Event Listening?

**Decision**: Implement 3-second polling as primary update mechanism

**Rationale**:
- Event watching requires WebSocket connections (not all RPC endpoints support)
- Polling is more reliable and works with any HTTP RPC
- 3 seconds provides good balance between responsiveness and API usage
- Events still used as secondary mechanism for instant updates when available

### Why RainbowKit Over Custom Wallet Connection?

**Decision**: Use RainbowKit instead of building custom connector

**Rationale**:
- Industry-standard library used by major dApps
- Handles edge cases (mobile wallets, network switching, etc.)
- Professional UI out of the box
- Reduces development time and maintenance burden
- Better user experience than custom implementation

### Why Backend API For Config?

**Decision**: Serve contract address via backend API instead of hardcoding

**Rationale**:
- Follows assessment requirements
- Allows contract updates without frontend rebuild
- Centralizes configuration management
- More production-ready approach
- Enables environment-specific deployments

## Future Improvements

See [UX_IMPROVEMENTS.md](./UX_IMPROVEMENTS.md) for detailed recommendations. Key priorities:

### High Priority
1. **Transaction Success Toasts** - Visual confirmation with react-hot-toast
2. **Loading Skeletons** - Improve perceived performance
3. **Gas Estimation** - Show cost before transaction
4. **Optimistic Updates** - Instant UI feedback
5. **Enhanced Activity Feed** - Filter, search, pagination

### Medium Priority
6. **Keyboard Shortcuts** - Power user features
7. **Dark Mode** - Theme toggle
8. **Mobile Optimization** - Better mobile wallet integration
9. **Contract Enhancements** - incrementBy, decrementBy, reset functions
10. **Backend Database** - Persistent activity storage

### Low Priority
11. **Automated CI/CD** - GitHub Actions
12. **Contract Monitoring** - Alert system
13. **Analytics** - User behavior tracking
14. **Multi-language Support** - i18n
15. **Progressive Web App** - Installable app

## Documentation

- **[SOLUTION.md](./SOLUTION.md)** - Complete setup guide and design decisions
- **[TESTING.md](./TESTING.md)** - Comprehensive testing checklist
- **[UX_IMPROVEMENTS.md](./UX_IMPROVEMENTS.md)** - UX enhancement recommendations
- **[contracts/README.md](./contracts/README.md)** - Smart contract documentation
- **[backend/README.md](./backend/README.md)** - Backend API documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend setup guide

## Deployment

The contract is deployed and verified on Base Sepolia:
- **Address**: `0x27b7d12981dEE74D14CF9665FDd828f6a6eDdc60`
- **Network**: Base Sepolia (84532)
- **Explorer**: [Basescan](https://sepolia.basescan.org/address/0x27b7d12981dEE74D14CF9665FDd828f6a6eDdc60)

To deploy your own instance:

```bash
cd contracts
cp .env.example .env
# Add your PRIVATE_KEY to .env
npm run deploy:baseSepolia
```

## License

This project was created as a basic sample for DecryptCode INC.

## Contact

For questions or feedback about this implementation, please open an issue on GitHub.

---

**Built with** ❤️ **by **Danki**
