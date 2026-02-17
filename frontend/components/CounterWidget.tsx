"use client";

import { useAccount } from "wagmi";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { COUNTER_ABI } from "@/lib/contract";
import { useAppConfig } from "@/lib/useAppConfig";

export function CounterWidget() {
  const { address, isConnected, chain } = useAccount();
  const configState = useAppConfig();

  const contractAddress = configState.status === "ready" ? configState.config?.contractAddress ?? null : null;
  const expectedChainId = configState.status === "ready" ? configState.config?.chainId ?? null : null;

  const { data: count, refetch: refetchCount } = useReadContract({
    address: contractAddress ?? undefined,
    abi: COUNTER_ABI,
    functionName: "getCount",
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
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => writeDecrement({ address: contractAddress!, abi: COUNTER_ABI, functionName: "decrement" })}
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
    </div>
  );
}
