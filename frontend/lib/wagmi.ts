"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hardhat, baseSepolia } from "wagmi/chains";

const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? "31337", 10);

// Local Hardhat chain config (matches hardhat node)
const localhost = {
  ...hardhat,
  id: 31337,
  name: "Localhost",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
};

export const config = getDefaultConfig({
  appName: "Counter dApp",
  projectId: "YOUR_PROJECT_ID", // Get from WalletConnect Cloud (optional for this demo)
  chains: [localhost, baseSepolia],
  ssr: true,
});
