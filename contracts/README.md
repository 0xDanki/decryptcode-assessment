# Part 1: Smart Contract

Implement the **Counter** contract as described in the root **ASSESSMENT.md**.

## Setup

```bash
cd contracts
npm install
```

## Contract Task

- Complete the `Counter` contract in `contracts/Counter.sol`.
- Implement `increment()`, `decrement()`, and `getCount()`.
- Use Solidity 0.8+ so that overflow/underflow reverts automatically, or handle underflow in `decrement()` (e.g. revert when count is 0).

## Compile

```bash
npx hardhat compile
```

## Test

Comprehensive tests are included in `test/Counter.test.js`:

```bash
npx hardhat test
```

Tests cover:
- Deployment (initial count is 0)
- Increment operations (single and multiple)
- Decrement operations (single and multiple)
- Underflow protection (prevents decrement below 0)
- Event emissions (CounterIncremented, CounterDecremented)
- Access control (any address can call functions)
- Complex scenarios (sequences of operations)

## Deploy

### Local deployment

In one terminal:

```bash
npx hardhat node
```

In another terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost
# or: npm run deploy:local
```

### Base Sepolia deployment

1. Copy `.env.example` to `.env` and configure:
   - `PRIVATE_KEY`: Your wallet private key (without 0x prefix)
   - `BASE_SEPOLIA_RPC_URL`: RPC endpoint (optional, defaults to public)
   - `BASESCAN_API_KEY`: API key for verification (optional)

2. Deploy:

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
# or: npm run deploy:baseSepolia
```

3. Verify contract (optional):

```bash
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

Save the deployed contract address; you will need it in the backend `.env` or frontend `.env`.

## Potential Improvements

The current implementation is a minimal viable counter contract. Below are potential enhancements ranked by importance:

### High Priority

1. **Access Control**
   - Implement role-based permissions (e.g., only owner can increment/decrement)
   - Use OpenZeppelin's `Ownable` or `AccessControl` for standardized patterns
   - Prevents unauthorized state changes in production environments

2. **Custom Errors**
   - Replace `require` with custom errors (e.g., `error CounterUnderflow()`)
   - Reduces gas costs and provides clearer error messages
   - Best practice in Solidity 0.8+

3. **Indexed Event Parameters**
   - Make event parameters indexed for efficient off-chain filtering
   - Example: `event CounterChanged(address indexed caller, uint256 newCount)`
   - Improves dApp event monitoring capabilities

### Medium Priority

4. **Reset Functionality**
   - Add `reset()` function to set counter back to zero or initial value
   - Useful for testing and maintenance scenarios
   - Should be access-controlled

5. **Constructor Initialization**
   - Allow setting initial counter value in constructor
   - Example: `constructor(uint256 initialValue)`
   - Provides deployment flexibility

6. **Batch Operations**
   - Add `incrementBy(uint256 amount)` and `decrementBy(uint256 amount)`
   - Reduces transaction costs for multiple increments/decrements
   - Improves user experience

### Low Priority

7. **Pausable Mechanism**
   - Implement emergency pause functionality using OpenZeppelin's `Pausable`
   - Allows contract suspension during security incidents
   - Standard practice for production contracts

8. **Gas Optimization**
   - Use `++_count` instead of `_count += 1` for minimal gas savings
   - Pack storage variables if additional state is needed
   - Use `unchecked` blocks where overflow is impossible

9. **Enhanced Documentation**
   - Add more detailed NatSpec with examples and edge cases
   - Document gas costs for each function
   - Include security considerations section

10. **Extended Testing**
    - Add fuzz testing for unexpected inputs
    - Test gas consumption benchmarks
    - Add integration tests with mock frontend
