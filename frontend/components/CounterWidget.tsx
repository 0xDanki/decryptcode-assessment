"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient, useWatchContractEvent } from "wagmi";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { COUNTER_ABI } from "@/lib/contract";
import { useAppConfig } from "@/lib/useAppConfig";

type Activity = {
  type: "increment" | "decrement";
  address: string;
  newCount: string;
  timestamp: number;
  txHash: string;
};

export function CounterWidget() {
  const { address, isConnected, chain } = useAccount();
  const configState = useAppConfig();
  const publicClient = usePublicClient();

  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  const contractAddress = configState.status === "ready" ? configState.config?.contractAddress ?? null : null;
  const expectedChainId = configState.status === "ready" ? configState.config?.chainId ?? null : null;

  const { data: count, refetch: refetchCount } = useReadContract({
    address: contractAddress ?? undefined,
    abi: COUNTER_ABI,
    functionName: "getCount",
    query: {
      refetchInterval: 3000, // Poll every 3 seconds
    },
  });

  const {
    writeContract: writeIncrement,
    isPending: isIncrementPending,
    data: incrementTxHash,
  } = useWriteContract();
  const {
    writeContract: writeDecrement,
    isPending: isDecrementPending,
    data: decrementTxHash,
  } = useWriteContract();

  useWaitForTransactionReceipt({
    hash: incrementTxHash,
    onSuccess: () => refetchCount(),
  });
  useWaitForTransactionReceipt({
    hash: decrementTxHash,
    onSuccess: () => refetchCount(),
  });

  // Listen to contract events for real-time updates (when available)
  useWatchContractEvent({
    address: contractAddress ?? undefined,
    abi: COUNTER_ABI,
    eventName: "CounterIncremented",
    enabled: !!contractAddress,
    onLogs: (logs) => {
      console.log("CounterIncremented event detected", logs);
      refetchCount();
    },
  });

  useWatchContractEvent({
    address: contractAddress ?? undefined,
    abi: COUNTER_ABI,
    eventName: "CounterDecremented",
    enabled: !!contractAddress,
    onLogs: (logs) => {
      console.log("CounterDecremented event detected", logs);
      refetchCount();
    },
  });

  // Fetch recent activity from contract events
  useEffect(() => {
    if (!contractAddress || !publicClient) return;

    const fetchRecentActivity = async () => {
      try {
        const currentBlock = await publicClient.getBlockNumber();
        const fromBlock = currentBlock - 1000n; // Last ~1000 blocks

        const [incrementLogs, decrementLogs] = await Promise.all([
          publicClient.getLogs({
            address: contractAddress,
            event: {
              type: "event",
              name: "CounterIncremented",
              inputs: [{ type: "uint256", name: "newCount", indexed: false }],
            },
            fromBlock,
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: contractAddress,
            event: {
              type: "event",
              name: "CounterDecremented",
              inputs: [{ type: "uint256", name: "newCount", indexed: false }],
            },
            fromBlock,
            toBlock: "latest",
          }),
        ]);

        const allLogs = [
          ...incrementLogs.map((log) => ({
            type: "increment" as const,
            address: log.args.newCount ? "Unknown" : "Unknown", // Events don't include caller address in current contract
            newCount: log.args.newCount?.toString() ?? "0",
            timestamp: 0,
            txHash: log.transactionHash ?? "",
            blockNumber: log.blockNumber,
          })),
          ...decrementLogs.map((log) => ({
            type: "decrement" as const,
            address: log.args.newCount ? "Unknown" : "Unknown",
            newCount: log.args.newCount?.toString() ?? "0",
            timestamp: 0,
            txHash: log.transactionHash ?? "",
            blockNumber: log.blockNumber,
          })),
        ];

        // Sort by block number (most recent first) and take last 10
        allLogs.sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));
        
        // Fetch transaction details to get actual caller addresses
        const enrichedLogs = await Promise.all(
          allLogs.slice(0, 10).map(async (log) => {
            try {
              const tx = await publicClient.getTransaction({ hash: log.txHash as `0x${string}` });
              const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
              return {
                ...log,
                address: tx.from,
                timestamp: Number(block.timestamp) * 1000,
              };
            } catch {
              return log;
            }
          })
        );

        setRecentActivity(enrichedLogs);
      } catch (error) {
        console.error("Error fetching activity:", error);
      }
    };

    fetchRecentActivity();
  }, [contractAddress, publicClient, count]);

  const handleDecrement = () => {
    if (count === 0n) {
      setShowWarning(true);
    } else {
      writeDecrement({ address: contractAddress!, abi: COUNTER_ABI, functionName: "decrement" });
    }
  };

  const isTxPending = isIncrementPending || isDecrementPending;
  const wrongNetwork = expectedChainId !== null && chain?.id !== expectedChainId;
  const canInteract = isConnected && !wrongNetwork && contractAddress;

  return (
    <div className="w-full max-w-2xl">
      {/* Header with Connect Button */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Counter dApp</h1>
          <p className="mt-1 text-sm text-gray-500">
            {expectedChainId === 84532 ? "Base Sepolia Testnet" : "Local Hardhat Network"}
          </p>
        </div>
        <ConnectButton />
      </div>

      {/* Error States */}
      {configState.status === "loading" && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-600">Loading configuration...</p>
        </div>
      )}

      {configState.status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-900">Configuration Error</p>
          <p className="mt-2 text-sm text-red-700">{configState.message}</p>
          <p className="mt-3 text-xs text-red-600">
            Make sure the backend is running at http://localhost:4000 or set NEXT_PUBLIC_CONTRACT_ADDRESS in .env
          </p>
        </div>
      )}

      {!contractAddress && configState.status === "ready" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-amber-900">Contract Not Configured</p>
          <p className="mt-2 text-sm text-amber-700">
            No contract address found. Please configure the backend or set NEXT_PUBLIC_CONTRACT_ADDRESS.
          </p>
        </div>
      )}

      {wrongNetwork && contractAddress && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-semibold text-amber-900">Wrong Network</p>
          <p className="mt-2 text-sm text-amber-700">
            Please switch to {expectedChainId === 31337 ? "Hardhat local network" : "Base Sepolia testnet"} (Chain ID: {expectedChainId})
          </p>
          <p className="mt-1 text-xs text-amber-600">
            Currently connected to chain ID: {chain?.id ?? "unknown"}
          </p>
        </div>
      )}

      {/* Main Counter Interface */}
      {contractAddress && configState.status === "ready" && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
          {/* Counter Display */}
          <div className="border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-12 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-600">Current Count</p>
            <p className="font-mono text-7xl font-bold text-gray-900">
              {count !== undefined ? String(count) : "—"}
            </p>
          </div>

          {/* Controls */}
          <div className="p-6">
            {!isConnected && (
              <div className="rounded-lg bg-blue-50 p-6 text-center">
                <p className="text-sm text-blue-900">Connect your wallet to interact with the counter</p>
                <p className="mt-2 text-xs text-blue-700">Use the "Connect Wallet" button above</p>
              </div>
            )}

            {canInteract && (
              <div className="space-y-4">
                {/* Warning for underflow */}
                {count === 0n && (
                  <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                    <p className="text-sm font-medium text-amber-900">
                      ⚠️ Counter is at zero
                    </p>
                    <p className="mt-1 text-xs text-amber-700">
                      Attempting to decrement will fail and waste gas. The transaction will revert with "Counter: underflow".
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleDecrement}
                    disabled={isTxPending}
                    className="group relative overflow-hidden rounded-lg bg-red-600 px-6 py-4 font-semibold text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="relative z-10">
                      {isDecrementPending ? "Confirming..." : "Decrement"}
                    </span>
                    {!isTxPending && (
                      <span className="absolute inset-0 -z-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></span>
                    )}
                  </button>

                  <button
                    onClick={() => writeIncrement({ address: contractAddress!, abi: COUNTER_ABI, functionName: "increment" })}
                    disabled={isTxPending}
                    className="group relative overflow-hidden rounded-lg bg-green-600 px-6 py-4 font-semibold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="relative z-10">
                      {isIncrementPending ? "Confirming..." : "Increment"}
                    </span>
                    {!isTxPending && (
                      <span className="absolute inset-0 -z-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></span>
                    )}
                  </button>
                </div>

                {isTxPending && (
                  <div className="rounded-lg bg-blue-50 p-4 text-center">
                    <p className="text-sm text-blue-900">
                      Waiting for transaction confirmation...
                    </p>
                  </div>
                )}

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-600">
                    Contract: <span className="font-mono">{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</span>
                  </p>
                  {expectedChainId === 84532 && (
                    <a
                      href={`https://sepolia.basescan.org/address/${contractAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs text-blue-600 hover:text-blue-800"
                    >
                      View on Basescan →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {contractAddress && configState.status === "ready" && recentActivity.length > 0 && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-xs text-gray-500">Last 10 transactions</p>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full px-2 py-1 text-xs font-medium ${
                    activity.type === "increment" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {activity.type === "increment" ? "+1" : "-1"}
                  </div>
                  <div>
                    <p className="font-mono text-sm text-gray-900">
                      {activity.address.slice(0, 6)}...{activity.address.slice(-4)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.timestamp > 0 
                        ? new Date(activity.timestamp).toLocaleTimeString()
                        : "Recent"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">→ {activity.newCount}</p>
                  {expectedChainId === 84532 && activity.txHash && (
                    <a
                      href={`https://sepolia.basescan.org/tx/${activity.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      View tx
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 text-center text-4xl">⚠️</div>
            <h3 className="text-center text-xl font-bold text-gray-900">
              Cannot Decrement Below Zero
            </h3>
            <p className="mt-3 text-center text-sm text-gray-600">
              The counter is currently at <span className="font-bold">0</span>. 
              Attempting to decrement will cause the transaction to <span className="font-semibold text-red-600">revert</span>, 
              wasting your gas fees.
            </p>
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setShowWarning(false)}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Got it, thanks!
              </button>
              <button
                onClick={() => {
                  setShowWarning(false);
                  writeDecrement({ address: contractAddress!, abi: COUNTER_ABI, functionName: "decrement" });
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Try anyway (not recommended)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
