# Testing Guide

This guide walks through testing the Counter dApp end-to-end.

## Pre-flight Checklist

- [ ] Backend `.env` file exists with correct CONTRACT_ADDRESS and CHAIN_ID
- [ ] Frontend `.env` file exists with NEXT_PUBLIC_API_URL
- [ ] MetaMask installed and connected to Base Sepolia
- [ ] Wallet has some Base Sepolia ETH for gas

## Test 1: Backend API

### Start the Backend

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
Backend running at http://localhost:4000
```

### Test Health Endpoint

Open in browser or use curl:
```bash
curl http://localhost:4000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 123.456
}
```

**Status:** ✅ Pass / ❌ Fail

### Test Config Endpoint

```bash
curl http://localhost:4000/api/config
```

Expected response:
```json
{
  "contractAddress": "0x27b7d12981dEE74D14CF9665FDd828f6a6eDdc60",
  "chainId": 84532
}
```

**Status:** ✅ Pass / ❌ Fail

---

## Test 2: Frontend Application

### Start the Frontend

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
Ready on http://localhost:3000
```

### Test 2.1: Initial Load

1. Open http://localhost:3000 in your browser
2. You should see "Counter dApp" heading
3. You should see a "Connect" button

**Status:** ✅ Pass / ❌ Fail

### Test 2.2: Config Loading

Check browser console (F12):
- Should see no errors
- Network tab should show successful fetch to `/api/config`

**Status:** ✅ Pass / ❌ Fail

### Test 2.3: Wrong Network Detection

1. Make sure MetaMask is connected to a different network (e.g., Ethereum Mainnet)
2. Click "Connect MetaMask"
3. Should see "Wrong network" error message
4. Error should say "Please switch to chain ID 84532 (Base Sepolia testnet)"

**Status:** ✅ Pass / ❌ Fail

### Test 2.4: Network Switch

1. Switch MetaMask to Base Sepolia:
   - Network Name: Base Sepolia
   - Chain ID: 84532
   - RPC URL: https://sepolia.base.org
   - Currency Symbol: ETH
2. Error message should disappear
3. You should see the counter interface

**Status:** ✅ Pass / ❌ Fail

### Test 2.5: Wallet Connection

1. Click "Connect MetaMask"
2. MetaMask popup should appear
3. Approve the connection
4. Should see:
   - "Connected: 0x1234...5678" (your address)
   - "Disconnect" link
   - Current count display: "Count: 0" (or current value)
   - "Increment" button (green)
   - "Decrement" button (red)

**Status:** ✅ Pass / ❌ Fail

### Test 2.6: Read Contract State

1. Counter should display current value from blockchain
2. Value should be a number (likely 0 if fresh deployment)

**Status:** ✅ Pass / ❌ Fail

### Test 2.7: Increment Function

1. Click "Increment" button
2. Button should change to "Confirm…" and be disabled
3. MetaMask popup should appear for transaction confirmation
4. Confirm the transaction
5. Wait for transaction to complete
6. Counter should update to new value (previous + 1)
7. Button should re-enable

**Expected:** Count increases by 1
**Actual:** _____

**Status:** ✅ Pass / ❌ Fail

### Test 2.8: Decrement Function

1. Click "Decrement" button
2. Button should change to "Confirm…" and be disabled
3. MetaMask popup should appear
4. Confirm the transaction
5. Wait for transaction to complete
6. Counter should update to new value (previous - 1)
7. Button should re-enable

**Expected:** Count decreases by 1
**Actual:** _____

**Status:** ✅ Pass / ❌ Fail

### Test 2.9: Multiple Operations

1. Click "Increment" 3 times (wait for each to complete)
2. Count should increase by 3 total
3. Click "Decrement" 2 times
4. Count should decrease by 2 total
5. Final count should be initial + 1

**Expected:** Correct count after sequence
**Actual:** _____

**Status:** ✅ Pass / ❌ Fail

### Test 2.10: Underflow Protection

1. If count is > 0, decrement until count = 0
2. Try to decrement when count = 0
3. Transaction should revert
4. MetaMask should show error
5. Count should remain 0

**Expected:** Transaction fails with "Counter: underflow"
**Actual:** _____

**Status:** ✅ Pass / ❌ Fail

### Test 2.11: Transaction Rejection

1. Click "Increment"
2. When MetaMask popup appears, click "Reject"
3. Button should re-enable
4. No error should crash the app
5. Counter should remain unchanged

**Status:** ✅ Pass / ❌ Fail

### Test 2.12: Disconnect Wallet

1. Click "Disconnect" link
2. Should return to "Connect" screen
3. Counter interface should hide

**Status:** ✅ Pass / ❌ Fail

---

## Test 3: Contract on Base Sepolia

### View on Basescan

1. Open https://sepolia.basescan.org/address/0x27b7d12981dEE74D14CF9665FDd828f6a6eDdc60
2. Should see Counter contract
3. Check recent transactions match your increment/decrement operations

**Status:** ✅ Pass / ❌ Fail

### Read Contract

1. Go to "Contract" → "Read Contract"
2. Call `getCount()`
3. Should return current count value

**Status:** ✅ Pass / ❌ Fail

---

## Test 4: Error Scenarios

### Test 4.1: Backend Down

1. Stop the backend server (Ctrl+C)
2. Refresh frontend
3. Should see "Config error" message
4. Error should mention backend not running

**Status:** ✅ Pass / ❌ Fail

### Test 4.2: Invalid Contract Address

1. Edit backend `.env`, change CONTRACT_ADDRESS to invalid address
2. Restart backend
3. Frontend should show error when trying to read contract

**Status:** ✅ Pass / ❌ Fail

---

## Summary

Total Tests: 16
Passed: ___
Failed: ___

## Common Issues

**Issue:** "Connect MetaMask" button doesn't appear
**Solution:** Check browser console for errors, ensure MetaMask is installed

**Issue:** Transaction fails with "insufficient funds"
**Solution:** Get Base Sepolia ETH from faucet

**Issue:** Wrong network error persists after switching
**Solution:** Refresh the page after switching networks

**Issue:** Count doesn't update after transaction
**Solution:** Wait 10-15 seconds for block confirmation, or refresh page

**Issue:** Backend returns 503
**Solution:** Ensure CONTRACT_ADDRESS is set in backend/.env

---

## Next Steps After Testing

If all tests pass:
1. Commit any final changes
2. Update SOLUTION.md if needed
3. Submit repository link
