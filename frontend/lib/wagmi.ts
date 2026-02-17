"use client";

import { createConfig, http } from "wagmi";
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
  },
};

// Determine which chain to use based on chainId
const activeChain = chainId === 84532 ? baseSepolia : localhost;

export const config = createConfig({
  chains: [localhost, baseSepolia],
  transports: {
    [localhost.id]: http(),
    [baseSepolia.id]: http(),
  },
});
