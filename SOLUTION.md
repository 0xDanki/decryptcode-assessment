# Solution – Counter dApp

This repository contains a full-stack decentralized counter application deployed on Base Sepolia testnet, consisting of a Solidity smart contract, Node.js REST API backend, and Next.js TypeScript frontend.

**Deployed Contract:** `0x27b7d12981dEE74D14CF9665FDd828f6a6eDdc60` (Base Sepolia)

---

## 1. Setup & Run

### Prerequisites

- Node.js 18+
- A wallet with Base Sepolia ETH (for testing)
- MetaMask or compatible Web3 wallet browser extension

### Part 1: Smart Contract

**Local Hardhat Network:**

```bash
# Navigate to contracts folder
cd contracts

# Install dependencies
npm install

# Compile contract
npx hardhat compile

# Run tests
npx hardhat test

# In terminal 1: Start local Hardhat node
npx hardhat node

# In terminal 2: Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

**Base Sepolia Testnet (Already Deployed):**

The contract is already deployed at `0x27b7d12981dEE74D14CF9665FDd828f6a6eDdc60` on Base Sepolia.

To deploy a new instance:

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your private key (without 0x prefix)
# PRIVATE_KEY=your_private_key_here

# Deploy to Base Sepolia
npm run deploy:baseSepolia

# Verify contract (optional)
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

### Part 2: Backend API

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with deployed contract info
# (Already configured for Base Sepolia deployment)
cat > .env << EOF
CONTRACT_ADDRESS=0x27b7d12981dEE74D14CF9665FDd828f6a6eDdc60
CHAIN_ID=84532
PORT=4000
EOF

# Start the backend server
npm run dev
```

The backend will be available at `http://localhost:4000`

**Verify endpoints:**
- GET `http://localhost:4000/api/health` - Returns `{ status: "ok" }`
- GET `http://localhost:4000/api/config` - Returns contract address and chain ID

### Part 3: Frontend dApp

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file to use backend API
cat > .env << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CHAIN_ID=84532
EOF

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

**Testing the dApp:**

1. Open `http://localhost:3000` in your browser
2. Make sure MetaMask is connected to Base Sepolia testnet:
   - Network Name: Base Sepolia
   - Chain ID: 84532
   - RPC URL: https://sepolia.base.org
   - Currency: ETH
3. Click "Connect" to connect your wallet
4. Use "Increment" and "Decrement" buttons to interact with the contract
5. Transactions will require confirmation in MetaMask

---

## 2. Design Decisions

### Smart Contract

**Solidity 0.8.20**
- Chose Solidity 0.8+ for built-in overflow/underflow protection
- No need for SafeMath library, reducing gas costs and complexity
- Latest stable version with modern language features

**Underflow Protection**
- Used `require(_count > 0)` to prevent decrement below zero
- Provides clear error message for users
- Simpler than alternative approaches (unchecked blocks, custom errors)

**Events**
- Added `CounterIncremented` and `CounterDecremented` events
- Enables off-chain monitoring and frontend reactivity
- Standard practice for state-changing functions
- Events emit the new count value for easy tracking

**NatSpec Documentation**
- Comprehensive documentation for all functions and events
- Improves code readability and maintainability
- Essential for contract verification and audits

**Testing**
- Implemented 15 comprehensive test cases covering:
  - Deployment and initial state
  - Increment/decrement functionality
  - Underflow protection
  - Event emissions
  - Access control (public access)
  - Complex operation sequences

### Backend

**Node.js + Express**
- Lightweight and widely used for REST APIs
- Simple to deploy and maintain
- Express provides robust routing and middleware support

**Environment-based Configuration**
- Contract address and chain ID stored in `.env`
- Easy to update without code changes
- Separate configs for different deployment environments

**Error Handling**
- Returns HTTP 503 when contract address is not configured
- Clear JSON error messages for frontend consumption
- Consistent error response structure

**CORS Enabled**
- Allows frontend to make cross-origin requests during development
- Can be restricted to specific origins in production

### Frontend

**Next.js 14 + TypeScript**
- Next.js provides excellent developer experience and performance
- TypeScript ensures type safety and reduces runtime errors
- App Router for modern React patterns

**wagmi + viem**
- Industry-standard library for Ethereum interactions
- Built-in wallet connection management
- React hooks for contract reads/writes
- Better TypeScript support than ethers.js alone
- Handles transaction lifecycle automatically

**Backend API for Configuration**
- Frontend fetches contract address and chain ID from backend
- Allows contract updates without frontend rebuild
- More production-ready than hardcoded addresses
- Falls back to environment variables if API is unavailable

**Network Validation**
- Checks if wallet is connected to correct chain
- Shows clear error message with expected chain ID
- Prevents transactions on wrong networks
- Includes network names (e.g., "Base Sepolia testnet")

**UX Considerations**
- Loading states for config fetch
- Error states with actionable messages
- Disabled buttons during transaction confirmation
- Real-time count updates after transactions
- Wallet connection status display

**Styling**
- Tailwind CSS for rapid UI development
- Clean, professional design with clear visual hierarchy
- Responsive layout works on mobile and desktop

---

## 3. Potential Improvements

### High Priority

**1. Wallet Connector Integration**
- Currently relies on injected provider (MetaMask)
- Add WalletConnect, Coinbase Wallet for broader compatibility
- Can be done by adding connectors to wagmi config

**2. Transaction History**
- Display recent increment/decrement actions
- Use the backend `/api/activity` endpoint (already exists)
- Show transaction hashes with Basescan links

**3. Enhanced Error Messages**
- More specific error handling for common failure cases
- Transaction rejection reasons
- Gas estimation failures
- Insufficient balance warnings

**4. Contract Access Control**
- Implement Ownable pattern for administrative functions
- Add pause mechanism for emergency situations
- Role-based permissions for different operations

### Medium Priority

**5. Automated Testing**
- Frontend component tests (Jest + React Testing Library)
- Backend API integration tests
- End-to-end tests with Playwright

**6. Contract Enhancements**
- Add `incrementBy(uint256)` and `decrementBy(uint256)` functions
- Add `reset()` function with access control
- Constructor to set initial count value
- Custom errors instead of require strings (gas optimization)

**7. Multi-Chain Support**
- Support multiple networks (Ethereum mainnet, Polygon, etc.)
- Chain-specific contract deployments
- Network switching prompts in UI

**8. Performance Optimization**
- Implement contract event listening for real-time updates
- Cache contract reads with proper invalidation
- Optimize bundle size (code splitting, lazy loading)

### Low Priority

**9. UI/UX Enhancements**
- Animations for count changes
- Success notifications after transactions
- Dark mode support
- Mobile-optimized layout improvements

**10. Backend Enhancements**
- Database for persistent activity logs
- Rate limiting for API endpoints
- Authentication for write operations
- WebSocket support for real-time updates

**11. DevOps**
- CI/CD pipeline for automated testing and deployment
- Docker containers for consistent environments
- Monitoring and alerting for production
- Gas price estimation API integration

**12. Security Audits**
- Professional smart contract audit
- Frontend security review
- Dependency vulnerability scanning

---

## Technology Stack

- **Smart Contract:** Solidity 0.8.20, Hardhat
- **Backend:** Node.js 18+, Express.js, dotenv
- **Frontend:** Next.js 14, React 18, TypeScript, wagmi 2.5, viem 2.0, Tailwind CSS
- **Network:** Base Sepolia Testnet (Chain ID: 84532)
- **Testing:** Hardhat (contracts), Chai (assertions)
